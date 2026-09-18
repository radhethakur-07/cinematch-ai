"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  // Until mounted, show a neutral placeholder to avoid hydration layout mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center p-2 rounded-control text-cinema-secondary bg-cinema-surface border border-cinema-border opacity-70 cursor-default ${className}`}
        aria-label="Theme toggle loading"
      >
        <div className="h-4 w-4" />
        {showLabel && <span className="ml-2 text-xs">Theme</span>}
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-control text-cinema-secondary hover:text-cinema-text bg-cinema-surface hover:bg-cinema-hover border border-cinema-border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-crimson ${className}`}
      title={label}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: isDark ? -45 : 45, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: isDark ? 45 : -45, scale: 0.8 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-gold hover:text-gold transition-colors" />
          ) : (
            <Moon className="h-4 w-4 text-crimson hover:text-crimson transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>

      {showLabel && (
        <span className="ml-2 text-xs font-medium text-cinema-text">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
