import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48", // Saturated Ruby Red
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
          accent: "#06b6d4",
          violet: "#8b5cf6",
          gold: "#f59e0b",
        },
        cinema: {
          bg: "#07080d", // Deepest Cinematic Obsidian
          surface: "#0e1017", // Rich Surface
          card: "#131622", // Saturated Deep Card
          hover: "#1c2030",
          border: "#24293d", // High Contrast Border
          borderHover: "#3b4466",
          muted: "#94a3b8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cinema-gradient": "linear-gradient(180deg, rgba(7,8,13,0) 0%, rgba(7,8,13,0.85) 60%, rgba(7,8,13,1) 100%)",
        "rich-hero": "radial-gradient(ellipse at top, #be123c33 0%, #7c3aed22 35%, #07080d 70%)",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #e11d48 0deg, #8b5cf6 120deg, #06b6d4 240deg, #e11d48 360deg)",
      },
      boxShadow: {
        "rich-red": "0 10px 40px -10px rgba(225, 29, 72, 0.45)",
        "rich-purple": "0 10px 40px -10px rgba(139, 92, 246, 0.4)",
        "rich-card": "0 12px 36px -8px rgba(0, 0, 0, 0.75)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
