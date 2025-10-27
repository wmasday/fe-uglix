import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--border-color)",
        backdropFilter: "blur(10px)",
        color: "var(--text-primary)",
        boxShadow: "var(--glass-shadow)",
      }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      title="Toggle theme"
    >
      <FaSun
        className="absolute text-amber-400 transition-all duration-300"
        style={{
          opacity: theme === "light" ? 1 : 0,
          transform:
            theme === "light"
              ? "rotate(0deg) scale(1)"
              : "rotate(180deg) scale(0.8)",
        }}
        size={18}
      />
      <FaMoon
        className="absolute text-blue-400 transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform:
            theme === "dark"
              ? "rotate(0deg) scale(1)"
              : "rotate(-180deg) scale(0.8)",
        }}
        size={18}
      />
    </motion.button>
  );
}
