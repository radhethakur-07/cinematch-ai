"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { AdminAnalyticsChart } from "@/types";
import { TrendingUp, ArrowLeft, Loader2, PieChart as PieIcon, BarChart2 } from "lucide-react";
import { RatingsBarChart, GenrePieChart, ActivityTrendChart } from "@/components/charts/taste-charts";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => api.get<AdminAnalyticsChart>("/admin/analytics"),
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="flex items-center justify-between border-b border-cinema-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-surface text-cinema-muted hover:text-cinema-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-cinema-text flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-crimson" />
              Platform Analytics & Distribution
            </h1>
            <p className="text-xs text-cinema-muted">Platform-wide genre distributions and rating consensus</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 text-crimson animate-spin" />
          <p className="text-sm text-cinema-muted">Synthesizing analytics charts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Genre Distribution Pie Chart */}
          <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-cinema-text flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-crimson" />
                Catalog Genre Distribution
              </h2>
            </div>
            <p className="text-xs text-cinema-muted">Proportion of movie genres across the indexed catalog</p>
            {analytics?.genre_distribution && (
              <GenrePieChart genres={analytics.genre_distribution} />
            )}
          </div>

          {/* Ratings Bar Chart */}
          <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-cinema-text flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-gold" />
                Ratings Histogram
              </h2>
            </div>
            <p className="text-xs text-cinema-muted">Distribution of 1 to 5 star user rating interactions</p>
            {analytics?.ratings_distribution && (
              <RatingsBarChart distribution={analytics.ratings_distribution} />
            )}
          </div>

          {/* Activity Trend Full Width */}
          <div className="lg:col-span-2 rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold text-cinema-text flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-crimson" />
              Daily Telemetry & User Interactions
            </h2>
            <p className="text-xs text-cinema-muted">Total recommendation requests vs new rating events</p>
            {analytics?.activity_trend && (
              <ActivityTrendChart activity={analytics.activity_trend} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
