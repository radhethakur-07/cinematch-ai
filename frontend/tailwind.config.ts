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
      padding: "2rem",
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
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          accent: "#06b6d4",
          gold: "#f59e0b"
        },
        cinema: {
          bg: "#090a0f",
          card: "#12141d",
          hover: "#1a1d29",
          border: "#232738",
          muted: "#8b949e"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cinema-gradient": "linear-gradient(180deg, rgba(9,10,15,0) 0%, rgba(9,10,15,0.85) 60%, rgba(9,10,15,1) 100%)",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #06b6d4 180deg, #f43f5e 360deg)"
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
