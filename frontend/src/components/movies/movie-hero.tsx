"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Bookmark, Check, Star, Sparkles, X, Info } from "lucide-react";
import { Movie } from "@/types";
import { getTMDBImageUrl, formatReleaseYear, formatRuntime } from "@/lib/utils";
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
  const toggleWatchlist = useToggleWatchlist();

  const handleWatchlist = () => {
    if (!isAuthenticated) return;
    const nextState = !inWatchlist;
    setInWatchlist(nextState);
    toggleWatchlist.mutate({ movieId: movie.id, isInWatchlist: inWatchlist });
  };

  const matchPct = movie.match_percentage || 95;

  return (
    <>
      <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex items-end overflow-hidden border-b border-cinema-border/40">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getTMDBImageUrl(movie.backdrop_path || movie.poster_path, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top opacity-60 filter brightness-90"
          />
          {/* Cinema Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/60 to-transparent w-full md:w-3/4" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-32">
          <div className="max-w-2xl space-y-4">
            {/* AI Top Recommendation Pill */}
            {showAiBadge && (
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/30 border border-brand-500/40 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-brand-300 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
                <span>Featured AI Recommendation • {matchPct}% Match</span>
              </div>
            )}

            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base sm:text-lg text-zinc-300 italic mt-1 font-light">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1) || "8.4"}
              </span>
              <span>{formatReleaseYear(movie.release_date)}</span>
              <span>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-zinc-200">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow">
              {movie.overview}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {movie.trailer_url ? (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-white/10 transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                  Watch Trailer
                </button>
              ) : null}

              {isAuthenticated && (
                <button
                  onClick={handleWatchlist}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold border backdrop-blur-md transition-all ${
                    inWatchlist
                      ? "bg-brand-600/30 border-brand-500 text-brand-300"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {inWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>
              )}

              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Info className="h-4 w-4" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-zinc-400 hover:text-white hover:bg-black/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={movie.trailer_url.replace("watch?v=", "embed/") + "?autoplay=1"}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
