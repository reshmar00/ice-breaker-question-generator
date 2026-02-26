import { NextResponse } from "next/server";

const MAX_CACHE_SIZE = 30;

const QUESTIONS: Record<string, string[]> = {
  "Deserted Island": [
    "What 3 items would you bring?",
    "Would you try to escape or settle in?",
    "What skill would matter most?"
  ],
  "My Favorite Things": [
    "What’s your comfort movie?",
    "What song never gets old for you?",
    "Favorite snack of all time?"
  ],
  "Travel & Places": [
    "Dream country to visit?",
    "City or nature?",
    "Best trip you've taken?"
  ],
  "Would You Rather": [
    "Live without music or TV?",
    "Teleport or fly?",
    "Always be 10 minutes late or 20 minutes early?"
  ],
  "Childhood & Nostalgia": [
    "Favorite childhood toy?",
    "First best friend?",
    "Cartoon you loved?"
  ],
  "Productivity": [
    "Morning or night worker?",
    "Biggest distraction?",
    "Favorite productivity hack?"
  ],
  "Creative Mode": [
    "If you wrote a book, what genre?",
    "Invent a holiday.",
    "Design your dream home."
  ],
  "Superpowers": [
    "Invisible or mind reader?",
    "One power with limits?",
    "Hero or villain?"
  ],
  "Food & Drink": [
    "Sweet or savory?",
    "One cuisine forever?",
    "Coffee order?"
  ],
  "Rapid Fire": [
    "Cats or dogs?",
    "Beach or mountains?",
    "Early bird or night owl?"
  ]
};

// Helper to pick random item from array
const randomFromArray = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export async function POST(req: Request) {
  try {
    const { category } = await req.json();

    if (!category || !QUESTIONS[category]) {
       console.log("\n******************\n\n");
      console.log("No category, so no question");
      console.log("\n\n******************\n");
      return NextResponse.json({ question: "Unknown category" });
    }
    else{
      console.log("\n******************\n\n");
      console.log("Received category in API route:", category);
      console.log("\n\n******************\n");
    }
    
    // Return a cached question immediately
    const cachedQuestion = randomFromArray(QUESTIONS[category]);
    console.log("\n******************\n\n");
    console.log("Cached question:", cachedQuestion);
    console.log("\n\n******************\n");

    //Fire off async GPT cloud update
    (async () => {
      try {
        const prompt = `Generate one safe-for-work icebreaker question for the category: "${category}". Rules: Keep it short. No sexual content. No politics. No religion. Make it fun and conversational. Return ONLY the question text.`;
        
        const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-oss:20b-cloud",
            prompt,
            stream: false,
          }),
        });

        const data = await ollamaResponse.json();
        console.log("\n******************\n\n");
        console.log("Ollama response:", data);
        console.log("\n\n******************\n");

        const newQuestion = data?.response?.trim();

        if (newQuestion) {
            //Push to cache, implement rolling queue
          if (QUESTIONS[category].length < MAX_CACHE_SIZE) {
            QUESTIONS[category].push(newQuestion);
          } else {
            // Remove first (oldest) and push new
            QUESTIONS[category].shift();
            QUESTIONS[category].push(newQuestion);
          }
          console.log(`Updated cache for "${category}". Total questions: ${QUESTIONS[category].length}`);
        }
        } catch (err) {
          console.error("Error refreshing GPT question:", err);
        }
      })();
      // Return cached question immediately
      return NextResponse.json({ question: cachedQuestion });

      } catch (error) {
        console.log("\n******************\n\n");
        console.error("Error in API route:", error);
        console.log("\n\n******************\n");
        return NextResponse.json({ error: "Failed to generate question" },{ status: 500 });
  }
}