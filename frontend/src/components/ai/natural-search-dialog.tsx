"use client";

import { useState } from "react";
import { Sparkles, Search, X, Loader2, ArrowRight, Film, Clock, Star, Bot } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-brand-500/30 bg-cinema-card shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-cinema-border/80 bg-gradient-to-r from-brand-600/10 via-cyan-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Natural Language Discovery
                <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Gemini + Hybrid ML
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Describe your exact vibe, reference movies, runtime limits, or themes in plain language.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-6 space-y-4 border-b border-cinema-border/50 bg-cinema-bg/40">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. I want something like Interstellar but more emotional and not too long..."
              className="w-full rounded-xl bg-cinema-card border border-cinema-border px-4 py-3.5 pl-11 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors shadow-inner"
            />
            <Sparkles className="absolute left-4 h-4 w-4 text-brand-400" />
            <button
              onClick={() => handleSearch(prompt)}
              disabled={aiSearch.isPending || !prompt.trim()}
              className="absolute right-2 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-brand-600/30"
            >
              {aiSearch.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <span>Find Matches</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Try asking:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleSearch(p);
                  }}
                  className="rounded-full border border-cinema-border/80 bg-cinema-card/80 px-3 py-1 text-xs text-zinc-300 hover:border-brand-500/50 hover:text-white transition-colors"
                >
                  "{p.slice(0, 48)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {aiSearch.isPending && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
              <p className="text-sm text-zinc-300 font-medium">Analyzing prompt & ranking cinematic recommendations...</p>
              <span className="text-xs text-zinc-500">Parsing structured intent → Executing hybrid vector ranking</span>
            </div>
          )}

          {result && !aiSearch.isPending && (
            <div className="space-y-6">
              {/* Intent Analysis Card */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Structured Intent Analysis ({result.ai_provider})
                  </span>
                  {result.fallback_used && (
                    <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      Heuristic Fallback Mode
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded bg-black/40 p-2 border border-white/5">
                    <span className="text-zinc-500 block mb-0.5">Detected Genres:</span>
                    <span className="text-zinc-200 font-medium">{result.structured_intent.genres?.join(", ") || "Any"}</span>
                  </div>
                  <div className="rounded bg-black/40 p-2 border border-white/5">
                    <span className="text-zinc-500 block mb-0.5">Target Moods:</span>
                    <span className="text-zinc-200 font-medium">{result.structured_intent.moods?.join(", ") || "General"}</span>
                  </div>
                  <div className="rounded bg-black/40 p-2 border border-white/5">
                    <span className="text-zinc-500 block mb-0.5">Reference Titles:</span>
                    <span className="text-zinc-200 font-medium">{result.structured_intent.similar_to?.join(", ") || "None"}</span>
                  </div>
                  <div className="rounded bg-black/40 p-2 border border-white/5">
                    <span className="text-zinc-500 block mb-0.5">Runtime Constraint:</span>
                    <span className="text-zinc-200 font-medium">
                      {result.structured_intent.max_runtime ? `≤ ${result.structured_intent.max_runtime} min` : "No limit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Ranked Recommendations ({result.recommendations.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500 space-y-2">
              <Film className="h-10 w-10 text-zinc-600 stroke-[1.5]" />
              <p className="text-sm">Type any phrase above to activate AI natural language movie matching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
