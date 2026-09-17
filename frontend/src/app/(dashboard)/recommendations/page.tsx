"use client";

import { useState } from "react";
import { Sparkles, Bot, Loader2, ArrowRight, Brain, RotateCcw } from "lucide-react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useAIMoodSearch } from "@/hooks/use-recommendations";
import { MovieCard } from "@/components/movies/movie-card";
import { AIMoodSearchResponse } from "@/types";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState<AIMoodSearchResponse | null>(null);

  const { data: recData, isLoading: recLoading } = useRecommendations(24);
  const aiSearch = useAIMoodSearch();

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    aiSearch.mutate(prompt, {
      onSuccess: (data) => setAiResult(data),
    });
  };

  const sampleQueries = [
    "Mind-bending sci-fi like Interstellar but not too long",
    "Dark psychological thriller with an unexpected twist",
    "Uplifting feel-good adventure with stunning visuals",
    "Gritty crime drama with iconic dialogue"
  ];

  const currentList = aiResult ? aiResult.recommendations : recData?.recommendations || [];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface px-3 py-1 text-xs font-medium text-cinema-muted">
          <Brain className="h-3.5 w-3.5 text-crimson" />
          <span>Hybrid Recommendation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-cinema-text">
          Personalized Cinema Matching
        </h1>
        <p className="text-sm text-cinema-muted">
          Ranked using TF-IDF content similarity, collaborative user preference vectors, and natural language intent parsing.
        </p>
      </div>

      {/* Interactive AI Prompt Box */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-cinema-text">
          <Bot className="h-4 w-4 text-crimson" />
          <h2 className="text-sm font-semibold">Describe What You Want To Watch</h2>
        </div>

        <form onSubmit={handleAISubmit} className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I want something like Interstellar but more emotional and under 2 hours..."
            className="w-full rounded-lg bg-cinema-elevated border border-cinema-border px-4 py-3.5 pl-11 pr-36 text-sm text-cinema-text placeholder-cinema-muted/60 focus:border-crimson focus:outline-none transition-colors"
          />
          <Sparkles className="absolute left-4 h-4 w-4 text-cinema-muted" />
          <Button
            type="submit"
            size="sm"
            disabled={aiSearch.isPending || !prompt.trim()}
            className="absolute right-2 text-xs h-8 gap-1.5"
          >
            {aiSearch.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <span>Match Films</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Inspiration chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-cinema-muted">Suggestions:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(q);
                aiSearch.mutate(q, { onSuccess: (data) => setAiResult(data) });
              }}
              className="text-xs text-cinema-secondary bg-cinema-elevated border border-cinema-border px-3 py-1 rounded-full hover:border-crimson/50 hover:text-cinema-text transition-all"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* AI Intent Breakdown if active */}
      {aiResult && (
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cinema-text flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-crimson" />
              Extracted Intent ({aiResult.ai_provider})
            </span>
            <button
              onClick={() => {
                setAiResult(null);
                setPrompt("");
              }}
              className="text-xs text-cinema-muted hover:text-crimson flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to Hybrid Feed
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-cinema-elevated p-3 rounded-lg border border-cinema-border-subtle space-y-1">
              <span className="text-cinema-muted block">Genres</span>
              <span className="text-cinema-text font-medium">{aiResult.structured_intent.genres?.join(", ") || "Any"}</span>
            </div>
            <div className="bg-cinema-elevated p-3 rounded-lg border border-cinema-border-subtle space-y-1">
              <span className="text-cinema-muted block">Moods</span>
              <span className="text-cinema-text font-medium">{aiResult.structured_intent.moods?.join(", ") || "General"}</span>
            </div>
            <div className="bg-cinema-elevated p-3 rounded-lg border border-cinema-border-subtle space-y-1">
              <span className="text-cinema-muted block">Similar To</span>
              <span className="text-cinema-text font-medium">{aiResult.structured_intent.similar_to?.join(", ") || "None"}</span>
            </div>
            <div className="bg-cinema-elevated p-3 rounded-lg border border-cinema-border-subtle space-y-1">
              <span className="text-cinema-muted block">Max Runtime</span>
              <span className="text-cinema-text font-medium">
                {aiResult.structured_intent.max_runtime ? `≤ ${aiResult.structured_intent.max_runtime} min` : "No limit"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Feed Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-cinema-border pb-4">
          <div>
            <h2 className="text-lg font-semibold text-cinema-text">
              {aiResult ? "Intent-Matched Recommendations" : "Personalized Hybrid Recommendations"}
            </h2>
            <p className="text-xs text-cinema-muted">
              {aiResult
                ? `Ranked via cosine similarity across extracted mood & genre features`
                : `Calculated from your interaction vectors and TMDB popularity signals`}
            </p>
          </div>
          <span className="text-xs text-cinema-muted font-medium">
            {currentList.length} Titles
          </span>
        </div>

        {recLoading || aiSearch.isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <div className="skeleton aspect-[2/3] w-full rounded-xl" />
                <div className="skeleton h-4 w-3/4 rounded-md" />
                <div className="skeleton h-3 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {currentList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showMatchPercentage={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
