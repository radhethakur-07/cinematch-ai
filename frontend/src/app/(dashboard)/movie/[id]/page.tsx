"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Star,
  Play,
  Bookmark,
  Check,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  Sparkles,
  X,
  Tv,
  Users,
  Clapperboard,
} from "lucide-react";
import { useMovieDetails, useSimilarMovies, useToggleWatchlist } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { getTMDBImageUrl, formatReleaseYear, formatRuntime } from "@/lib/utils";
import { RatingDialog } from "@/components/movies/rating-dialog";
import { ExplainabilityBadge } from "@/components/movies/explainability-badge";
import { MovieCard } from "@/components/movies/movie-card";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const { isAuthenticated } = useAuth();

  const { data: movie, isLoading, refetch } = useMovieDetails(movieId);
  const { data: similarMovies } = useSimilarMovies(movieId);
  const toggleWatchlist = useToggleWatchlist();

  const [ratingOpen, setRatingOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [likeStatus, setLikeStatus] = useState<boolean | null | undefined>(movie?.is_liked);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="relative w-full min-h-[500px] overflow-hidden">
          <div className="absolute inset-0 skeleton opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 flex flex-col md:flex-row gap-8 items-end">
            <div className="skeleton w-44 sm:w-52 aspect-[2/3] rounded-2xl flex-shrink-0" />
            <div className="space-y-3 flex-1 pb-4">
              <div className="flex gap-2"><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /></div>
              <div className="skeleton h-10 w-72 rounded-xl" />
              <div className="skeleton h-5 w-48 rounded-lg" />
              <div className="flex gap-2 mt-2"><div className="skeleton h-9 w-28 rounded-xl" /><div className="skeleton h-9 w-28 rounded-xl" /></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-3">
          <div className="skeleton h-5 w-full max-w-2xl rounded" />
          <div className="skeleton h-4 w-5/6 max-w-xl rounded" />
          <div className="skeleton h-4 w-4/5 max-w-lg rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cinema-card border border-cinema-border flex items-center justify-center">
          <Clapperboard className="h-8 w-8 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-sm text-zinc-400">The requested film could not be located in the catalog.</p>
      </div>
    );
  }

  const inWatchlist = movie.is_in_watchlist || false;
  const isSeries = movie.media_type === "Series" || !!movie.number_of_seasons;

  const handleWatchlist = () => {
    if (!isAuthenticated) return;
    toggleWatchlist.mutate({ movieId: movie.id, isInWatchlist: inWatchlist });
  };

  const handleLike = async (isLike: boolean) => {
    if (!isAuthenticated) return;
    try {
      setLikeStatus(isLike);
      await api.post("/history", {
        movie_id: movie.id,
        interaction_type: isLike ? "like" : "dislike",
      });
      refetch();
    } catch {}
  };

  return (
    <div className="min-h-screen pb-20">

      {/* 1. Cinematic Backdrop Hero */}
      <div className="relative w-full min-h-[460px] sm:min-h-[560px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getTMDBImageUrl(movie.backdrop_path || movie.poster_path, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/75 to-cinema-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/40 via-transparent to-transparent" />
        </div>
        {/* Ambient orb */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-brand-700/15 to-transparent blur-[120px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end animate-fade-in-up">
          {/* Poster */}
          <div className="relative w-40 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex-shrink-0">
            <Image
              src={getTMDBImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1 pb-2">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isSeries && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-violet/30 border border-purple-400/50 px-3 py-0.5 text-xs font-black text-purple-300">
                  <Tv className="h-3 w-3" />
                  Web Series
                </span>
              )}
              {movie.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-white/8 border border-white/10 px-3 py-0.5 text-xs font-semibold text-zinc-300">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-black hero-title-clip tracking-tight leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm sm:text-base text-zinc-400 italic font-light">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1)}/10
                <span className="text-zinc-600 font-normal">({movie.vote_count?.toLocaleString()})</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/8">
                <Calendar className="h-3.5 w-3.5" />
                {formatReleaseYear(movie.release_date)}
              </span>
              {isSeries ? (
                <span className="flex items-center gap-1.5 text-brand-400 font-bold bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20">
                  {movie.number_of_seasons} {movie.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/8">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.creator && (
                <span className="text-zinc-400 text-xs">
                  Created by <strong className="text-zinc-200">{movie.creator}</strong>
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {movie.trailer_url && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-100 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                  Watch Trailer
                </button>
              )}
              {isAuthenticated && (
                <>
                  <button
                    onClick={handleWatchlist}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all cursor-pointer ${
                      inWatchlist
                        ? "bg-brand-600/30 border-brand-500 text-brand-300 shadow-lg shadow-brand-600/20"
                        : "bg-cinema-card border-cinema-border text-zinc-200 hover:bg-cinema-hover hover:border-brand-600/40"
                    }`}
                  >
                    {inWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {inWatchlist ? "Watchlist" : "+ Watchlist"}
                  </button>
                  <button
                    onClick={() => setRatingOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {movie.user_rating ? `Rated ${movie.user_rating}★` : "Rate Film"}
                  </button>
                  <div className="flex items-center rounded-xl border border-cinema-border bg-cinema-card overflow-hidden">
                    <button
                      onClick={() => handleLike(true)}
                      className={`p-2.5 hover:bg-white/5 transition-colors cursor-pointer ${
                        likeStatus === true ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500"
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <div className="w-px h-5 bg-cinema-border" />
                    <button
                      onClick={() => handleLike(false)}
                      className={`p-2.5 hover:bg-white/5 transition-colors cursor-pointer ${
                        likeStatus === false ? "text-rose-400 bg-rose-500/10" : "text-zinc-500"
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Story + Director + Cast */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">Storyline</h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{movie.overview}</p>
            </div>

            {movie.directors && movie.directors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clapperboard className="h-4 w-4 text-brand-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Directed By</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.directors.map((d, idx) => (
                    <span key={idx} className="text-sm font-semibold text-zinc-200 bg-white/5 border border-cinema-border px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-400" />
                  <h3 className="text-lg font-bold text-white">Featured Cast</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.cast.slice(0, 9).map((actor, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-cinema-border bg-cinema-card p-3 flex flex-col justify-center hover:border-brand-500/30 hover:bg-cinema-hover transition-all animate-fade-in-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="text-sm font-semibold text-zinc-200 line-clamp-1">{actor.name}</span>
                      {actor.character && (
                        <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5 italic">{actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: AI Match + Keywords */}
          <div className="space-y-6 animate-fade-in-up delay-150">
            <ExplainabilityBadge
              matchPercentage={movie.match_percentage || (movie.vote_average ? Math.round(movie.vote_average * 10) : 88)}
              reasons={
                movie.reasons || [
                  `High acclaim with ${movie.vote_average}★ community score`,
                  `Matches popular preferences in ${movie.genres?.[0]?.name || "Cinema"}`,
                  movie.directors?.[0]?.name ? `Directed by acclaimed filmmaker ${movie.directors[0].name}` : "Thematic alignment with your taste profile",
                ]
              }
            />
            {movie.keywords && movie.keywords.length > 0 && (
              <div className="rounded-xl border border-cinema-border bg-cinema-card p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Thematic Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {movie.keywords.map((kw, idx) => (
                    <span key={idx} className="text-[11px] bg-black/40 border border-white/6 px-2.5 py-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:border-white/12 transition-colors cursor-default">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* More Like This */}
        {similarMovies && similarMovies.length > 0 && (
          <div className="space-y-5 pt-6 border-t border-cinema-border animate-fade-in-up">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">More Like This</h2>
                <p className="text-xs text-zinc-500">Content-based TF-IDF cosine similarity across thematic features</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.slice(0, 5).map((sim, i) => (
                <div key={sim.id} className="animate-scale-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <MovieCard movie={sim} showMatchPercentage={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-scale-in">
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

      <RatingDialog
        movieId={movie.id}
        movieTitle={movie.title}
        currentRating={movie.user_rating}
        open={ratingOpen}
        onOpenChange={setRatingOpen}
      />
    </div>
  );
}

