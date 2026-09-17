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
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Core Design Tokens
        cinema: {
          void: "#090A0D",
          bg: "#090A0D",
          surface: "#101216",
          card: "#101216",
          elevated: "#16181D",
          hover: "#1C1F25",
          border: "#292C33",
          "border-subtle": "#202329",
          text: "#F4F2ED",
          secondary: "#C1C0BC",
          muted: "#94959A",
          disabled: "#66686D",
        },
        crimson: {
          DEFAULT: "#D94B56",
          hover: "#E65B66",
          dark: "#B83B46",
          soft: "rgba(217, 75, 86, 0.12)",
        },
        gold: {
          DEFAULT: "#D6B56D",
          soft: "rgba(214, 181, 109, 0.12)",
        },
        brand: {
          500: "#D94B56",
          600: "#D94B56",
          700: "#B83B46",
          gold: "#D6B56D",
          violet: "#8b5cf6",
        },
        semantic: {
          success: "#6FA884",
          warning: "#D2A45A",
          danger: "#C96B73",
          info: "#7E9BB7",
        },
      },
      borderRadius: {
        control: "8px",
        btn: "10px",
        card: "12px",
        panel: "16px",
        hero: "20px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.45)",
        elevated: "0 8px 30px -4px rgba(0, 0, 0, 0.6)",
        modal: "0 20px 40px -8px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

