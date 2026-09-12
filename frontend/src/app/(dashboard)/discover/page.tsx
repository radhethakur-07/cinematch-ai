"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { MovieListResponse, Genre } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";
import { Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

export default function DiscoverPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [page, setPage] = useState<number>(1);

  // Fetch Genres
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => api.get<Genre[]>("/movies/genres"),
  });

  // Fetch Movies
  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movies", "discover", selectedGenre, sortBy, page],
    queryFn: () =>
      api.get<MovieListResponse>("/movies", {
        genre_id: selectedGenre,
        sort_by: sortBy,
        page,
        page_size: 16,
      }),
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header & Filter Controls - Mobile Scalable */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cinema-border/90 pb-5">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Discover Catalog</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">
            Filter through cinematic releases by genre, ratings, and popularity
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Genre select */}
          <div className="flex-1 sm:flex-none">
            <select
              value={selectedGenre || ""}
              onChange={(e) => {
                setSelectedGenre(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-xl border border-cinema-border bg-cinema-card px-3.5 py-2.5 text-xs font-bold text-zinc-100 focus:border-brand-500 focus:outline-none shadow-md cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort select */}
          <div className="flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-xl border border-cinema-border bg-cinema-card px-3.5 py-2.5 text-xs font-bold text-zinc-100 focus:border-brand-500 focus:outline-none shadow-md cursor-pointer"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Newest Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-9 w-9 text-brand-500 animate-spin" />
          <p className="text-sm font-bold text-zinc-300">Loading catalog movies...</p>
        </div>
      ) : movieData?.items && movieData.items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {movieData.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
            ))}
          </div>

          {/* Pagination - Mobile Friendly */}
          <div className="flex items-center justify-between border-t border-cinema-border pt-6">
            <span className="text-xs text-zinc-400 font-medium">
              Page {movieData.page} of {movieData.total_pages} ({movieData.total} movies)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-xl border border-cinema-border bg-cinema-card px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-brand-600 hover:border-brand-500 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(movieData.total_pages, p + 1))}
                disabled={page >= movieData.total_pages}
                className="flex items-center gap-1 rounded-xl border border-cinema-border bg-cinema-card px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-brand-600 hover:border-brand-500 disabled:opacity-40 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center text-zinc-400 space-y-3">
          <p className="text-base font-bold text-white">No movies found matching these filters.</p>
          <button
            onClick={() => {
              setSelectedGenre(undefined);
              setSortBy("popularity.desc");
            }}
            className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-500 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
