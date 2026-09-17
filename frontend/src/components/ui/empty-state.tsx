import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-16 sm:py-24 text-center space-y-4 max-w-md mx-auto px-4 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-cinema-elevated border border-cinema-border flex items-center justify-center mx-auto text-cinema-muted">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-cinema-text">{title}</h3>
        <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed">{description}</p>
      </div>
      {action ? (
        <div className="pt-2">{action}</div>
      ) : actionLabel && onAction ? (
        <div className="pt-2">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
