import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { category } = await req.json();

<<<<<<< HEAD
    if (!category || !QUESTIONS[category]) {
      // console.log("\n******************\n\n");
      // console.log("No category, so no question");
      // console.log("\n\n******************\n");
      return NextResponse.json({ question: "Unknown category" });
    }
    else{
      // console.log("\n******************\n\n");
      // console.log("Received category in API route:", category);
      // console.log("\n\n******************\n");
    }
    
    // Return a cached question immediately
    const cachedQuestion = randomFromArray(QUESTIONS[category]);
    // console.log("\n******************\n\n");
    // console.log("Cached question:", cachedQuestion);
    // console.log("\n\n******************\n");
=======
    if (!category) {
      console.log("No category provided");
      return NextResponse.json({ question: "Unknown category" });
    }

    console.log("Received category in API route:", category);

    const prompt = `Generate one safe-for-work icebreaker question for the category "${category}". 
    Rules: Make it fun, conversational, and whimsical. Avoid sexual content, politics, or religion. 
    Be creative and unexpected — we've cleared out all the basic questions, so try something fresh and unique. 
    Return ONLY the question text.`;

    const apiKey = process.env.OLLAMA_API_KEY;

    if (!apiKey) {
      console.error("OLLAMA_API_KEY not set");
      return NextResponse.json({ question: "API key not configured" }, { status: 500 });
    }
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)

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
    });

<<<<<<< HEAD
        const data = await ollamaResponse.json();
        // console.log("\n******************\n\n");
        // console.log("Ollama response:", data);
        // console.log("\n\n******************\n");
=======
    if (!response.ok) {
      console.error("Ollama API error:", response.statusText);
      return NextResponse.json({ question: "Failed to generate question" }, { status: 500 });
    }
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)

    const data = await response.json();
    const question = data?.response?.trim() ?? "No question returned";

<<<<<<< HEAD
        if (newQuestion) {
            //Push to cache, implement rolling queue
          if (QUESTIONS[category].length < MAX_CACHE_SIZE) {
            QUESTIONS[category].push(newQuestion);
          } else {
            // Remove first (oldest) and push new
            QUESTIONS[category].shift();
            QUESTIONS[category].push(newQuestion);
          }
          // console.log(`Updated cache for "${category}". Total questions: ${QUESTIONS[category].length}`);
        }
        } catch (err) {
          console.error("Error refreshing GPT question:", err);
        }
      })();
      // Return cached question immediately
      return NextResponse.json({ question: cachedQuestion });

      } catch (error) {
        // console.log("\n******************\n\n");
        // console.error("Error in API route:", error);
        // console.log("\n\n******************\n");
        return NextResponse.json({ error: "Failed to generate question" },{ status: 500 });
=======
    console.log("Generated question:", question);

    return NextResponse.json({ question });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ question: "Failed to generate question" }, { status: 500 });
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)
  }
}