"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

const QUESTIONS: string[] = [
  "What’s a small thing that reliably improves your day?",
  "Are you more of a morning person or an afternoon person?",
  "What’s a simple pleasure you enjoy during the workweek?",
  "What’s something you look forward to each week?",
  "What’s a harmless habit that helps you reset during the day?",

  "What type of task do you enjoy working on the most?",
  "Do you prefer working independently or collaboratively?",
  "What’s one work routine that helps you stay focused?",
  "When tackling a new project, what helps you get started?",
  "What kind of environment helps you do your best work?",

  "What’s a skill you’ve improved over the past year?",
  "What’s something new you’ve learned recently?",
  "What’s a professional skill you’d like to develop further?",
  "What’s one thing you’re curious to learn more about?",
  "What’s a piece of advice that’s helped you grow professionally?",

  "What helps you feel most supported at work?",
  "What’s one thing that makes teamwork run smoothly for you?",
  "How do you like to receive feedback?",
  "What’s something colleagues do that you really appreciate?",
  "What’s one quality you value in a great teammate?",

  "If you could instantly master one professional skill, what would it be?",
  "If you had an extra hour in the workday, how would you use it?",
  "If you could shadow anyone for a day, who would it be?",
  "If you could automate one routine task, what would you choose?",
  "If you could try a different role for a week, what would it be?",

  "What’s something you’re proud of accomplishing recently?",
  "What’s a work moment that made you feel good?",
  "What motivates you during challenging days?",
  "What’s one thing that helps you stay optimistic at work?",
  "What’s a small win that often goes unnoticed but matters to you?"
];

export default function Home() {
  const [question, setQuestion] = useState<string>("");

  const getRandomQuestion = (): void => {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    setQuestion(QUESTIONS[randomIndex]);
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Ice-Breaker Generator</h1>

      <button onClick={getRandomQuestion} style={styles.button}>
        Get a Question
      </button>

      {question && <p style={styles.question}>{question}</p>}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    fontFamily: "sans-serif",
    padding: "20px"
  },
  title: {
    fontSize: "2rem"
  },
  button: {
    padding: "12px 20px",
    fontSize: "1rem",
    cursor: "pointer"
  },
  question: {
    marginTop: "20px",
    fontSize: "1.2rem",
    maxWidth: "600px",
    textAlign: "center"
  }
};