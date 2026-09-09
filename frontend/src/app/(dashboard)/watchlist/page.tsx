"use client";

import Link from "next/link";
import { useWatchlist } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movies/movie-card";
import { Bookmark, Film, Loader2, Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function WatchlistPage() {
  const { isAuthenticated } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <Bookmark className="h-12 w-12 text-brand-500" />
        <h2 className="text-2xl font-bold text-white">Sign In to View Watchlist</h2>
        <p className="text-sm text-zinc-400 max-w-md">
          Save films you want to watch and tune your hybrid recommendation profile.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-500"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading your saved watchlist...</p>
      </div>
    );
  }

  const movies = watchlist?.map((w) => w.movie) || [];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cinema-border/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-brand-500" />
            My Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Films queued for your upcoming movie nights
          </p>
        </div>
        <span className="text-xs font-semibold text-zinc-300 bg-cinema-card border border-cinema-border px-3 py-1.5 rounded-lg">
          {movies.length} {movies.length === 1 ? "Movie" : "Movies"}
        </span>
      </div>

      {/* Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4">
          <Film className="h-12 w-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Browse our catalog or AI recommendations and click the bookmark button to save movies.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-500"
          >
            <Compass className="h-4 w-4" />
            <span>Discover Movies</span>
          </Link>
        </div>
      )}
    </div>
  );
}
