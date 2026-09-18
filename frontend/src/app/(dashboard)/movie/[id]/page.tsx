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
import { getMoviePosterUrl, getMovieBackdropUrl, formatReleaseYear, formatRuntime } from "@/lib/utils";
import { RatingDialog } from "@/components/movies/rating-dialog";
import { ExplainabilityBadge } from "@/components/movies/explainability-badge";
import { MovieCard } from "@/components/movies/movie-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        <div className="relative w-full min-h-[460px] overflow-hidden">
          <div className="absolute inset-0 skeleton opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-void via-cinema-void/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 flex flex-col md:flex-row gap-8 items-end">
            <div className="skeleton w-44 sm:w-52 aspect-[2/3] rounded-xl flex-shrink-0" />
            <div className="space-y-3 flex-1 pb-4">
              <div className="flex gap-2">
                <div className="skeleton h-5 w-20 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
              <div className="skeleton h-9 w-72 rounded-lg" />
              <div className="skeleton h-4 w-48 rounded-md" />
              <div className="flex gap-2 mt-3">
                <div className="skeleton h-9 w-28 rounded-lg" />
                <div className="skeleton h-9 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-3">
          <div className="skeleton h-4 w-full max-w-2xl rounded" />
          <div className="skeleton h-4 w-5/6 max-w-xl rounded" />
          <div className="skeleton h-4 w-4/5 max-w-lg rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 rounded-xl bg-cinema-surface border border-cinema-border flex items-center justify-center">
          <Clapperboard className="h-6 w-6 text-cinema-muted" />
        </div>
        <h2 className="text-xl font-semibold text-cinema-text">Movie Not Found</h2>
        <p className="text-sm text-cinema-muted">The requested title could not be found in the catalog.</p>
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
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getMovieBackdropUrl(movie)}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-void via-cinema-void/80 to-cinema-void/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-void/70 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end">
          {/* Poster */}
          <div className="relative w-36 sm:w-48 aspect-[2/3] rounded-xl overflow-hidden border border-cinema-border shadow-elevated flex-shrink-0 bg-cinema-elevated">
            <Image
              src={getMoviePosterUrl(movie)}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-3.5 flex-1 pb-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isSeries && (
                <Badge variant="series">
                  <Tv className="h-3 w-3 mr-1" />
                  Series
                </Badge>
              )}
              {movie.genres?.map((g) => (
                <Badge key={g.id} variant="surface">
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-cinema-text">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm text-cinema-muted italic font-normal">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-gold font-medium bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                {movie.vote_average?.toFixed(1)}
                <span className="text-cinema-muted font-normal">({movie.vote_count?.toLocaleString()})</span>
              </span>
              <span className="flex items-center gap-1 text-cinema-secondary bg-cinema-surface px-2.5 py-1 rounded-md border border-cinema-border">
                <Calendar className="h-3 w-3 text-cinema-muted" />
                {formatReleaseYear(movie.release_date)}
              </span>
              {isSeries ? (
                <span className="flex items-center gap-1 text-cinema-secondary bg-cinema-surface px-2.5 py-1 rounded-md border border-cinema-border">
                  {movie.number_of_seasons} {movie.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-cinema-secondary bg-cinema-surface px-2.5 py-1 rounded-md border border-cinema-border">
                  <Clock className="h-3 w-3 text-cinema-muted" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.creator && (
                <span className="text-cinema-muted">
                  Created by <strong className="text-cinema-text font-medium">{movie.creator}</strong>
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {movie.trailer_url && (
                <Button
                  onClick={() => setTrailerOpen(true)}
                  size="default"
                  className="gap-2"
                >
                  <Play className="h-4 w-4 fill-white text-white" />
                  Watch Trailer
                </Button>
              )}
              {isAuthenticated && (
                <>
                  <Button
                    variant={inWatchlist ? "secondary" : "outline"}
                    size="default"
                    onClick={handleWatchlist}
                    className={`gap-2 ${inWatchlist ? "border-crimson text-crimson" : ""}`}
                  >
                    {inWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {inWatchlist ? "Watchlisted" : "+ Watchlist"}
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setRatingOpen(true)}
                    className="gap-1.5 text-gold border-cinema-border hover:border-gold/40"
                  >
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    {movie.user_rating ? `Rated ${movie.user_rating}★` : "Rate"}
                  </Button>
                  <div className="flex items-center rounded-lg border border-cinema-border bg-cinema-surface overflow-hidden">
                    <button
                      onClick={() => handleLike(true)}
                      className={`p-2 hover:bg-cinema-hover transition-colors ${
                        likeStatus === true ? "text-emerald-400 bg-emerald-500/10" : "text-cinema-muted"
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-px h-4 bg-cinema-border" />
                    <button
                      onClick={() => handleLike(false)}
                      className={`p-2 hover:bg-cinema-hover transition-colors ${
                        likeStatus === false ? "text-crimson bg-crimson/10" : "text-cinema-muted"
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Body Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Story + Director + Cast */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2.5">
              <h2 className="text-lg font-semibold text-cinema-text">Storyline</h2>
              <p className="text-sm sm:text-base text-cinema-secondary leading-relaxed font-normal">
                {movie.overview}
              </p>
            </div>

            {movie.directors && movie.directors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Clapperboard className="h-3.5 w-3.5 text-crimson" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-cinema-muted">
                    Directed By
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.directors.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-cinema-text bg-cinema-surface border border-cinema-border px-3 py-1.5 rounded-lg"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-crimson" />
                  <h3 className="text-base font-semibold text-cinema-text">Featured Cast</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.cast.slice(0, 9).map((actor, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-cinema-border bg-cinema-surface p-3 flex flex-col justify-center"
                    >
                      <span className="text-xs font-medium text-cinema-text line-clamp-1">{actor.name}</span>
                      {actor.character && (
                        <span className="text-[11px] text-cinema-muted line-clamp-1 mt-0.5">{actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Match + Keywords */}
          <div className="space-y-6">
            <ExplainabilityBadge
              matchPercentage={movie.match_percentage || (movie.vote_average ? Math.round(movie.vote_average * 10) : 88)}
              reasons={
                movie.reasons || [
                  `High community rating with ${movie.vote_average}★ score`,
                  `Matches popular preferences in ${movie.genres?.[0]?.name || "Cinema"}`,
                  movie.directors?.[0]?.name ? `Directed by acclaimed filmmaker ${movie.directors[0].name}` : "Thematic alignment with your taste profile",
                ]
              }
            />

            {movie.keywords && movie.keywords.length > 0 && (
              <div className="rounded-xl border border-cinema-border bg-cinema-surface p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-cinema-muted">
                  Thematic Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {movie.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-cinema-elevated border border-cinema-border-subtle px-2.5 py-1 rounded-md text-cinema-muted"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies && similarMovies.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-cinema-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-crimson" />
              <div>
                <h2 className="text-lg font-semibold text-cinema-text">More Like This</h2>
                <p className="text-xs text-cinema-muted">Content-based cosine similarity across thematic features</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {similarMovies.slice(0, 5).map((sim) => (
                <MovieCard key={sim.id} movie={sim} showMatchPercentage={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-medium text-cinema-text">{movie.title} &mdash; Trailer</span>
              <button
                onClick={() => setTrailerOpen(false)}
                className="rounded-full bg-cinema-surface border border-cinema-border p-2 text-cinema-muted hover:text-cinema-text transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-cinema-border bg-black shadow-modal">
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

