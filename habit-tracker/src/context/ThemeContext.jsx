import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("ht_theme") !== "light");

  useEffect(() => {
    localStorage.setItem("ht_theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  const t = dark
    ? {
        bg: "#0a0a0f",
        bg2: "#111118",
        surface: "rgba(255,255,255,0.04)",
        surface2: "rgba(255,255,255,0.07)",
        border: "rgba(255,255,255,0.07)",
        border2: "rgba(255,255,255,0.12)",
        text: "#ffffff",
        text2: "rgba(255,255,255,0.6)",
        text3: "rgba(255,255,255,0.3)",
        text4: "rgba(255,255,255,0.15)",
        sidebar: "rgba(255,255,255,0.02)",
        sidebarBorder: "rgba(255,255,255,0.06)",
        inputBg: "rgba(255,255,255,0.06)",
        navBg: "rgba(10,10,15,0.95)",
        modalBg: "#18181b",
        shadow: "rgba(0,0,0,0.5)",
        dark,
      }
    : {
        bg: "#f4f5f7",
        bg2: "#eaebee",
        surface: "rgba(0,0,0,0.04)",
        surface2: "rgba(0,0,0,0.07)",
        border: "rgba(0,0,0,0.08)",
        border2: "rgba(0,0,0,0.14)",
        text: "#111118",
        text2: "rgba(0,0,0,0.65)",
        text3: "rgba(0,0,0,0.38)",
        text4: "rgba(0,0,0,0.18)",
        sidebar: "rgba(255,255,255,0.7)",
        sidebarBorder: "rgba(0,0,0,0.08)",
        inputBg: "rgba(0,0,0,0.05)",
        navBg: "rgba(244,245,247,0.95)",
        modalBg: "#ffffff",
        shadow: "rgba(0,0,0,0.15)",
        dark,
      };

  return (
    <ThemeContext.Provider value={{ t, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
