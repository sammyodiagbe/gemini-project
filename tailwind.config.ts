import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accentColor: "rgb(var(--color-accentColor) / <alpha-value>)",
        backgroundColor: "rgb(var(--color-backgroundColor) / <alpha-value>)",
        textColor: "rgb(var(--color-textColor) / <alpha-value>)",
        onBackground: "rgb(var(--color-onBackground) / <alpha-value)",
        inputBackground: "rgb(var(--color-inputBackground) / <alpha-value)",
      },
      backgroundColor: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accentColor: "rgb(var(--color-accentColor) / <alpha-value>)",
        backgroundColor: "rgb(var(--color-backgroundColor) / <alpha-value>)",
        textColor: "rgb(var(--color-textColor) / <alpha-value>)",
        onBackground: "rgb(var(--color-onBackground) / <alpha-value>)",
        inputBackground: "rgb(var(--color-inputBackground) / <alpha-value)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
