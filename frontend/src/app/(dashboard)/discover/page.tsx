"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { MovieListResponse, Genre } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";
import { Loader2, ChevronLeft, ChevronRight, Compass, SlidersHorizontal, X } from "lucide-react";

// Skeleton grid
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
          <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
          <div className="skeleton h-3.5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(undefined);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [page, setPage] = useState<number>(1);

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => api.get<Genre[]>("/movies/genres"),
  });

  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movies", "discover", selectedMediaType, selectedGenre, sortBy, page],
    queryFn: () =>
      api.get<MovieListResponse>("/movies", {
        media_type: selectedMediaType,
        genre_id: selectedGenre,
        sort_by: sortBy,
        page,
        page_size: 20,
      }),
  });

  const hasActiveFilters = selectedMediaType !== undefined || selectedGenre !== undefined || sortBy !== "popularity.desc";

  const clearFilters = () => {
    setSelectedMediaType(undefined);
    setSelectedGenre(undefined);
    setSortBy("popularity.desc");
    setPage(1);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">

      {/* Page Header */}
      <div className="space-y-1 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-600/20 border border-brand-500/30">
            <Compass className="h-5 w-5 text-brand-400" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Discover Catalog</h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 font-medium pl-14">
          Explore {movieData?.total || "229"} verified Hindi blockbusters, classic cinema &amp; premier web series
        </p>
      </div>

      {/* Filter Bar */}
      <div className="space-y-3 animate-fade-in-up delay-75">
        {/* Media Type Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-cinema-card/80 p-1 rounded-xl border border-cinema-border shadow-inner backdrop-blur-md">
            {[
              { label: "All", value: undefined },
              { label: "Movies", value: "Movie" },
              { label: "Web Series", value: "Series" },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => { setSelectedMediaType(value); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMediaType === value
                    ? "bg-gradient-to-r from-brand-600 to-rose-700 text-white shadow-md shadow-brand-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="rounded-xl border border-cinema-border bg-cinema-card px-3.5 py-2 text-xs font-bold text-zinc-100 focus:border-brand-500 focus:outline-none shadow-md cursor-pointer backdrop-blur-md"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest Releases</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-500/40 bg-brand-500/10 text-xs font-bold text-brand-300 hover:bg-brand-500/20 transition-all"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Genre Pills Row */}
        {genres && genres.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => { setSelectedGenre(undefined); setPage(1); }}
              className={`genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border ${
                selectedGenre === undefined
                  ? "active border-brand-500/70 bg-gradient-to-r from-brand-600/30 to-purple-600/20 text-white"
                  : "border-cinema-border text-zinc-400 bg-cinema-card/60"
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => { setSelectedGenre(genre.id); setPage(1); }}
                className={`genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border ${
                  selectedGenre === genre.id
                    ? "active border-brand-500/70 bg-gradient-to-r from-brand-600/30 to-purple-600/20 text-white"
                    : "border-cinema-border text-zinc-400 bg-cinema-card/60"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && movieData && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 animate-fade-in">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Showing <strong className="text-zinc-300">{movieData.items.length}</strong> of <strong className="text-zinc-300">{movieData.total}</strong> titles</span>
        </div>
      )}

      {/* Movie Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : movieData?.items && movieData.items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {movieData.items.map((movie, i) => (
              <div key={movie.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 25, 400)}ms` }}>
                <MovieCard movie={movie} showMatchPercentage={false} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-cinema-border pt-6">
            <span className="text-xs text-zinc-500 font-medium">
              Page <strong className="text-zinc-300">{movieData.page}</strong> of <strong className="text-zinc-300">{movieData.total_pages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1.5 rounded-xl border border-cinema-border bg-cinema-card px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-brand-600 hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(movieData.total_pages, p + 1))}
                disabled={page >= movieData.total_pages}
                className="flex items-center gap-1.5 rounded-xl border border-cinema-border bg-cinema-card px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-brand-600 hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-cinema-card border border-cinema-border flex items-center justify-center mx-auto">
            <Compass className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="text-base font-bold text-white">No movies found</p>
          <p className="text-sm text-zinc-500">Try adjusting your filters or clearing them entirely.</p>
          <button
            onClick={clearFilters}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-500 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
