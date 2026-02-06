"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [done, setDone] = useState(false);

  return (
    <main style={styles.main}>
      {!done && (
        <motion.div
          style={styles.wheel}
          animate={{ rotate: 360 * 5 }}
          transition={{
            duration: 5,
            ease: "easeInOut"
          }}
          onAnimationComplete={() => setDone(true)}
        />
      )}

      {done && (
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          You have arrived!
        </motion.h1>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "24px"
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: "50%",
    border: "12px solid #3182ce",
    borderTopColor: "#e2e8f0"
  }
};