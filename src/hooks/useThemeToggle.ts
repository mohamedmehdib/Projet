"use client";

import { useState, useEffect, useRef } from "react";

export function useThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isSwitchingRef = useRef(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark";
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isSwitchingRef.current) return;
    isSwitchingRef.current = true;

    document.documentElement.classList.add("theme-transitioning");

    const nextTheme = isDarkMode ? "light" : "dark";
    if (nextTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      isSwitchingRef.current = false;
    }, 250);
  };

  return { isDarkMode, toggleTheme };
}

