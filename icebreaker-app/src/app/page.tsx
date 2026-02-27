"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import styles from "./page.module.css";
import { Button } from "antd";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useWindowSize } from "react-use";
import { QUESTIONS } from "../app/api/question/questions";

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
  const [spinDisabled, setSpinDisabled] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const { width, height } = useWindowSize();

  const handleSpin = async () => {
    if (spinning || spinDisabled) return;

    // console.log("\n\n******************\n");
    // console.log("Spinning the wheel...");
    // console.log("\n******************\n\n");
    setSpinning(true);

    setResult(null);
    setQuestion(null);
    setShowConfetti(false);

    const randomIndex = Math.floor(Math.random() * SEGMENTS);
    const segmentAngle = 360 / SEGMENTS;
    const randomOffset = Math.random() * segmentAngle;
<<<<<<< HEAD

    const finalAngle =
      360 * 5 + (360 - randomIndex * segmentAngle) - randomOffset;

    // console.log("\n\n******************\n");
    // console.log(`Final angle: ${finalAngle}, selected category index: ${randomIndex}`);
    // console.log("\n******************\n\n");
=======
    const finalAngle = 360 * 5 + (360 - randomIndex * segmentAngle) - randomOffset;
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)

    await controls.start({
      rotate: finalAngle,
      transition: { duration: 5, ease: "easeOut" }
    });

    const selectedCategory = CATEGORIES[randomIndex];
    // console.log("\n\n******************\n");
    // console.log(`Wheel landed on category: ${selectedCategory}`);
    // console.log("\n******************\n\n");

    setResult(selectedCategory);

<<<<<<< HEAD
    // trigger confetti for 6 seconds
=======
    // Stop spinning immediately
    setSpinning(false);
    setSpinDisabled(true); // disable permanently

>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)
    setShowConfetti(true);
  };

<<<<<<< HEAD
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
=======
  const handleQuestion = () => {
    if (!result){
      console.log("\n\n******************\n");
      console.log(`No result in handleQuestion`);
      console.log("\n******************\n\n");
      return;
    } 

    console.log("\n\n******************\n");
    console.log(`Fetching question for category: ${result}`);
    console.log("\n******************\n\n");

    const categoryQuestions = QUESTIONS[result];
    console.log("\n\n******************\n");
    console.log(`Get questions from: ${categoryQuestions}`);
    console.log("\n******************\n\n");

    if (!categoryQuestions || categoryQuestions.length === 0) {
      console.log("\n\n******************\n");
      console.log(`categoryQuestions unavailable or categoryQuestions.length === 0`);
      console.log("\n******************\n\n");
      setQuestion("No questions available for this category.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    console.log("\n\n******************\n");
    console.log(`Picking random index: ${randomIndex}`);
    console.log("\n******************\n\n");

    const questionSet = categoryQuestions[randomIndex];
    setQuestion(questionSet);
    console.log("\n\n******************\n");
    console.log(`Question set: ${questionSet}`);
     console.log("\n******************\n\n");
  };

  const handleAIQuestion = async () => {
    if (!result){
      console.log("\n\n******************\n");
      console.log(`No result in handleAIQuestion`);
      console.log("\n******************\n\n");
      return;
    } 
    setLoadingAI(true);
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)
    setQuestion(null);

    try {
      const response = await fetch("/api/question/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: result })
      });

      if (!response.ok){
        console.log("\n\n******************\n");
        console.log(`Response not okay from API`);
        console.log("\n******************\n\n");
      } 

      const data = await response.json();
<<<<<<< HEAD
      // console.log("\n\n******************\n");
      // console.log("API response:", data);
      // console.log("\n******************\n\n");

      setQuestion(data.question);
    } catch (error) {
      // console.log("\n\n******************\n");
      // console.error("Error fetching question:", error);
      // console.log("\n******************\n\n");
      setQuestion("Something went wrong. Try again.");
=======
      console.log("\n\n******************\n");
      console.log(`Data response in JOSN: ${data}`);
      console.log("\n******************\n\n");

      setQuestion(data.question ?? "AI failed to generate a question.");
    } catch (err) {
      console.log("\n\n******************\n");
      console.error("Error fetching AI question:", err);
      console.log("\n******************\n\n");
      setQuestion("Something went wrong with AI question generation.");
    } finally {
      console.log("\n\n******************\n");
      console.log(`Reached 'finally' block`);
      console.log("\n******************\n\n");
      setLoadingAI(false);
>>>>>>> 042b3f9 (Added alternate AI option for generating questions; confirmed works locally)
    }
  };

  return (
    <main className={styles.page}>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={150} recycle={false} />}

      <div className={styles.wheelContainer}>
        <div className={styles.pointer} />
        <motion.div className={styles.wheel} animate={controls}>
          {CATEGORIES.map((label, index) => {
            const segmentAngle = 360 / SEGMENTS;
            const centerAngle = segmentAngle * index + segmentAngle / 2;
            return (
              <div
                key={label}
                className={styles.label}
                style={{ transform: `rotate(${centerAngle}deg) translateY(-85px) rotate(90deg)` }}
              >
                {label}
              </div>
            );
          })}
        </motion.div>
      </div>

      <Button
        type="primary"
        onClick={handleSpin}
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        loading={spinning}
        disabled={spinDisabled}
      >
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

      {result && !question && (
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            type="primary"
            onClick={handleQuestion}
            disabled={loadingAI}
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Get Question
          </Button>

          <Button
            className={styles.AIButton}
            icon={<HiOutlineSparkles />}
            onClick={handleAIQuestion}
            loading={loadingAI}
            style={{
              fontFamily: "var(--font-montserrat), sans-serif"
            }}
          >
            AI Generate Question
          </Button>
        </div>
      )}

      {question && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ fontSize: "1.25rem", fontWeight: 600, textAlign: "center", maxWidth: "400px" }}
        >
          {question}
        </motion.div>
      )}
    </main>
  );
}