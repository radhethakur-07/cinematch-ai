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
  Loader2,
  X,
  Share2,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading film details & similarity vectors...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-sm text-zinc-400">The requested film could not be located in the catalog.</p>
      </div>
    );
  }

  const inWatchlist = movie.is_in_watchlist || false;

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
      {/* 1. Backdrop Hero Section */}
      <div className="relative w-full min-h-[450px] sm:min-h-[550px] overflow-hidden border-b border-cinema-border/50">
        <div className="absolute inset-0 z-0">
          <Image
            src={getTMDBImageUrl(movie.backdrop_path || movie.poster_path, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top opacity-40 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/80 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Floating Poster */}
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden border border-cinema-border/80 shadow-2xl bg-cinema-card flex-shrink-0">
            <Image
              src={getTMDBImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details header */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-brand-600/20 border border-brand-500/30 px-3 py-0.5 text-xs font-semibold text-brand-300">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base text-zinc-300 italic font-light">
                "{movie.tagline}"
              </p>
            )}

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1)} / 10 ({movie.vote_count?.toLocaleString()} votes)
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {formatReleaseYear(movie.release_date)}
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="h-4 w-4" />
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {movie.trailer_url && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200 shadow-xl transition-transform hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-zinc-950 text-zinc-950" />
                  <span>Trailer</span>
                </button>
              )}

              {isAuthenticated && (
                <>
                  <button
                    onClick={handleWatchlist}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all ${
                      inWatchlist
                        ? "bg-brand-600/30 border-brand-500 text-brand-300"
                        : "bg-cinema-card border-cinema-border text-zinc-200 hover:bg-cinema-hover"
                    }`}
                  >
                    {inWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    <span>{inWatchlist ? "Watchlist" : "+ Watchlist"}</span>
                  </button>

                  <button
                    onClick={() => setRatingOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{movie.user_rating ? `Rated ${movie.user_rating}★` : "Rate"}</span>
                  </button>

                  <div className="flex items-center rounded-xl border border-cinema-border bg-cinema-card overflow-hidden">
                    <button
                      onClick={() => handleLike(true)}
                      className={`p-2.5 hover:bg-white/5 transition-colors ${
                        likeStatus === true ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400"
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <div className="w-px h-5 bg-cinema-border" />
                    <button
                      onClick={() => handleLike(false)}
                      className={`p-2.5 hover:bg-white/5 transition-colors ${
                        likeStatus === false ? "text-rose-400 bg-rose-500/10" : "text-zinc-400"
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

      {/* 2. Main Details & Explainability Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Overview, Cast, Director */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">Storyline</h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Cast & Crew */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Featured Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.cast.map((actor, idx) => (
                    <div key={idx} className="rounded-xl border border-cinema-border bg-cinema-card p-3 flex flex-col justify-center">
                      <span className="text-sm font-semibold text-zinc-200 line-clamp-1">{actor.name}</span>
                      {actor.character && (
                        <span className="text-xs text-zinc-400 line-clamp-1">{actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Directed By</h3>
                <div className="flex items-center gap-3">
                  {movie.directors.map((d, idx) => (
                    <span key={idx} className="text-sm font-semibold text-zinc-200 bg-white/5 border border-cinema-border px-3 py-1.5 rounded-lg">
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Explainability & Keywords */}
          <div className="space-y-6">
            <ExplainabilityBadge
              matchPercentage={movie.match_percentage || (movie.vote_average ? Math.round(movie.vote_average * 10) : 88)}
              reasons={
                movie.reasons || [
                  `High acclaim with ${movie.vote_average}★ community score`,
                  `Matches popular preferences in ${movie.genres?.[0]?.name || "Cinema"}`,
                  movie.directors?.[0]?.name ? `Directed by acclaimed filmmaker ${movie.directors[0].name}` : "Thematic alignment"
                ]
              }
            />

            {/* Thematic Keywords */}
            {movie.keywords && movie.keywords.length > 0 && (
              <div className="rounded-xl border border-cinema-border bg-cinema-card p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Thematic Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {movie.keywords.map((kw, idx) => (
                    <span key={idx} className="text-[11px] bg-black/40 border border-white/5 px-2.5 py-1 rounded-full text-zinc-300">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. 'More Like This' Similar Movies (TF-IDF Cosine Similarity) */}
        {similarMovies && similarMovies.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-cinema-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <h2 className="text-2xl font-bold text-white">More Like This</h2>
            </div>
            <p className="text-xs text-zinc-400">
              Computed using content-based TF-IDF cosine similarity across thematic features, cast, and direction.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.slice(0, 5).map((sim) => (
                <MovieCard key={sim.id} movie={sim} showMatchPercentage={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Trailer Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-zinc-400 hover:text-white"
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

      {/* Rating Dialog */}
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
