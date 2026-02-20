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

export default function Home() {
  const controls = useAnimation();
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * SEGMENTS);
    const segmentAngle = 360 / SEGMENTS;
    const randomOffset = Math.random() * segmentAngle;

    const finalAngle =
      360 * 5 + (360 - randomIndex * segmentAngle) - randomOffset;

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 5,
        ease: "easeOut"
      }
    });

    setResult(CATEGORIES[randomIndex]);
    setSpinning(false);
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
    </main>
  );
}