"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Bookmark, Check, Star, Sparkles, X, Info, Film, Tv, Clock, Calendar } from "lucide-react";
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
  const [imgError, setImgError] = useState(false);
  const toggleWatchlist = useToggleWatchlist();

  const handleWatchlist = () => {
    if (!isAuthenticated) return;
    const nextState = !inWatchlist;
    setInWatchlist(nextState);
    toggleWatchlist.mutate({ movieId: movie.id, isInWatchlist: inWatchlist });
  };

  const matchPct = movie.match_percentage || 96;
  const backdropUrl = getTMDBImageUrl(movie.backdrop_path || movie.poster_path, "original");
  const posterUrl = getTMDBImageUrl(movie.poster_path, "w500");
  const isSeries = movie.media_type === "Series" || !!movie.number_of_seasons;

  return (
    <>
      <div className="relative w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-end overflow-hidden border-b border-white/5 bg-cinema-bg">

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-700/20 via-brand-violet/15 to-transparent blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-cyan-700/10 via-brand-600/10 to-transparent blur-[120px] pointer-events-none" />

        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imgError ? (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              priority
              className="object-cover object-top opacity-50 scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cinema-bg via-brand-950/30 to-black flex items-center justify-center">
              <Film className="h-32 w-32 text-brand-600/20" />
            </div>
          )}

          {/* Multi-layer gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/80 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-b from-cinema-bg/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-32">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-10">

            {/* Floating Mini Poster (lg+) */}
            <div className="hidden lg:block relative w-40 xl:w-48 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 animate-fade-in-up">
              <div className="aspect-[2/3] relative">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="max-w-2xl space-y-4 animate-fade-in-up delay-75">

              {/* AI Badge + Media Type */}
              <div className="flex flex-wrap items-center gap-2">
                {showAiBadge && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600/40 via-purple-700/30 to-cyan-600/30 border border-brand-500/60 backdrop-blur-xl px-3.5 py-1 text-xs font-black text-white shadow-xl shadow-brand-950/60">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                    <span>AI Prime Pick &middot; <strong className="text-emerald-300">{matchPct}% Match</strong></span>
                  </div>
                )}
                {isSeries ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-violet/30 border border-purple-400/50 px-3 py-0.5 text-xs font-black text-purple-300">
                    <Tv className="h-3 w-3" />
                    Web Series
                  </span>
                ) : null}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight hero-title-clip drop-shadow-2xl leading-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-sm sm:text-base text-zinc-400 italic font-medium drop-shadow">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Metadata Chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold">
                <span className="flex items-center gap-1.5 text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {movie.vote_average?.toFixed(1) || "8.4"}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatReleaseYear(movie.release_date)}
                </span>
                {isSeries ? (
                  <span className="flex items-center gap-1.5 text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20 backdrop-blur-md">
                    {movie.number_of_seasons} {movie.number_of_seasons === 1 ? "Season" : "Seasons"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {movie.genres?.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="rounded-lg bg-white/8 px-2.5 py-1 text-xs text-zinc-300 border border-white/10 backdrop-blur-md"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <p className="text-sm sm:text-base text-zinc-300/90 line-clamp-3 leading-relaxed drop-shadow-sm max-w-xl">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {movie.trailer_url ? (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-zinc-100 shadow-2xl shadow-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                    Watch Trailer
                  </button>
                ) : null}

                {isAuthenticated && (
                  <button
                    onClick={handleWatchlist}
                    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold border backdrop-blur-xl transition-all cursor-pointer ${
                      inWatchlist
                        ? "bg-brand-600/40 border-brand-500 text-brand-200 shadow-lg shadow-brand-600/40"
                        : "bg-cinema-card/80 border-cinema-border text-white hover:bg-white/15 hover:border-white/20"
                    }`}
                  >
                    {inWatchlist ? <Check className="h-4 w-4 text-brand-300" /> : <Bookmark className="h-4 w-4" />}
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </button>
                )}

                <Link
                  href={`/movie/${movie.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cinema-card/80 hover:bg-white/15 border border-cinema-border hover:border-white/20 px-5 py-3 text-sm font-bold text-zinc-200 hover:text-white transition-all hover:scale-105 backdrop-blur-xl"
                >
                  <Info className="h-4 w-4 text-cyan-400" />
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 animate-scale-in">
          <div className="relative w-full max-w-5xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-zinc-300">{movie.title} &mdash; Official Trailer</span>
              <button
                onClick={() => setTrailerOpen(false)}
                className="rounded-full bg-white/10 border border-white/20 p-2.5 text-zinc-300 hover:text-white hover:bg-brand-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden border border-brand-500/30 bg-black shadow-2xl shadow-brand-950/90">
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
