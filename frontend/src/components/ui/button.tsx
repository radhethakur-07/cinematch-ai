import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon" | "default";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none cursor-pointer select-none";
    
    const variants = {
      primary: "bg-crimson text-white hover:bg-crimson-hover shadow-subtle",
      secondary: "bg-cinema-elevated text-cinema-text hover:bg-cinema-hover border border-cinema-border",
      ghost: "text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover/60",
      outline: "bg-transparent text-cinema-text border border-cinema-border hover:bg-cinema-hover hover:border-cinema-secondary/30",
      destructive: "bg-semantic-danger/15 text-semantic-danger border border-semantic-danger/30 hover:bg-semantic-danger/25",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      default: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
      icon: "p-2 rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
