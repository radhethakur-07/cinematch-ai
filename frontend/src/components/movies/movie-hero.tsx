"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Bookmark, Check, Star, X, Info, Film, Calendar, Clock } from "lucide-react";
import { Movie } from "@/types";
import { getMoviePosterUrl, getMovieBackdropUrl, formatReleaseYear, formatRuntime } from "@/lib/utils";
import { useToggleWatchlist } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";

interface MovieHeroProps {
  movie: Movie;
  showAiBadge?: boolean;
}

export function MovieHero({ movie, showAiBadge = true }: MovieHeroProps) {
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(movie.is_in_watchlist || false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const toggleWatchlist = useToggleWatchlist();

  const handleWatchlist = () => {
    if (!isAuthenticated) return;
    const nextState = !inWatchlist;
    setInWatchlist(nextState);
    toggleWatchlist.mutate({ movieId: movie.id, isInWatchlist: inWatchlist });
  };

  const matchPct = movie.match_percentage || 94;
  const backdropUrl = getMovieBackdropUrl(movie);
  const posterUrl = getMoviePosterUrl(movie);
  const isSeries = movie.media_type === "Series" || !!movie.number_of_seasons;

  return (
    <>
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] flex items-end overflow-hidden border-b border-cinema-border bg-cinema-void">

        {/* Backdrop Image & Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imgError ? (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              priority
              className="object-cover object-center opacity-40 scale-100"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-cinema-void flex items-center justify-center">
              <Film className="h-24 w-24 text-cinema-border" />
            </div>
          )}

          {/* Clean Editorial Dark Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-void via-cinema-void/75 to-cinema-void/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-void/90 via-cinema-void/50 to-transparent lg:w-3/4" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-8">

            {/* Poster Thumbnail (Desktop) */}
            <div className="hidden lg:block relative w-44 flex-shrink-0 rounded-xl overflow-hidden border border-cinema-border/80 shadow-2xl bg-cinema-elevated">
              <div className="aspect-[2/3] relative w-full h-full">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  priority
                  sizes="176px"
                  className="object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Content Container */}
            <div className="max-w-2xl space-y-3.5">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {showAiBadge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-soft border border-crimson/30 px-3 py-0.5 text-xs font-medium text-crimson">
                    Featured Pick · <strong className="text-cinema-text font-semibold">{matchPct}% Match</strong>
                  </span>
                )}
                {isSeries && (
                  <span className="inline-flex items-center rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 dark:text-purple-300">
                    Series
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-cinema-text leading-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xs sm:text-sm text-cinema-secondary italic font-normal">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-cinema-secondary">
                <span className="flex items-center gap-1 text-gold font-medium bg-gold-soft border border-gold/20 px-2 py-0.5 rounded-control">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
                </span>
                <span className="flex items-center gap-1 text-cinema-muted px-2 py-0.5 rounded-control bg-cinema-surface border border-cinema-border">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatReleaseYear(movie.release_date)}
                </span>
                {isSeries ? (
                  <span className="text-cinema-muted px-2 py-0.5 rounded-control bg-cinema-surface border border-cinema-border">
                    {movie.number_of_seasons} {movie.number_of_seasons === 1 ? "Season" : "Seasons"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-cinema-muted px-2 py-0.5 rounded-control bg-cinema-surface border border-cinema-border">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                {movie.genres?.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-control bg-cinema-surface px-2 py-0.5 text-xs text-cinema-secondary border border-cinema-border"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-xs sm:text-sm text-cinema-secondary line-clamp-3 leading-relaxed max-w-xl">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                {movie.trailer_url ? (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-btn bg-crimson hover:bg-crimson-hover px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-subtle transition-colors cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-white text-white" />
                    Watch Trailer
                  </button>
                ) : null}

                {isAuthenticated && (
                  <button
                    onClick={handleWatchlist}
                    className={`inline-flex items-center justify-center gap-2 rounded-btn px-4 py-2.5 text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                      inWatchlist
                        ? "bg-crimson-soft border-crimson/40 text-crimson"
                        : "bg-cinema-surface hover:bg-cinema-hover border-cinema-border text-cinema-text"
                    }`}
                  >
                    {inWatchlist ? <Check className="h-4 w-4 text-crimson" /> : <Bookmark className="h-4 w-4" />}
                    {inWatchlist ? "Watchlist" : "+ Watchlist"}
                  </button>
                )}

                <Link
                  href={`/movie/${movie.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-btn bg-cinema-surface hover:bg-cinema-hover border border-cinema-border px-4 py-2.5 text-xs sm:text-sm font-medium text-cinema-secondary hover:text-cinema-text transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-void/90 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-cinema-surface border border-cinema-border rounded-panel overflow-hidden shadow-modal">
            <div className="flex items-center justify-between px-4 py-3 border-b border-cinema-border">
              <span className="text-xs sm:text-sm font-semibold text-cinema-text truncate">{movie.title} &mdash; Trailer</span>
              <button
                onClick={() => setTrailerOpen(false)}
                className="p-1.5 rounded-control text-cinema-muted hover:text-cinema-text hover:bg-cinema-elevated transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={movie.trailer_url.replace("watch?v=", "embed/") + "?autoplay=1&rel=0"}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
