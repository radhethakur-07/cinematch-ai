"use client";

import Link from "next/link";
import { User, Star, Film, Bookmark, Brain, Clock, Settings, Loader2 } from "lucide-react";
import { useTasteProfile } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";
import { GenreRadarChart } from "@/components/charts/taste-charts";
import { MovieCard } from "@/components/movies/movie-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: tasteProfile, isLoading } = useTasteProfile();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <EmptyState
          icon={User}
          title="Sign in to view your taste profile"
          description="Access your personal cinematic taste analytics, genre affinity radar, and recommendation statistics."
          actionLabel="Sign In"
          onAction={() => window.location.href = "/login"}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-6 w-6 text-crimson animate-spin" />
        <p className="text-sm text-cinema-muted">Synthesizing taste profile analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Profile Banner Header */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-cinema-elevated border border-cinema-border flex items-center justify-center text-xl font-semibold text-cinema-text">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-cinema-text">{user?.full_name || "CineMatch Explorer"}</h1>
            <p className="text-xs text-cinema-muted mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Taste Profile Calibrated
              </span>
            </div>
          </div>
        </div>

        <Link href="/settings">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-cinema-muted hover:text-cinema-text">
            <Settings className="h-3.5 w-3.5" />
            <span>Edit Preferences</span>
          </Button>
        </Link>
      </div>

      {/* 2. Key Metrics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1">
          <span className="text-xs text-cinema-muted flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-gold" />
            Average Rating
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{tasteProfile?.average_rating_given || 4.5}★</p>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1">
          <span className="text-xs text-cinema-muted flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-crimson" />
            Rated Titles
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{tasteProfile?.total_movies_rated || 0}</p>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1">
          <span className="text-xs text-cinema-muted flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-cinema-secondary" />
            Watchlist
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{tasteProfile?.total_watchlist_count || 0}</p>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1">
          <span className="text-xs text-cinema-muted flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            Total Interactions
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{tasteProfile?.recent_activity_count || 0}</p>
        </div>
      </div>

      {/* 3. Taste Profile Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Affinity Radar */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-crimson" />
              <h3 className="text-sm font-semibold text-cinema-text">Genre Affinity Radar</h3>
            </div>
            <span className="text-xs text-cinema-muted">TF-IDF Vector Weighting</span>
          </div>

          <p className="text-xs text-cinema-muted">
            Derived from your ratings, likes, and selected genre signals.
          </p>

          <GenreRadarChart affinities={tasteProfile?.top_genres || []} />
        </div>

        {/* Top Genre Affinity Breakdown */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-cinema-text">Top Genre Matches</h3>
            <p className="text-xs text-cinema-muted">Relative affinity percentages utilized by the hybrid engine</p>
          </div>

          <div className="space-y-3.5 my-auto">
            {tasteProfile?.top_genres?.map((g, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cinema-secondary font-medium">{g.genre_name}</span>
                  <span className="text-cinema-muted font-mono">{g.affinity_percentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-cinema-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-crimson transition-all duration-700"
                    style={{ width: `${g.affinity_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cinema-border text-xs text-cinema-muted">
            Preferred Eras: <span className="text-cinema-text font-medium">{tasteProfile?.preferred_decades?.join(", ") || "2010s, 2020s"}</span>
          </div>
        </div>
      </div>

      {/* 4. Top Rated Movies By You */}
      {tasteProfile?.top_rated_movies && tasteProfile.top_rated_movies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cinema-text">Your Highest Rated Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {tasteProfile.top_rated_movies.map((m) => (
              <MovieCard key={m.id} movie={m} showMatchPercentage={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
