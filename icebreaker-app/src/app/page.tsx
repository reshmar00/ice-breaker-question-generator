"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import styles from "./page.module.css";

const SEGMENTS = 6;

export default function Home() {
  const controls = useAnimation();
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const randomSegment = Math.floor(Math.random() * SEGMENTS);
    const segmentAngle = 360 / SEGMENTS;
    const randomOffset = Math.random() * segmentAngle;

    const finalAngle =
      360 * 5 + (360 - randomSegment * segmentAngle) - randomOffset;

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 5,
        ease: "easeOut"
      }
    });

    setResult(randomSegment + 1);
    setSpinning(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.wheelContainer}>
        <div className={styles.pointer} />
        <motion.div className={styles.wheel} animate={controls} />
      </div>

      <button className={styles.button} onClick={handleSpin}>
        Spin the wheel
      </button>

      {result && (
        <motion.h2
          className={styles.result}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Landed on segment {result}
        </motion.h2>
      )}
    </main>
  );
}