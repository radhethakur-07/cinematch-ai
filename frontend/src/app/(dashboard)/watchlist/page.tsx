"use client";

import Link from "next/link";
import { useWatchlist } from "@/hooks/use-movies";
import { MovieCard } from "@/components/movies/movie-card";
import { Bookmark, Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function WatchlistPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();

  if (!isHydrated || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="space-y-2">
          <div className="skeleton h-8 w-44 rounded-lg" />
          <div className="skeleton h-4 w-60 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="skeleton aspect-[2/3] w-full rounded-xl" />
              <div className="skeleton h-4 w-3/4 rounded-md" />
              <div className="skeleton h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <EmptyState
          icon={Bookmark}
          title="Sign in to view your watchlist"
          description="Save titles you want to watch and tune your personalized recommendations."
          actionLabel="Sign In"
          onAction={() => window.location.href = "/login"}
        />
      </div>
    );
  }

  const movies = watchlist?.map((w) => w.movie) || [];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cinema-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
            My Watchlist
          </h1>
          <p className="text-sm text-cinema-muted">
            Titles saved for upcoming viewing sessions.
          </p>
        </div>
        <span className="text-xs font-medium text-cinema-muted bg-cinema-surface border border-cinema-border px-3 py-1.5 rounded-lg">
          {movies.length} {movies.length === 1 ? "Title" : "Titles"}
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
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          description="Browse the catalog or ask AI for recommendations and save titles to watch later."
          actionLabel="Discover Movies"
          onAction={() => window.location.href = "/discover"}
        />
      )}
    </div>
  );
}
