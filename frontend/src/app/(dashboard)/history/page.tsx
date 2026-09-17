"use client";

import Link from "next/link";
import Image from "next/image";
import { History, Star, Bookmark, ThumbsUp, ThumbsDown, Eye, Calendar, Loader2 } from "lucide-react";
import { useWatchHistory } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";
import { getTMDBImageUrl, formatReleaseYear } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { data: historyItems, isLoading } = useWatchHistory();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <EmptyState
          icon={History}
          title="Sign in to view history"
          description="Track all your interactions, ratings, and recommendations clicks."
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
        <p className="text-sm text-cinema-muted">Loading interaction timeline...</p>
      </div>
    );
  }

  const renderBadge = (type: string, meta: any) => {
    switch (type) {
      case "rate":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20">
            <Star className="h-3 w-3 fill-gold text-gold" />
            Rated {meta?.rating || 5}★
          </span>
        );
      case "watchlist":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-crimson bg-crimson/10 px-2.5 py-1 rounded-md border border-crimson/20">
            <Bookmark className="h-3 w-3" />
            Watchlisted
          </span>
        );
      case "like":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <ThumbsUp className="h-3 w-3" />
            Liked
          </span>
        );
      case "dislike":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-crimson bg-crimson/10 px-2.5 py-1 rounded-md border border-crimson/20">
            <ThumbsDown className="h-3 w-3" />
            Disliked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-cinema-muted bg-cinema-elevated px-2.5 py-1 rounded-md border border-cinema-border-subtle">
            <Eye className="h-3 w-3 text-cinema-muted" />
            Viewed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-cinema-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
          Viewing & Interaction History
        </h1>
        <p className="text-sm text-cinema-muted">
          Chronological record of titles you explored, rated, or added to your watchlist.
        </p>
      </div>

      {historyItems && historyItems.length > 0 ? (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-cinema-border bg-cinema-surface p-3.5 hover:border-cinema-hover transition-colors gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 aspect-[2/3] rounded-md overflow-hidden bg-cinema-elevated flex-shrink-0 border border-cinema-border-subtle">
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
                    className="text-sm font-medium text-cinema-text hover:text-crimson transition-colors truncate block"
                  >
                    {item.movie?.title || `Title #${item.movie_id}`}
                  </Link>
                  <p className="text-xs text-cinema-muted flex items-center gap-2 mt-0.5">
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
        <EmptyState
          icon={History}
          title="No history recorded yet"
          description="Explore titles in the catalog and rate movies to build your personalized history timeline."
          actionLabel="Browse Movies"
          onAction={() => window.location.href = "/discover"}
        />
      )}
    </div>
  );
}
