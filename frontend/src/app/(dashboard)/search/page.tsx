"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Loader2, Film, X, TrendingUp } from "lucide-react";
import { useSearchMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movies/movie-card";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-cinema-text">
            Search Cinema
          </h1>
          <p className="text-sm text-cinema-muted">
            Find movies and series by title, director, actors, or keywords.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          isFocused ? "border-crimson shadow-subtle bg-cinema-elevated" : "border-cinema-border bg-cinema-surface"
        }`}>
          <Search className="absolute left-4 h-4 w-4 text-cinema-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by title, director, cast..."
            className="w-full bg-transparent px-4 py-3.5 pl-11 pr-32 text-sm text-cinema-text placeholder-cinema-muted/60 focus:outline-none"
            autoFocus
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-28 p-1 text-cinema-muted hover:text-cinema-text transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAiModalOpen(true)}
            className="absolute right-2 text-xs border border-cinema-border h-8 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-crimson" />
            <span>AI Search</span>
          </Button>
        </div>

        {/* Trending Searches */}
        {!searchTerm && !debouncedQuery && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-cinema-muted">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-cinema-surface border border-cinema-border text-cinema-secondary hover:text-cinema-text hover:border-crimson/40 hover:bg-crimson/5 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-6 w-6 text-crimson animate-spin" />
            <p className="text-sm text-cinema-muted">Searching catalog...</p>
          </div>
        )}

        {!isLoading && searchResults?.items && searchResults.items.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-cinema-muted">
              <span>Found <span className="font-medium text-cinema-text">{searchResults.total}</span> titles matching &ldquo;{debouncedQuery}&rdquo;</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && debouncedQuery && searchResults?.items?.length === 0 && (
          <EmptyState
            icon={Film}
            title={`No results for "${debouncedQuery}"`}
            description="Try searching by director name, or use natural language to describe what you're in the mood for."
            actionLabel="Ask CineMatch AI"
            onAction={() => setAiModalOpen(true)}
          />
        )}
      </div>

      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
