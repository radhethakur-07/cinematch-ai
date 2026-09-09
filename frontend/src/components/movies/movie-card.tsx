"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Bookmark, Check, Sparkles, Eye } from "lucide-react";
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

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-cinema-card border border-cinema-border/60 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/10 hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <Image
          src={getTMDBImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          {showMatchPercentage && (
            <span className="flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 shadow-md">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              {matchPct}% Match
            </span>
          )}

          {isAuthenticated && (
            <button
              onClick={handleWatchlistClick}
              className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all ${
                inWatchlist
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/50"
                  : "bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80"
              }`}
              title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            >
              {inWatchlist ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Bottom subtle gradient on image */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cinema-card via-cinema-card/50 to-transparent" />
      </div>

      {/* Card Info */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="font-semibold text-sm text-zinc-100 line-clamp-1 group-hover:text-brand-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <span>{formatReleaseYear(movie.release_date)}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-amber-400 font-medium">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {movie.vote_average?.toFixed(1) || "7.5"}
            </span>
          </div>
        </div>

        {/* Genres tag */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex items-center gap-1 overflow-hidden pt-1">
            <span className="text-[10px] text-zinc-400 truncate bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {movie.genres.slice(0, 2).map((g) => g.name).join(", ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
