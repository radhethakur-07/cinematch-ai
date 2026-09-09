import { CheckCircle2, Sparkles, BrainCircuit } from "lucide-react";

interface ExplainabilityBadgeProps {
  matchPercentage?: number;
  reasons?: string[];
  className?: string;
}

export function ExplainabilityBadge({ matchPercentage, reasons, className = "" }: ExplainabilityBadgeProps) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={`rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 backdrop-blur-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">Why You'll Like This</h4>
        </div>
        {matchPercentage && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-extrabold text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-3 w-3" />
            {matchPercentage}% Match
          </span>
        )}
      </div>

      <ul className="space-y-1.5">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
