"use client";

import Link from "next/link";
import Image from "next/image";
import { History, Star, Bookmark, ThumbsUp, ThumbsDown, Loader2, Eye, Calendar } from "lucide-react";
import { useWatchHistory } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";
import { getTMDBImageUrl, formatReleaseYear } from "@/lib/utils";

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { data: historyItems, isLoading } = useWatchHistory();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <History className="h-12 w-12 text-brand-500" />
        <h2 className="text-2xl font-bold text-white">Sign In to View History</h2>
        <p className="text-sm text-zinc-400 max-w-md">
          Track all your interactions, ratings, and recommendations clicks.
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
        <p className="text-sm text-zinc-400">Loading your interaction history...</p>
      </div>
    );
  }

  const renderBadge = (type: string, meta: any) => {
    switch (type) {
      case "rate":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Rated {meta?.rating || 5}★
          </span>
        );
      case "watchlist":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-brand-400 bg-brand-600/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            <Bookmark className="h-3 w-3" />
            Added to Watchlist
          </span>
        );
      case "like":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            <ThumbsUp className="h-3 w-3" />
            Liked Film
          </span>
        );
      case "dislike":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full border border-rose-400/20">
            <ThumbsDown className="h-3 w-3" />
            Disliked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-300 bg-white/5 px-2.5 py-1 rounded-full">
            <Eye className="h-3 w-3 text-zinc-400" />
            Viewed Details
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-cinema-border/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <History className="h-7 w-7 text-brand-500" />
            Watch & Interaction History
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Timeline of films you viewed, rated, and bookmarked
          </p>
        </div>
      </div>

      {historyItems && historyItems.length > 0 ? (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-cinema-border bg-cinema-card p-4 hover:border-brand-500/40 transition-colors gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-14 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  <Image
                    src={getTMDBImageUrl(item.movie?.poster_path, "w500")}
                    alt={item.movie?.title || "Movie"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/movie/${item.movie_id}`}
                    className="text-base font-bold text-white hover:text-brand-400 transition-colors truncate block"
                  >
                    {item.movie?.title || `Movie #${item.movie_id}`}
                  </Link>
                  <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>{formatReleaseYear(item.movie?.release_date)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div>{renderBadge(item.interaction_type, item.metadata)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-base font-semibold">No interaction history recorded yet.</p>
          <p className="text-xs mt-1">Interact with movies in the catalog to build your history log.</p>
        </div>
      )}
    </div>
  );
}
