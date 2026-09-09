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
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center justify-between border-b border-cinema-border/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-card text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-brand-400" />
              Deep Analytics & Inference Metrics
            </h1>
            <p className="text-xs text-zinc-400">Platform-wide genre distributions and rating consensus</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <p className="text-sm text-zinc-400">Synthesizing deep analytics charts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Genre Distribution Pie Chart */}
          <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-cyan-400" />
                Catalog Genre Distribution
              </h3>
            </div>
            <p className="text-xs text-zinc-400">Proportion of movie genres across the indexed catalog</p>
            {analytics?.genre_distribution && (
              <GenrePieChart genres={analytics.genre_distribution} />
            )}
          </div>

          {/* Ratings Bar Chart */}
          <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-amber-400" />
                Ratings Histogram
              </h3>
            </div>
            <p className="text-xs text-zinc-400">Distribution of 1 to 5 star user rating interactions</p>
            {analytics?.ratings_distribution && (
              <RatingsBarChart distribution={analytics.ratings_distribution} />
            )}
          </div>

          {/* Activity Trend Full Width */}
          <div className="lg:col-span-2 rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-400" />
              Daily Telemetry & User Interactions
            </h3>
            <p className="text-xs text-zinc-400">Total recommendation requests vs new rating events</p>
            {analytics?.activity_trend && (
              <ActivityTrendChart activity={analytics.activity_trend} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
