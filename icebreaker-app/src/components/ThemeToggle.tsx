"use client";
import { useState } from "react";
import { Button, ConfigProvider, theme } from "antd";

export default function ThemeToggle({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: darkMode ? "#fff" : "#000" },
      }}
    >
      {/* Apply dark/light mode class for CSS variables */}
      <div className={darkMode ? "dark-mode" : "light-mode"} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
        {/*<Button*/}
        {/*  onClick={() => setDarkMode(!darkMode)}*/}
        {/*  style={{*/}
        {/*    fontFamily: "var(--font-montserrat), sans-serif",*/}
        {/*    backgroundColor: "var(--text-color)",*/}
        {/*    color: "var(--background)",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Toggle Theme*/}
        {/*</Button>*/}
        {children}
      </div>
    </ConfigProvider>
  );
}