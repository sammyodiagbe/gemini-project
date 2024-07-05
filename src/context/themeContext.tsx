"use client";
import { createContext, useContext, useEffect, useState } from "react";

type themeType = "light" | "dark";

type ContextType = {
  theme: themeType;
  switchTheme: Function;
};

const themeContext = createContext<ContextType>({
  theme: "light",
  switchTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<themeType>("dark");
  const switchTheme = async (theme: themeType) => {
    await localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    let theme = localStorage.getItem("theme") as themeType;
    if (theme) {
      setTheme(theme);
    }
  }, []);
  return (
    <themeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(themeContext);
};

export default ThemeProvider;
