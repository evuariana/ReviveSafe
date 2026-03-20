import { useEffect, useState } from "react";

const STORAGE_KEY = "revivesafe.theme";

function resolveInitialTheme() {
  if (typeof window === "undefined") {
    return true;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") {
    return true;
  }

  if (stored === "light") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const [isDark, setIsDark] = useState(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return {
    isDark,
    toggleTheme: () => setIsDark((current) => !current),
    setIsDark,
  };
}
