import { NextResponse } from "next/server";

// Three-model roster. The first entry is the anchor and handles half of all
// requests (see CYCLE); the other two split the rest. Override for testing/ops
// with OLLAMA_MODELS="model-a,model-b,model-c" in .env.local — the first model
// listed gets the anchor weighting.
const DEFAULT_MODELS = ["gemma4:31b", "nemotron-3-nano:30b", "gpt-oss:20b"];

// Roster indices in serving order: the anchor (slot 0) takes every other request.
const CYCLE = [0, 1, 0, 2];

// Backfill candidates when a roster model dies, best first. Anything not listed
// here can still be picked from the live /api/tags catalog as a last resort.
const REPLACEMENT_CANDIDATES = [
  "minimax-m2.5",
  "minimax-m3",
  "kimi-k2.6",
  "kimi-k2.5",
  "gpt-oss:120b",
  "nemotron-3-super",
  "qwen3.5:397b",
  "mistral-large-3:675b",
];

// Module state lives for the server process: the roster heals itself across requests.
const roster: string[] =
  process.env.OLLAMA_MODELS?.split(",").map((s) => s.trim()).filter(Boolean) ??
  [...DEFAULT_MODELS];
let cursor = 0;
const failureNotes: string[] = [];
let replacing = false;

function noteFailure(model: string, reason: string) {
  const note = `${new Date().toISOString()} — ${model} failed: ${reason}`;
  failureNotes.push(note);
  if (failureNotes.length > 50) failureNotes.shift();
  console.warn(`[model-roster] ${note}`);
}

async function generate(
  model: string,
  prompt: string,
  apiKey: string,
  timeoutMs = 12000
): Promise<string> {
  const response = await fetch("https://ollama.com/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, prompt, stream: false }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();
  let data: { response?: string; error?: string } | undefined;
  try {
    data = JSON.parse(text);
  } catch {
    // fall through — non-JSON bodies are handled as errors below
  }

  // Ollama reports some failures (e.g. subscription-gated models) as 200s with
  // an `error` field, so a status check alone isn't enough.
  if (!response.ok || data?.error) {
    throw new Error(data?.error ?? `HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const question = data?.response?.trim();
  if (!question) throw new Error("empty response");
  return question;
}

// Swap dead models out of the roster. Runs after a response has been sent
// (fire-and-forget) so it never adds latency to the user's request.
async function replaceDeadModels(deadModels: string[], apiKey: string) {
  if (replacing) return;
  replacing = true;
  try {
    const res = await fetch("https://ollama.com/api/tags", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const catalog: string[] = ((await res.json()).models ?? []).map(
      (m: { name: string }) => m.name
    );
    const available = new Set(catalog);

    for (const dead of deadModels) {
      const idx = roster.indexOf(dead);
      if (idx === -1) continue;

      for (const candidate of [...REPLACEMENT_CANDIDATES, ...catalog]) {
        if (!available.has(candidate) || roster.includes(candidate) || candidate === dead) {
          continue;
        }
        // Smoke-test before trusting it: the catalog lists models the account
        // can't actually use (subscription tiers), and those only fail on generate.
        try {
          await generate(candidate, 'Reply with the single word "ok".', apiKey, 10000);
        } catch {
          continue;
        }
        roster[idx] = candidate;
        console.warn(
          `[model-roster] replaced ${dead} with ${candidate}; roster is now: ${roster.join(", ")}`
        );
        break;
      }
    }
  } catch (err) {
    console.warn(
      `[model-roster] could not find replacements for ${deadModels.join(", ")}:`,
      err
    );
  } finally {
    replacing = false;
  }
}

export async function POST(req: Request) {
  try {
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json({ question: "Unknown category" });
    }

    const apiKey = process.env.OLLAMA_API_KEY;
    if (!apiKey) {
      console.error("OLLAMA_API_KEY not set");
      return NextResponse.json({ question: "API key not configured" }, { status: 500 });
    }

    const prompt = `Generate one safe-for-work icebreaker question for the category "${category}".
    Rules: Keep it short, fun, and conversational. Avoid sexual content, politics, or religion.
    Be whimsical and unique — we've cleared out all basic questions, so try something creative.
    Return ONLY the question text.`;

    // Weighted rotation: each request starts from the next model in CYCLE, and
    // a failure falls through to the remaining two before giving up.
    const start = CYCLE[cursor++ % CYCLE.length] % roster.length;
    const order = [roster[start], ...roster.filter((_, i) => i !== start)];
    const failed: string[] = [];

    for (const model of order) {
      try {
        const question = await generate(model, prompt, apiKey);
        if (failed.length > 0) {
          void replaceDeadModels(failed, apiKey);
        }
        return NextResponse.json({ question, model });
      } catch (err) {
        noteFailure(model, err instanceof Error ? err.message : String(err));
        failed.push(model);
      }
    }

    return NextResponse.json(
      { question: "All AI models are unavailable right now. Please try again." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ question: "Failed to generate question" }, { status: 500 });
  }
}
