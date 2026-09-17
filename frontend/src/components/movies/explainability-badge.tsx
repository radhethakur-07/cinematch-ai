import { CheckCircle2, Sparkles } from "lucide-react";

interface ExplainabilityBadgeProps {
  matchPercentage?: number;
  reasons?: string[];
  className?: string;
}

export function ExplainabilityBadge({ matchPercentage, reasons, className = "" }: ExplainabilityBadgeProps) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={`rounded-card border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-cinema-secondary">Why CineMatch recommends this</h4>
        {matchPercentage && (
          <span className="inline-flex items-center gap-1 rounded-full bg-crimson-soft border border-crimson/25 px-2.5 py-0.5 text-xs font-medium text-crimson">
            <Sparkles className="h-3 w-3" />
            {matchPercentage}% Match
          </span>
        )}
      </div>

      <ul className="space-y-2">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-cinema-secondary leading-relaxed">
            <CheckCircle2 className="h-3.5 w-3.5 text-semantic-success mt-0.5 flex-shrink-0" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
