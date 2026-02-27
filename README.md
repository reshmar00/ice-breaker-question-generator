# Ice Breaker Question Generator 🎡

An interactive **Next.js** app that helps teams, classrooms, and groups kick off conversations with fun, category-based icebreaker questions.

Spin the wheel, land on a category, and generate a question — either from a curated question bank or dynamically using AI.

## Features ✨

- 🎡 Interactive spinning category wheel (Framer Motion animation)
- 🎉 Confetti celebration on category selection
- 📚 30 curated, ready-to-fire questions per category
- 🤖 Optional AI-powered question generation (LLM-based)
- 🎨 Custom UI styling with animated gradient AI button
- ⚡ Smooth transitions and polished interaction states
- 🔒 Safe-for-work question constraints

## Categories 🗂

- Deserted Island
- My Favorite Things
- Travel & Places
- Would You Rather
- Childhood & Nostalgia
- Productivity
- Creative Mode
- Superpowers
- Food & Drink
- Rapid Fire

## AI Question Generation 🧠

When a category is selected, users can:

- Generate a question from the local curated question bank
- Or use the AI button to dynamically generate a new question based on the selected category

AI generation is constrained to:
- No sexual content
- No politics
- No religion
- Conversational and whimsical tone

## Tech Stack 🛠

- **Next.js (App Router) in TypeScript**
- **Framer Motion** (wheel animation)
- **Ant Design** (UI components)
- **react-icons**
- Optional LLM backend via API route

## Running Locally 🚀

```
git clone https://github.com/reshmar00/ice-breaker-question-generator.git
cd ice-breaker-question-generator
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

## Environment Variables (for AI generation) 🔑

Create an `.env.local` file:

```
OLLAMA_API_KEY=your_api_key_here
```

Restart the dev server after adding environment variables.


## Version Highlights 📦


### Initial Release 🎉

- Interactive spinning wheel
- Animated category selection
- Dynamic question generation from local question banks
- Smooth motion transitions
- Custom typography and layout polish

### AI-Powered Question Upgrade ✨

- AI-generated question option
- Animated gradient AI button
- Expanded curated question bank
- Improved UX and loading states
- Production cleanup
