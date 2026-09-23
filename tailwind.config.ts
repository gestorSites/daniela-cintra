import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-raised": "rgb(var(--paper-raised) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
        },
        line: "rgb(var(--line) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          soft: "color-mix(in srgb, rgb(var(--primary)) 8%, rgb(var(--paper)))",
          tint: "color-mix(in srgb, rgb(var(--primary)) 14%, rgb(var(--paper)))",
          strong: "color-mix(in srgb, rgb(var(--primary)) 86%, #000)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          soft: "color-mix(in srgb, rgb(var(--secondary)) 8%, rgb(var(--paper)))",
          tint: "color-mix(in srgb, rgb(var(--secondary)) 16%, rgb(var(--paper)))",
          strong: "color-mix(in srgb, rgb(var(--secondary)) 86%, #000)",
        },
      },
      borderColor: {
        DEFAULT: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "90rem",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(38, 34, 30, 0.04), 0 12px 32px -12px rgba(38, 34, 30, 0.12)",
        lift: "0 2px 4px rgba(38, 34, 30, 0.05), 0 24px 48px -16px rgba(38, 34, 30, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
