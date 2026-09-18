import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "crimson" | "gold" | "neutral" | "surface" | "series";
  size?: "sm" | "md";
}

export function Badge({ className = "", variant = "neutral", size = "sm", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium tracking-wide rounded-full select-none";
  
  const variants = {
    crimson: "bg-crimson-soft text-crimson border border-crimson/30",
    gold: "bg-gold-soft text-gold border border-gold/30",
    neutral: "bg-cinema-elevated text-cinema-secondary border border-cinema-border",
    surface: "bg-cinema-surface text-cinema-muted border border-cinema-border-subtle",
    series: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 dark:border-purple-800/40",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
