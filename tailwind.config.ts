import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f8f7f4",
        ink: "#24211d",
        muted: "#6d6860",
        line: "#e5e0d8",
        brand: "#245c4f",
        "brand-soft": "#e5f0ec"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(36, 33, 29, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
