"use client";

import Link from "next/link";
import { User, Star, Film, Bookmark, Sparkles, Brain, Clock, Settings, Loader2 } from "lucide-react";
import { useTasteProfile } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";
import { GenreRadarChart, RatingsBarChart } from "@/components/charts/taste-charts";
import { MovieCard } from "@/components/movies/movie-card";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: tasteProfile, isLoading } = useTasteProfile();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <User className="h-12 w-12 text-brand-500" />
        <h2 className="text-2xl font-bold text-white">Sign In to View Taste Profile</h2>
        <p className="text-sm text-zinc-400 max-w-md">
          Access your personal cinematic taste analytics, genre affinity radar, and recommendation statistics.
        </p>
        <Link href="/login" className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-500">
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        <p className="text-sm text-zinc-400">Synthesizing user taste profile and vector analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Profile Banner Header */}
      <div className="rounded-3xl border border-cinema-border bg-gradient-to-r from-cinema-card via-cinema-card to-brand-950/30 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 p-0.5 shadow-xl">
            <div className="h-full w-full rounded-2xl bg-cinema-bg flex items-center justify-center text-xl font-bold text-white">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user?.full_name || "CineMatch Explorer"}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Hybrid Profile Calibrated
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-1.5 rounded-xl border border-cinema-border bg-cinema-card px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-cinema-hover transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Edit Preferences</span>
        </Link>
      </div>

      {/* 2. Key Metrics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            Average Rating
          </span>
          <p className="text-2xl font-black text-white">{tasteProfile?.average_rating_given || 4.5}★</p>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-rose-400" />
            Rated Movies
          </span>
          <p className="text-2xl font-black text-white">{tasteProfile?.total_movies_rated || 0}</p>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-cyan-400" />
            Watchlist
          </span>
          <p className="text-2xl font-black text-white">{tasteProfile?.total_watchlist_count || 0}</p>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            Total Interactions
          </span>
          <p className="text-2xl font-black text-white">{tasteProfile?.recent_activity_count || 0}</p>
        </div>
      </div>

      {/* 3. Taste Profile Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Affinity Radar */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-400" />
              <h3 className="text-base font-bold text-white">Genre Affinity Radar</h3>
            </div>
            <span className="text-xs text-zinc-400">TF-IDF Vector Weighting</span>
          </div>

          <p className="text-xs text-zinc-400">
            Computed from your ratings, likes, and onboarding genre signals.
          </p>

          <GenreRadarChart affinities={tasteProfile?.top_genres || []} />
        </div>

        {/* Top Genre Affinity Breakdown */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Top Genre Matches</h3>
            <p className="text-xs text-zinc-400">Relative affinity percentages utilized by the hybrid engine</p>
          </div>

          <div className="space-y-3.5 my-auto">
            {tasteProfile?.top_genres?.map((g, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-200">{g.genre_name}</span>
                  <span className="text-brand-400 font-mono">{g.affinity_percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${g.affinity_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cinema-border/50 text-[11px] text-zinc-500">
            Preferred Eras: {tasteProfile?.preferred_decades?.join(", ") || "2010s, 2020s"}
          </div>
        </div>
      </div>

      {/* 4. Top Rated Movies By You */}
      {tasteProfile?.top_rated_movies && tasteProfile.top_rated_movies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Your Highest Rated Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tasteProfile.top_rated_movies.map((m) => (
              <MovieCard key={m.id} movie={m} showMatchPercentage={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
