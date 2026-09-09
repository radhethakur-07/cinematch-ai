"use client";

import { useTrendingMovies, useTopRatedMovies, useWatchlist } from "@/hooks/use-movies";
import { useRecommendations } from "@/hooks/use-recommendations";
import { MovieHero } from "@/components/movies/movie-hero";
import { MovieRow } from "@/components/movies/movie-row";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: recData, isLoading: recLoading } = useRecommendations(20);
  const { data: trendingMovies, isLoading: trendLoading } = useTrendingMovies();
  const { data: topRatedMovies, isLoading: topLoading } = useTopRatedMovies();
  const { data: watchlistItems } = useWatchlist();

  if (recLoading || trendLoading || topLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
        <p className="text-sm font-medium text-zinc-400">Curating your personalized cinematic universe...</p>
      </div>
    );
  }

  const recommendations = recData?.recommendations || [];
  const heroMovie = recommendations[0] || trendingMovies?.[0];
  const watchlistMovies = watchlistItems?.map((w) => w.movie) || [];

  return (
    <div className="flex flex-col min-h-screen pb-16 space-y-4">
      {/* 1. Hero Recommendation */}
      {heroMovie && <MovieHero movie={heroMovie} showAiBadge={true} />}

      {/* 2. Hybrid Recommended For You */}
      {recommendations.length > 1 && (
        <MovieRow
          title="Recommended For You"
          subtitle="Ranked dynamically using your hybrid taste vectors and ratings"
          movies={recommendations.slice(1, 12)}
          isAiRecommended={true}
        />
      )}

      {/* 3. Because You Liked Interstellar / Seed Row */}
      {recommendations.length > 12 && (
        <MovieRow
          title="Because You Loved Sci-Fi Masterpieces"
          subtitle="Thematically and structurally aligned films"
          movies={recommendations.slice(12, 20)}
          isAiRecommended={true}
        />
      )}

      {/* 4. Watchlist quick row if available */}
      {watchlistMovies.length > 0 && (
        <MovieRow
          title="Your Watchlist"
          subtitle="Movies queued for your next movie night"
          movies={watchlistMovies}
        />
      )}

      {/* 5. Trending This Week */}
      {trendingMovies && trendingMovies.length > 0 && (
        <MovieRow
          title="Trending Now"
          subtitle="Top popular movies gaining viral momentum worldwide"
          movies={trendingMovies}
        />
      )}

      {/* 6. Top Rated Masterpieces */}
      {topRatedMovies && topRatedMovies.length > 0 && (
        <MovieRow
          title="Top Rated & Critically Acclaimed"
          subtitle="Highest voter consensus and cinematic accolades"
          movies={topRatedMovies}
        />
      )}
    </div>
  );
}
