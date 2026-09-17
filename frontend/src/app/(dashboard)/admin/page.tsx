"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { AdminDashboardMetrics, AdminAnalyticsChart } from "@/types";
import { ShieldCheck, Users, Film, Star, Activity, Zap, ChevronRight, Loader2 } from "lucide-react";
import { RatingsBarChart, ActivityTrendChart } from "@/components/charts/taste-charts";
import { Button } from "@/components/ui/button";

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
        <Loader2 className="h-6 w-6 text-crimson animate-spin" />
        <p className="text-sm text-cinema-muted">Loading platform telemetry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-crimson" />
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
              Platform Administration
            </h1>
          </div>
          <p className="text-sm text-cinema-muted">
            Platform telemetry, inference latency, recommendation requests, and catalog health.
          </p>
        </div>

        {/* Quick Admin Navigation links */}
        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button variant="secondary" size="sm" className="text-xs border border-cinema-border">
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/movies">
            <Button variant="secondary" size="sm" className="text-xs border border-cinema-border">
              Movie Catalog
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="primary" size="sm" className="text-xs">
              Deep Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-cinema-muted">
            <span className="text-xs font-medium">Total Users</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{metrics?.total_users || 0}</p>
          <span className="text-xs text-emerald-400 font-medium">{metrics?.active_users_30d || 0} active (30d)</span>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-cinema-muted">
            <span className="text-xs font-medium">Total Ratings</span>
            <Star className="h-4 w-4 text-gold" />
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{metrics?.total_ratings || 0}</p>
          <span className="text-xs text-cinema-muted">Avg {metrics?.average_platform_rating || 4.2}★ rating</span>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-cinema-muted">
            <span className="text-xs font-medium">Rec Requests</span>
            <Activity className="h-4 w-4 text-crimson" />
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{metrics?.total_recommendation_requests || 0}</p>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <Zap className="h-3 w-3" /> {metrics?.system_latency_ms || 48}ms latency
          </span>
        </div>

        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-cinema-muted">
            <span className="text-xs font-medium">Catalog Titles</span>
            <Film className="h-4 w-4" />
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-cinema-text">{metrics?.total_movies || 0}</p>
          <span className="text-xs text-cinema-muted">{metrics?.total_watchlist_entries || 0} in watchlists</span>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ratings Distribution Chart */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
          <h2 className="text-sm font-semibold text-cinema-text">
            Ratings Distribution
          </h2>
          <p className="text-xs text-cinema-muted">Histogram of 1 to 5 star ratings submitted across all movies</p>
          {analytics?.ratings_distribution && (
            <RatingsBarChart distribution={analytics.ratings_distribution} />
          )}
        </div>

        {/* Activity Trend Line Chart */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
          <h2 className="text-sm font-semibold text-cinema-text">
            Activity & Inference Timeline
          </h2>
          <p className="text-xs text-cinema-muted">Daily recommendation requests vs user rating interactions</p>
          {analytics?.activity_trend && (
            <ActivityTrendChart activity={analytics.activity_trend} />
          )}
        </div>
      </div>

      {/* 3. Catalog Overview */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cinema-text">
            Highest Rated Titles in Catalog
          </h2>
          <Link href="/admin/movies" className="text-xs text-crimson hover:underline flex items-center gap-1 font-medium">
            <span>View Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-cinema-secondary">
            <thead className="bg-cinema-elevated text-cinema-muted font-medium border-b border-cinema-border">
              <tr>
                <th className="p-3">TMDB ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Vote Count</th>
                <th className="p-3">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border-subtle">
              {analytics?.highest_rated_movies?.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-cinema-hover transition-colors">
                  <td className="p-3 font-mono text-cinema-muted">{m.id}</td>
                  <td className="p-3 font-medium text-cinema-text">{m.title}</td>
                  <td className="p-3 text-gold font-medium">{m.vote_average?.toFixed(1)}★</td>
                  <td className="p-3">{m.vote_count?.toLocaleString()}</td>
                  <td className="p-3 font-mono text-cinema-muted">{m.popularity?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
