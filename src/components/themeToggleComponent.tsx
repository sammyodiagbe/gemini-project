"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { buttonIconSize } from "@/lib/utils";

const ThemeToggler = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  });

  if (!mounted) {
    return <button className="" disabled></button>;
  }

  const dark = theme === "dark";
  return (
    <button onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun size={buttonIconSize} /> : <Moon size={buttonIconSize} />}
    </button>
  );
};

export default ThemeToggler;
