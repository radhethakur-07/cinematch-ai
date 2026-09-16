"use client";

import { useState } from "react";
import { Sparkles, Bot, Loader2, ArrowRight, Brain, Filter, CheckCircle } from "lucide-react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useAIMoodSearch } from "@/hooks/use-recommendations";
import { MovieCard } from "@/components/movies/movie-card";
import { AIMoodSearchResponse } from "@/types";

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
    "Gritty crime caper with iconic dialogue"
  ];

  const baseList = aiResult ? aiResult.recommendations : recData?.recommendations || [];
  const currentList = [...baseList];
  if (!aiResult) {
    const mirzapurIdx = currentList.findIndex(
      (m) => m.id === 804680 || m.title.toLowerCase().includes("mirzapur")
    );
    if (mirzapurIdx > 0) {
      const [mirzapur] = currentList.splice(mirzapurIdx, 1);
      currentList.unshift(mirzapur);
    }
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 shadow-md">
          <Brain className="h-4 w-4 text-brand-400" />
          <span>Multi-Modal Hybrid Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI Recommendation Hub</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Powered by Scikit-Learn TF-IDF vectorization, collaborative matrix factorization, and Google Gemini natural language intent translation.
        </p>
      </div>

      {/* Interactive AI Prompt Box */}
      <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-cinema-card via-cinema-card to-brand-950/20 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-brand-400" />
          <h2 className="text-base font-bold text-white">Describe What You Want To Watch</h2>
        </div>

        <form onSubmit={handleAISubmit} className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I want something like Interstellar but more emotional and not too long..."
            className="w-full rounded-2xl bg-black/50 border border-cinema-border px-4 py-4 pl-12 pr-32 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner"
          />
          <Sparkles className="absolute left-4 h-5 w-5 text-brand-400" />
          <button
            type="submit"
            disabled={aiSearch.isPending || !prompt.trim()}
            className="absolute right-2.5 flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-500 disabled:opacity-50 transition-all shadow-md shadow-brand-600/30"
          >
            {aiSearch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Run AI Engine</span><ArrowRight className="h-3.5 w-3.5" /></>}
          </button>
        </form>

        {/* Quick Inspiration chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-zinc-400">Inspiration:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(q);
                aiSearch.mutate(q, { onSuccess: (data) => setAiResult(data) });
              }}
              className="text-xs text-zinc-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full hover:border-brand-500/50 hover:text-white transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Intent Breakdown if active */}
      {aiResult && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Gemini Structured Intent Mapping ({aiResult.ai_provider})
            </span>
            <button
              onClick={() => {
                setAiResult(null);
                setPrompt("");
              }}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              Reset to Full Hybrid Feed
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="text-zinc-500 block mb-0.5">Genres:</span>
              <span className="text-zinc-200 font-semibold">{aiResult.structured_intent.genres?.join(", ") || "Any"}</span>
            </div>
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="text-zinc-500 block mb-0.5">Moods:</span>
              <span className="text-zinc-200 font-semibold">{aiResult.structured_intent.moods?.join(", ") || "General"}</span>
            </div>
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="text-zinc-500 block mb-0.5">Similar To:</span>
              <span className="text-zinc-200 font-semibold">{aiResult.structured_intent.similar_to?.join(", ") || "None"}</span>
            </div>
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="text-zinc-500 block mb-0.5">Max Runtime:</span>
              <span className="text-zinc-200 font-semibold">
                {aiResult.structured_intent.max_runtime ? `≤ ${aiResult.structured_intent.max_runtime} min` : "No limit"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Feed Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-cinema-border/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {aiResult ? "AI Mood-Matched Recommendations" : "Personalized Hybrid Recommendations"}
            </h2>
            <p className="text-xs text-zinc-400">
              {aiResult
                ? `Filtered by extracted intent and ranked via Cosine Similarity`
                : `Calculated from your interaction vectors and TMDB popularity signals`}
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">
            {currentList.length} Films
          </span>
        </div>

        {recLoading || aiSearch.isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
                <div className="skeleton h-3.5 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {currentList.map((movie, i) => (
              <div key={movie.id} className="animate-scale-in" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <MovieCard movie={movie} showMatchPercentage={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
