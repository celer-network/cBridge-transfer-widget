import { useState } from "react";
import { useLocalStorage } from "react-use";

type ThemeType = "dark" | "light";

function useThemeType(): [ThemeType, () => void] {
  // const mediaQueryListLight = window.matchMedia("(prefers-color-scheme: light)");
  // const initThemeType = mediaQueryListLight.matches ? "light" : "dark";
  const initThemeType = "dark";
  const [lastThemeType, setLastThemeType] = useLocalStorage<ThemeType>("lastTheme", initThemeType);
  const [themeType, setThemeType] = useState<ThemeType>(lastThemeType as ThemeType);
  const toggleTheme = () => {
    if (themeType === "dark") {
      setThemeType("light");
      setLastThemeType("light");
    } else {
      setThemeType("dark");
      setLastThemeType("dark");
    }
  };
  return [themeType, toggleTheme];
}

export default useThemeType;
