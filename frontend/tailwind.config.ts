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
        border: "var(--cinema-border)",
        input: "var(--cinema-border)",
        ring: "var(--crimson)",
        background: "var(--cinema-bg)",
        foreground: "var(--cinema-text)",
        // Core Design Tokens
        cinema: {
          void: "var(--cinema-void)",
          bg: "var(--cinema-bg)",
          surface: "var(--cinema-surface)",
          card: "var(--cinema-card)",
          elevated: "var(--cinema-elevated)",
          hover: "var(--cinema-hover)",
          border: "var(--cinema-border)",
          "border-subtle": "var(--cinema-border-subtle)",
          "border-strong": "var(--cinema-border-strong)",
          text: "var(--cinema-text)",
          secondary: "var(--cinema-secondary)",
          muted: "var(--cinema-muted)",
          disabled: "var(--cinema-disabled)",
        },
        crimson: {
          DEFAULT: "var(--crimson)",
          hover: "var(--crimson-hover)",
          dark: "var(--crimson-dark)",
          soft: "var(--crimson-soft)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-soft)",
        },
        brand: {
          500: "var(--crimson)",
          600: "var(--crimson)",
          700: "var(--crimson-dark)",
          gold: "var(--gold)",
          violet: "#8b5cf6",
        },
        semantic: {
          success: "var(--semantic-success)",
          warning: "var(--semantic-warning)",
          danger: "var(--semantic-danger)",
          info: "var(--semantic-info)",
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
        subtle: "var(--shadow-subtle)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        modal: "var(--shadow-modal)",
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
