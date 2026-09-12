"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Bookmark, Check, Sparkles, Film } from "lucide-react";
import { Movie } from "@/types";
import { formatReleaseYear, getTMDBImageUrl } from "@/lib/utils";
import { useToggleWatchlist } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";

interface MovieCardProps {
  movie: Movie;
  showMatchPercentage?: boolean;
}

export function MovieCard({ movie, showMatchPercentage = true }: MovieCardProps) {
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(movie.is_in_watchlist || false);
  const [imgError, setImgError] = useState(false);
  const toggleWatchlist = useToggleWatchlist();

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    const newState = !inWatchlist;
    setInWatchlist(newState);
    toggleWatchlist.mutate({ movieId: movie.id, isInWatchlist: inWatchlist });
  };

  const matchPct = movie.match_percentage || (movie.vote_average ? Math.round(movie.vote_average * 10) : 85);
  const imageUrl = getTMDBImageUrl(movie.poster_path, "w500");

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-cinema-card via-cinema-surface to-cinema-bg border border-cinema-border hover:border-brand-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/40 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cinema-card via-brand-950/40 to-black flex flex-col items-center justify-center p-3 text-center">
            <Film className="h-8 w-8 text-brand-500/80 mb-1.5 animate-pulse" />
            <span className="text-xs font-bold text-zinc-200 line-clamp-2">{movie.title}</span>
            <span className="text-[10px] text-zinc-400 mt-1">{formatReleaseYear(movie.release_date)}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {showMatchPercentage && (
            <span className="flex items-center gap-1 rounded-full bg-black/85 backdrop-blur-md px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black text-emerald-300 border border-emerald-500/50 shadow-md">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              {matchPct}% Match
            </span>
          )}

          {isAuthenticated && (
            <button
              onClick={handleWatchlistClick}
              className={`pointer-events-auto p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
                inWatchlist
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/60 scale-105"
                  : "bg-black/70 text-zinc-300 hover:text-white hover:bg-brand-600 hover:scale-105 border border-white/10"
              }`}
              title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            >
              {inWatchlist ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Deep Saturated Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cinema-card via-cinema-card/70 to-transparent pointer-events-none" />
      </div>

      {/* Card Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5 bg-cinema-card">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-brand-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mt-1 font-medium">
            <span>{formatReleaseYear(movie.release_date)}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {movie.vote_average?.toFixed(1) || "7.5"}
            </span>
          </div>
        </div>

        {/* Genres tag */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex items-center gap-1 overflow-hidden pt-0.5">
            <span className="text-[10px] font-semibold text-zinc-300 truncate bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
              {movie.genres.slice(0, 2).map((g) => g.name).join(" / ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
