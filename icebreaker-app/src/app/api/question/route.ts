import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json({ question: "Unknown category" });
    }

    const prompt = `Generate one safe-for-work icebreaker question for the category "${category}".
    Rules: Keep it short, fun, and conversational. Avoid sexual content, politics, or religion.
    Be whimsical and unique — we've cleared out all basic questions, so try something creative.
    Return ONLY the question text.`;

    const apiKey = process.env.OLLAMA_API_KEY;

    if (!apiKey) {
      console.error("OLLAMA_API_KEY not set");
      return NextResponse.json({ question: "API key not configured" }, { status: 500 });
    }

    // Cap how long we'll wait on Ollama so a stalled upstream can't hang the request forever.
    const response = await fetch("https://ollama.com/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-oss:20b-cloud",
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error("Ollama API error:", response.statusText);
      return NextResponse.json({ question: "Failed to generate question" }, { status: 500 });
    }

    const data = await response.json();
    // Use `||` (not `??`) so a blank/whitespace-only reply also falls back instead of rendering nothing.
    const question = data?.response?.trim() || "No question returned";

    return NextResponse.json({ question });

  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.error("Ollama request timed out");
      return NextResponse.json({ question: "AI took too long to respond. Please try again." }, { status: 504 });
    }
    console.error("Error in API route:", error);
    return NextResponse.json({ question: "Failed to generate question" }, { status: 500 });
  }
}