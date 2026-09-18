"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, Bookmark, Check, Film } from "lucide-react";
import { Movie } from "@/types";
import { formatReleaseYear, getMoviePosterUrl } from "@/lib/utils";
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
  const imageUrl = getMoviePosterUrl(movie);
  const isSeries = movie.media_type === "Series" || !!movie.number_of_seasons;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex flex-col h-full rounded-card overflow-hidden bg-cinema-surface border border-cinema-border hover:border-cinema-secondary/35 transition-all duration-200 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-elevated">
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] group-hover:brightness-95"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-cinema-elevated flex flex-col items-center justify-center p-3 text-center">
            <Film className="h-6 w-6 text-cinema-muted mb-1" />
            <span className="text-xs font-semibold text-cinema-text line-clamp-2">{movie.title}</span>
            <span className="text-[11px] text-cinema-muted mt-0.5">{formatReleaseYear(movie.release_date)}</span>
          </div>
        )}

        {/* Top Badges & Watchlist Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {showMatchPercentage && (
              <span className="flex items-center gap-1 rounded-full bg-cinema-void/85 border border-cinema-border px-2 py-0.5 text-[11px] font-medium text-cinema-text shadow-subtle">
                <span className="text-crimson font-semibold">{matchPct}%</span> Match
              </span>
            )}
            {isSeries && (
              <span className="rounded-full bg-cinema-void/85 border border-purple-800/50 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                Series
              </span>
            )}
          </div>

          {isAuthenticated && (
            <button
              onClick={handleWatchlistClick}
              className={`pointer-events-auto p-1.5 rounded-control transition-all ${
                inWatchlist
                  ? "bg-crimson text-white shadow-subtle"
                  : "bg-cinema-void/80 text-cinema-secondary hover:text-cinema-text hover:bg-cinema-elevated border border-cinema-border"
              }`}
              title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            >
              {inWatchlist ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cinema-surface to-transparent pointer-events-none" />
      </div>

      {/* Card Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-cinema-text line-clamp-1 group-hover:text-crimson transition-colors duration-150">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-cinema-muted mt-1 font-normal">
            <span>{formatReleaseYear(movie.release_date)}</span>
            <span className="text-cinema-border-subtle">·</span>
            <span className="flex items-center gap-1 text-gold font-medium">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
            </span>
            {movie.number_of_seasons && (
              <>
                <span className="text-cinema-border-subtle">·</span>
                <span>{movie.number_of_seasons} {movie.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
              </>
            )}
          </div>
        </div>

        {/* Genres tag */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex items-center gap-1 overflow-hidden pt-0.5">
            <span className="text-[11px] text-cinema-muted truncate">
              {movie.genres.slice(0, 2).map((g) => g.name).join(" · ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
