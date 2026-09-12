"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Bookmark, Check, Star, Sparkles, X, Info, Film } from "lucide-react";
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

  return (
    <>
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[660px] flex items-end overflow-hidden border-b border-cinema-border/80 bg-cinema-bg">
        {/* Deep Saturated Ambient Glow Lighting */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand-700/30 via-brand-violet/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

        {/* Backdrop Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imgError ? (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              priority
              className="object-cover object-top opacity-55 filter brightness-95"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cinema-bg via-brand-950/40 to-black flex items-center justify-center">
              <Film className="h-24 w-24 text-brand-600/30" />
            </div>
          )}

          {/* Saturated Deep Multilayer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/85 to-transparent w-full lg:w-3/4" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-28">
          <div className="max-w-2xl space-y-4">
            {/* AI Recommendation Pill */}
            {showAiBadge && (
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600/40 via-purple-700/30 to-cyan-600/30 border border-brand-500/60 backdrop-blur-xl px-3.5 py-1 text-xs font-black text-white shadow-xl shadow-brand-950/60">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "5s" }} />
                <span>AI Prime Pick • <strong className="text-emerald-300">{matchPct}% Match</strong></span>
              </div>
            )}

            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-2xl leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm sm:text-base text-zinc-300 italic mt-1.5 font-medium drop-shadow">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-200 font-bold">
              <span className="flex items-center gap-1 text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40 backdrop-blur-md shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1) || "8.4"}
              </span>
              <span className="text-zinc-400">{formatReleaseYear(movie.release_date)}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{formatRuntime(movie.runtime)}</span>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {movie.genres?.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs text-zinc-200 border border-white/10 backdrop-blur-md"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-sm">
              {movie.overview}
            </p>

            {/* Action Buttons - Mobile Scalable (full-width on tiny screens, flex on larger) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {movie.trailer_url ? (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                  Watch Trailer
                </button>
              ) : null}

              {isAuthenticated && (
                <button
                  onClick={handleWatchlist}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold border backdrop-blur-xl transition-all cursor-pointer ${
                    inWatchlist
                      ? "bg-brand-600/40 border-brand-500 text-brand-200 shadow-lg shadow-brand-600/40"
                      : "bg-cinema-card/80 border-cinema-border text-white hover:bg-white/15"
                  }`}
                >
                  {inWatchlist ? <Check className="h-4 w-4 text-brand-300" /> : <Bookmark className="h-4 w-4" />}
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>
              )}

              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-cinema-card/80 hover:bg-white/15 border border-cinema-border px-5 py-3 text-sm font-bold text-zinc-200 hover:text-white transition-all hover:scale-105"
              >
                <Info className="h-4 w-4 text-cyan-400" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6">
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-brand-500/40 bg-black shadow-2xl shadow-brand-950/90">
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/80 border border-white/20 p-2.5 text-zinc-300 hover:text-white hover:bg-brand-600 transition-all cursor-pointer"
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
