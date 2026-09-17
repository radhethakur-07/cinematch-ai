import * as React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card bg-cinema-surface border border-cinema-border p-5 sm:p-6 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-1.5 pb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-base sm:text-lg font-semibold text-cinema-text tracking-tight ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs sm:text-sm text-cinema-muted ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`} {...props}>{children}</div>;
}
