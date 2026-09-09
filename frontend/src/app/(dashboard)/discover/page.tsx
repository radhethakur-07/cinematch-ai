"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { MovieListResponse, Genre } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";
import { Filter, Loader2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cinema-border/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Discover Catalog</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Filter through cinematic releases by genre, ratings, and release timeline
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Genre select */}
          <div className="relative">
            <select
              value={selectedGenre || ""}
              onChange={(e) => {
                setSelectedGenre(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="rounded-xl border border-cinema-border bg-cinema-card px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-brand-500 focus:outline-none"
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
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-cinema-border bg-cinema-card px-3.5 py-2 text-xs font-semibold text-zinc-200 focus:border-brand-500 focus:outline-none"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Release Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <p className="text-sm text-zinc-400">Loading catalog movies...</p>
        </div>
      ) : movieData?.items && movieData.items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movieData.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-cinema-border pt-6">
            <span className="text-xs text-zinc-400">
              Page {movieData.page} of {movieData.total_pages} ({movieData.total} movies)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-cinema-border bg-cinema-card px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-cinema-hover disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(movieData.total_pages, p + 1))}
                disabled={page >= movieData.total_pages}
                className="flex items-center gap-1 rounded-lg border border-cinema-border bg-cinema-card px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-cinema-hover disabled:opacity-40 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-base font-semibold">No movies found matching these filters.</p>
          <button
            onClick={() => {
              setSelectedGenre(undefined);
              setSortBy("popularity.desc");
            }}
            className="mt-3 text-xs font-semibold text-brand-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
