"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { AdminDashboardMetrics, AdminAnalyticsChart } from "@/types";
import { ShieldCheck, Users, Film, Star, Bookmark, Activity, Zap, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { RatingsBarChart, GenrePieChart, ActivityTrendChart } from "@/components/charts/taste-charts";

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: () => api.get<AdminDashboardMetrics>("/admin/metrics"),
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => api.get<AdminAnalyticsChart>("/admin/analytics"),
  });

  if (metricsLoading || analyticsLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading admin metrics & telemetry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-white">Admin Control & Telemetry</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time platform metrics, recommendation latency, user growth, and catalog distribution
          </p>
        </div>

        {/* Quick Admin Navigation links */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/users"
            className="px-3 py-1.5 rounded-lg border border-cinema-border bg-cinema-card text-xs font-semibold text-zinc-300 hover:text-white hover:bg-cinema-hover transition-colors"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/movies"
            className="px-3 py-1.5 rounded-lg border border-cinema-border bg-cinema-card text-xs font-semibold text-zinc-300 hover:text-white hover:bg-cinema-hover transition-colors"
          >
            Movie Catalog
          </Link>
          <Link
            href="/admin/analytics"
            className="px-3 py-1.5 rounded-lg bg-brand-600/20 border border-brand-500/30 text-xs font-semibold text-brand-300 hover:bg-brand-600/30 transition-colors"
          >
            Deep Analytics
          </Link>
        </div>
      </div>

      {/* 1. KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.total_users || 0}</p>
          <span className="text-[11px] text-emerald-400">● {metrics?.active_users_30d || 0} active (30d)</span>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Ratings</span>
            <Star className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.total_ratings || 0}</p>
          <span className="text-[11px] text-zinc-400">Avg {metrics?.average_platform_rating || 4.2}★ rating</span>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Rec Requests</span>
            <Activity className="h-4 w-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.total_recommendation_requests || 0}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Zap className="h-3 w-3" /> {metrics?.system_latency_ms || 48}ms latency
          </span>
        </div>

        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Catalog Movies</span>
            <Film className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.total_movies || 0}</p>
          <span className="text-[11px] text-zinc-400">{metrics?.total_watchlist_entries || 0} in watchlists</span>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ratings Distribution Chart */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Platform Ratings Distribution
          </h3>
          <p className="text-xs text-zinc-400">Histogram of 1 to 5 star ratings submitted across all movies</p>
          {analytics?.ratings_distribution && (
            <RatingsBarChart distribution={analytics.ratings_distribution} />
          )}
        </div>

        {/* Activity Trend Line Chart */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Activity & Inference Timeline
          </h3>
          <p className="text-xs text-zinc-400">Daily recommendation requests vs user rating interactions</p>
          {analytics?.activity_trend && (
            <ActivityTrendChart activity={analytics.activity_trend} />
          )}
        </div>
      </div>

      {/* 3. Catalog Overview */}
      <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Top Acclaimed Movies in System
          </h3>
          <Link href="/admin/movies" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
            <span>View Full Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black/40 text-zinc-400 font-semibold border-b border-cinema-border">
              <tr>
                <th className="p-3">TMDB ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Vote Count</th>
                <th className="p-3">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border/50">
              {analytics?.highest_rated_movies?.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-zinc-400">{m.id}</td>
                  <td className="p-3 font-semibold text-white">{m.title}</td>
                  <td className="p-3 text-amber-400 font-bold">{m.vote_average?.toFixed(1)}★</td>
                  <td className="p-3">{m.vote_count?.toLocaleString()}</td>
                  <td className="p-3 font-mono text-cyan-400">{m.popularity?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
