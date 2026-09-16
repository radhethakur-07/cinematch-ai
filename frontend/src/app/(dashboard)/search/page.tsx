"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Loader2, Film, X, TrendingUp } from "lucide-react";
import { useSearchMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movies/movie-card";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

const TRENDING_SEARCHES = ["Mirzapur", "Scam 1992", "The Family Man", "Interstellar", "Sacred Games", "RRR", "Drishyam"];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useSearchMovies(debouncedQuery);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-5 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Search <span className="text-gradient-rich">Cinema</span>
          </h1>
          <p className="text-sm text-zinc-500">
            Find movies by title, director, lead actors, or keywords
          </p>
        </div>

        {/* Input Bar */}
        <div className={`relative flex items-center rounded-2xl border transition-all duration-300 search-glow ${
          isFocused ? "border-brand-500/70" : "border-cinema-border"
        } bg-cinema-card shadow-2xl`}>
          <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by title, director, actor..."
            className="w-full bg-transparent px-4 py-4 pl-12 pr-32 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
            autoFocus
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-[110px] text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setAiModalOpen(true)}
            className="absolute right-2.5 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white hover:opacity-90 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Search</span>
          </button>
        </div>

        {/* Trending Searches - show when empty */}
        {!searchTerm && !debouncedQuery && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-cinema-card border border-cinema-border text-zinc-400 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/10 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
            <p className="text-sm text-zinc-500">Searching cinema catalog...</p>
          </div>
        )}

        {!isLoading && searchResults?.items && searchResults.items.length > 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 text-xs text-zinc-500 px-1">
              <span>Found <strong className="text-zinc-300">{searchResults.total}</strong> matches for &ldquo;{debouncedQuery}&rdquo;</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.items.map((movie, i) => (
                <div key={movie.id} className="animate-scale-in" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                  <MovieCard movie={movie} showMatchPercentage={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && debouncedQuery && searchResults?.items?.length === 0 && (
          <div className="py-20 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-cinema-card border border-cinema-border flex items-center justify-center mx-auto">
              <Film className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-base font-bold text-white">No results for &ldquo;{debouncedQuery}&rdquo;</p>
            <p className="text-sm text-zinc-500">
              Try searching by director name or use our AI mood search for natural language queries.
            </p>
            <button
              onClick={() => setAiModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600/20 to-purple-600/20 border border-brand-500/30 px-5 py-2.5 text-sm font-bold text-brand-300 hover:bg-brand-600/30 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Describe what you want with AI
            </button>
          </div>
        )}
      </div>

      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
