"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import styles from "./page.module.css";
import { Button } from "antd";
import { useWindowSize } from "react-use";

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

export default function Home() {
  const controls = useAnimation();
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleSpin = async () => {
    if (spinning) return;

    // console.log("\n\n******************\n");
    // console.log("Spinning the wheel...");
    // console.log("\n******************\n\n");
    setSpinning(true);
    setResult(null);
    setQuestion(null); // reset previous question
    setShowConfetti(false);

    const randomIndex = Math.floor(Math.random() * SEGMENTS);
    const segmentAngle = 360 / SEGMENTS;
    const randomOffset = Math.random() * segmentAngle;

    const finalAngle =
      360 * 5 + (360 - randomIndex * segmentAngle) - randomOffset;

    // console.log("\n\n******************\n");
    // console.log(`Final angle: ${finalAngle}, selected category index: ${randomIndex}`);
    // console.log("\n******************\n\n");

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 5,
        ease: "easeOut"
      }
    });

    const selectedCategory = CATEGORIES[randomIndex];
    // console.log("\n\n******************\n");
    // console.log(`Wheel landed on category: ${selectedCategory}`);
    // console.log("\n******************\n\n");

    setResult(selectedCategory);
    setSpinning(false);

    // trigger confetti for 6 seconds
    setShowConfetti(true);
  };

  useEffect(() => {
    if (!showConfetti) return;
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleQuestion = async () => {
    if (!result) return;

    // console.log("\n\n******************\n");
    // console.log(`Fetching question for category: ${result}`);
    // console.log("\n******************\n\n");
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
      // console.log("\n\n******************\n");
      // console.log("API response:", data);
      // console.log("\n******************\n\n");

      setQuestion(data.question);
    } catch (error) {
      // console.log("\n\n******************\n");
      // console.error("Error fetching question:", error);
      // console.log("\n******************\n\n");
      setQuestion("Something went wrong. Try again.");
    }
  };

  return (
    <main className={styles.page}>
      {/* Confetti overlay */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={150}
          recycle={false} // stop after finishing
        />
      )}

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

      <Button type="primary" onClick={handleSpin} style={{ fontFamily: "var(--font-montserrat), sans-serif" }} loading={spinning}>
        Spin the wheel
      </Button>

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
        <Button type="primary" style={{ fontFamily: "var(--font-montserrat), sans-serif" }} onClick={handleQuestion}>
          Get Question  
        </Button>        
      )}

      {/* 👇 Animated Question Reveal */}
      {question && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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