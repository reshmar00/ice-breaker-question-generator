"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import styles from "./page.module.css";

const CATEGORIES = [
  "Deserted Island",
  "My Favorite Things",
  "Travel & Places",
  "Would You Rather",
  "Childhood & Nostalgia",
  "Productivity",
  "Creative Mode",
  "Superpowers",
  "Food & Drink",
  "Rapid Fire"
];

const SEGMENTS = CATEGORIES.length;

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

export default function Home() {
  const controls = useAnimation();
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);

  const handleSpin = async () => {
    if (spinning) return;

    console.log("\n\n******************\n");
    console.log("Spinning the wheel...");
    console.log("\n******************\n\n");
    setSpinning(true);
    setResult(null);
    setQuestion(null); // reset previous question

    const randomIndex = Math.floor(Math.random() * SEGMENTS);
    const segmentAngle = 360 / SEGMENTS;
    const randomOffset = Math.random() * segmentAngle;

    const finalAngle =
      360 * 5 + (360 - randomIndex * segmentAngle) - randomOffset;

    console.log("\n\n******************\n");
    console.log(`Final angle: ${finalAngle}, selected category index: ${randomIndex}`);
    console.log("\n******************\n\n");

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 5,
        ease: "easeOut"
      }
    });

    const selectedCategory = CATEGORIES[randomIndex];
    console.log("\n\n******************\n");
    console.log(`Wheel landed on category: ${selectedCategory}`);
    console.log("\n******************\n\n");

    setResult(CATEGORIES[randomIndex]);
    setSpinning(false);
  };

  const handleQuestion = async () => {
    if (!result) return;

    console.log("\n\n******************\n");
    console.log(`Fetching question for category: ${result}`);
    console.log("\n******************\n\n");
    setQuestion(null);

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: result }),
      });

      const data = await response.json();
      console.log("\n\n******************\n");
      console.log("API response:", data);
      console.log("\n******************\n\n");

      setQuestion(data.question);
    } catch (error) {
      console.log("\n\n******************\n");
      console.error("Error fetching question:", error);
      console.log("\n******************\n\n");
      setQuestion("Something went wrong. Try again.");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wheelContainer}>
        <div className={styles.pointer} />

        <motion.div className={styles.wheel} animate={controls}>
          {CATEGORIES.map((label, index) => {
            const segmentAngle = 360 / SEGMENTS;
            const baseAngle = segmentAngle * index;
            const centerAngle = baseAngle + segmentAngle / 2;

            return (
              <div
                key={label}
                className={styles.label}
                style={{
                  transform: `
                    rotate(${centerAngle}deg)
                    translateY(-85px)
                    rotate(90deg)
                  `
                }}
              >
                {label}
              </div>
            );
          })}
        </motion.div>
      </div>

      <button className={styles.button} onClick={handleSpin}>
        Spin the wheel
      </button>

      {result && (
        <motion.h2
          className={styles.result}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Landed on: {result}
        </motion.h2>
      )}

      {/* 👇 Question Button Appears After Category */}
      {result && !question && (
        <button className={styles.button} onClick={handleQuestion}>
          Get Question
        </button>
      )}

      {/* 👇 Animated Question Reveal */}
      {question && (
        <motion.div
          initial={{ y: 60, opacity: 0, color: "#ffffff" }}
          animate={{ y: 0, opacity: 1, color: "#000000" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            textAlign: "center",
            maxWidth: "400px"
          }}
        >
          {question}
        </motion.div>
      )}
    </main>
  );
}