"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, ArrowRight, Film, Bot } from "lucide-react";
import { useAIMoodSearch } from "@/hooks/use-recommendations";
import { MovieCard } from "@/components/movies/movie-card";
import { AIMoodSearchResponse } from "@/types";

interface NaturalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_PROMPTS = [
  "I want a mind-bending sci-fi movie like Interstellar with deep space themes.",
  "Dark psychological thriller with an unexpected twist and high ratings.",
  "Something funny and lighthearted like Everything Everywhere All at Once.",
  "A fast-paced crime heist with iconic characters.",
  "Visually stunning anime or animated masterpiece under 2 hours."
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-brand-500/50 bg-cinema-card shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top saturated glowing strip */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-600 via-rose-500 to-cyan-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-cinema-border/90 bg-gradient-to-r from-brand-950/60 via-cinema-card to-cinema-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/30 border border-brand-500/50 text-brand-400 shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                AI Natural Discovery
                <span className="text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  Gemini + Hybrid ML
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-medium">
                Describe your exact vibe, reference movies, or themes in plain language.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 space-y-3.5 border-b border-cinema-border bg-cinema-bg/80">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Mind-bending sci-fi like Everything Everywhere All at Once..."
              className="w-full rounded-2xl bg-cinema-card border border-cinema-border px-4 py-3 sm:py-3.5 pl-11 pr-24 sm:pr-28 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
            />
            <Sparkles className="absolute left-4 h-4 w-4 text-cyan-400 animate-pulse" />
            <button
              onClick={() => handleSearch(prompt)}
              disabled={aiSearch.isPending || !prompt.trim()}
              className="absolute right-1.5 sm:right-2 rounded-xl bg-brand-600 px-3.5 sm:px-4 py-2 text-xs font-black text-white hover:bg-brand-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-brand-600/40 cursor-pointer active:scale-95"
            >
              {aiSearch.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <span>Run AI</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Try asking:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleSearch(p);
                  }}
                  className="rounded-full border border-cinema-border bg-cinema-card px-3 py-1 text-[11px] sm:text-xs text-zinc-300 hover:border-brand-500/60 hover:text-white hover:bg-brand-600/20 transition-all cursor-pointer"
                >
                  "{p.slice(0, 42)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {aiSearch.isPending && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
              <p className="text-sm text-zinc-200 font-bold">Neural Engine analyzing intent & ranking recommendations...</p>
              <span className="text-xs text-zinc-500 font-medium">Google Gemini Intent Extraction → Hybrid Vector Ranking</span>
            </div>
          )}

          {result && !aiSearch.isPending && (
            <div className="space-y-6">
              {/* Intent Analysis Card */}
              <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/30 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Structured Intent Analysis ({result.ai_provider})
                  </span>
                  {result.fallback_used && (
                    <span className="text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold text-[10px]">
                      Heuristic Fallback
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
                  <div className="rounded-xl bg-black/60 p-2.5 border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-0.5 font-bold uppercase">Detected Genres:</span>
                    <span className="text-zinc-200 font-bold text-xs">{result.structured_intent.genres?.join(", ") || "Any"}</span>
                  </div>
                  <div className="rounded-xl bg-black/60 p-2.5 border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-0.5 font-bold uppercase">Target Moods:</span>
                    <span className="text-zinc-200 font-bold text-xs">{result.structured_intent.moods?.join(", ") || "General"}</span>
                  </div>
                  <div className="rounded-xl bg-black/60 p-2.5 border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-0.5 font-bold uppercase">Reference Titles:</span>
                    <span className="text-zinc-200 font-bold text-xs">{result.structured_intent.similar_to?.join(", ") || "None"}</span>
                  </div>
                  <div className="rounded-xl bg-black/60 p-2.5 border border-white/5">
                    <span className="text-zinc-500 block text-[10px] mb-0.5 font-bold uppercase">Runtime Limit:</span>
                    <span className="text-zinc-200 font-bold text-xs">
                      {result.structured_intent.max_runtime ? `≤ ${result.structured_intent.max_runtime} min` : "No limit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations Grid - Mobile 2 Columns */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Top Ranked Recommendations
                  <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/30">
                    {result.recommendations.length} movies
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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
            <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 space-y-2">
              <Film className="h-10 w-10 text-zinc-600" />
              <p className="text-xs sm:text-sm font-medium">Type any vibe or query above to trigger AI movie matching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
