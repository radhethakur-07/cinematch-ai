"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Loader2, Film, X } from "lucide-react";
import { useSearchMovies } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movies/movie-card";
import { NaturalSearchDialog } from "@/components/ai/natural-search-dialog";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useSearchMovies(debouncedQuery);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Search Cinema Catalog</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Find movies by title, director, lead actors, or keywords across our database
        </p>

        {/* Input Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, director (e.g. Nolan), or actor..."
            className="w-full rounded-2xl bg-cinema-card border border-cinema-border px-4 py-4 pl-12 pr-28 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xl"
            autoFocus
          />
          <Search className="absolute left-4 h-5 w-5 text-zinc-400" />
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-24 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setAiModalOpen(true)}
            className="absolute right-2.5 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white hover:opacity-90 shadow-md transition-opacity"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Search</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
            <p className="text-sm text-zinc-400">Searching cinema catalog...</p>
          </div>
        )}

        {!isLoading && searchResults?.items && searchResults.items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span>Found {searchResults.total} matches</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && debouncedQuery && searchResults?.items?.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <Film className="h-10 w-10 text-zinc-600 mx-auto" />
            <p className="text-base font-semibold text-zinc-300">No matching movies found for "{debouncedQuery}".</p>
            <p className="text-xs text-zinc-500">
              Try searching by director name, general keywords, or try our conversational AI Mood Search.
            </p>
            <button
              onClick={() => setAiModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600/20 border border-brand-500/30 px-4 py-2 text-xs font-bold text-brand-300 hover:bg-brand-600/30"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Describe what you want with AI</span>
            </button>
          </div>
        )}
      </div>

      <NaturalSearchDialog open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </div>
  );
}
