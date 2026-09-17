"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight, Film } from "lucide-react";
import { useAIMoodSearch } from "@/hooks/use-recommendations";
import { MovieCard } from "@/components/movies/movie-card";
import { AIMoodSearchResponse } from "@/types";

interface NaturalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_PROMPTS = [
  "Mind-bending sci-fi like Interstellar with deep space themes",
  "Dark psychological thriller with an unexpected twist",
  "Something funny and lighthearted like Everything Everywhere All at Once",
  "A fast-paced crime heist with iconic characters",
  "Visually stunning animated masterpiece under 2 hours"
];

export function NaturalSearchDialog({ open, onOpenChange }: NaturalSearchDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AIMoodSearchResponse | null>(null);
  const aiSearch = useAIMoodSearch();

  if (!open) return null;

  const handleSearch = (queryText: string) => {
    if (!queryText.trim()) return;
    aiSearch.mutate(queryText, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-void/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-panel border border-cinema-border bg-cinema-surface shadow-modal overflow-hidden my-auto max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-cinema-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-control bg-crimson-soft text-crimson border border-crimson/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-cinema-text">
                Natural AI Discovery
              </h2>
              <p className="text-xs text-cinema-muted">
                Describe your mood, themes, or favorite films in plain language.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-control text-cinema-muted hover:text-cinema-text hover:bg-cinema-hover transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 space-y-3 border-b border-cinema-border bg-cinema-void">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. A slow-burn psychological thriller with deep atmosphere..."
              className="w-full rounded-btn bg-cinema-surface border border-cinema-border px-3.5 py-2.5 pl-9 pr-24 text-xs sm:text-sm text-cinema-text placeholder-cinema-muted focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
            />
            <Sparkles className="absolute left-3 h-3.5 w-3.5 text-crimson" />
            <button
              onClick={() => handleSearch(prompt)}
              disabled={aiSearch.isPending || !prompt.trim()}
              className="absolute right-1.5 rounded-control bg-crimson hover:bg-crimson-hover px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {aiSearch.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <span>Find</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-cinema-muted font-medium mr-1">Suggestions:</span>
            {SAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleSearch(p);
                }}
                className="rounded-control border border-cinema-border bg-cinema-surface hover:bg-cinema-hover px-2.5 py-1 text-[11px] text-cinema-secondary hover:text-cinema-text transition-colors cursor-pointer"
              >
                &ldquo;{p.slice(0, 36)}...&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {aiSearch.isPending && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2.5">
              <Loader2 className="h-6 w-6 text-crimson animate-spin" />
              <p className="text-xs sm:text-sm text-cinema-secondary font-medium">Analyzing taste intent & calculating vector matches...</p>
            </div>
          )}

          {result && !aiSearch.isPending && (
            <div className="space-y-5">
              {/* Intent Breakdown */}
              <div className="rounded-card border border-cinema-border bg-cinema-elevated p-3.5 space-y-2.5">
                <span className="text-xs font-semibold text-cinema-text block">
                  CineMatch Understood:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-cinema-surface border border-cinema-border-subtle">
                    <span className="text-cinema-muted block text-[10px] uppercase font-medium">Genre</span>
                    <span className="text-cinema-text font-medium">{result.structured_intent.genres?.join(", ") || "Any"}</span>
                  </div>
                  <div className="p-2 rounded bg-cinema-surface border border-cinema-border-subtle">
                    <span className="text-cinema-muted block text-[10px] uppercase font-medium">Mood</span>
                    <span className="text-cinema-text font-medium">{result.structured_intent.moods?.join(", ") || "General"}</span>
                  </div>
                  <div className="p-2 rounded bg-cinema-surface border border-cinema-border-subtle">
                    <span className="text-cinema-muted block text-[10px] uppercase font-medium">Similar To</span>
                    <span className="text-cinema-text font-medium">{result.structured_intent.similar_to?.join(", ") || "None"}</span>
                  </div>
                  <div className="p-2 rounded bg-cinema-surface border border-cinema-border-subtle">
                    <span className="text-cinema-muted block text-[10px] uppercase font-medium">Runtime</span>
                    <span className="text-cinema-text font-medium">
                      {result.structured_intent.max_runtime ? `≤ ${result.structured_intent.max_runtime} min` : "No limit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Matched Movies Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-cinema-secondary">
                    Matched Movies
                  </h3>
                  <span className="text-xs text-cinema-muted">
                    {result.recommendations.length} results
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {result.recommendations.map((movie) => (
                    <div key={movie.id} onClick={() => onOpenChange(false)}>
                      <MovieCard movie={movie} showMatchPercentage={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !aiSearch.isPending && (
            <div className="flex flex-col items-center justify-center py-10 text-center text-cinema-muted space-y-2">
              <Film className="h-8 w-8 text-cinema-border" />
              <p className="text-xs">Type a prompt above to discover films matching your exact mood.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
