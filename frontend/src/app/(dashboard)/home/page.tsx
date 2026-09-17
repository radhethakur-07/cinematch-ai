"use client";

import { useTrendingMovies, useTopRatedMovies, useWatchlist } from "@/hooks/use-movies";
import { useRecommendations } from "@/hooks/use-recommendations";
import { MovieHero } from "@/components/movies/movie-hero";
import { MovieRow } from "@/components/movies/movie-row";

function HeroSkeleton() {
  return (
    <div className="relative w-full min-h-[480px] sm:min-h-[560px] flex items-end overflow-hidden bg-cinema-void border-b border-cinema-border">
      <div className="absolute inset-0 skeleton opacity-40" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-24 space-y-3">
        <div className="skeleton h-4 w-28 rounded-full" />
        <div className="skeleton h-8 w-72 sm:h-12 sm:w-96 rounded-card" />
        <div className="skeleton h-4 w-56 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-7 w-28 rounded-btn" />
          <div className="skeleton h-7 w-28 rounded-btn" />
        </div>
      </div>
    </div>
  );
}

function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="my-6 sm:my-8 space-y-3 px-4 sm:px-6 lg:px-8">
      <div className="skeleton h-5 w-40 rounded" />
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-w-[140px] sm:min-w-[175px] flex-shrink-0 space-y-2">
            <div className="skeleton aspect-[2/3] w-full rounded-card" />
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: recData, isLoading: recLoading } = useRecommendations(20);
  const { data: trendingMovies, isLoading: trendLoading } = useTrendingMovies();
  const { data: topRatedMovies, isLoading: topLoading } = useTopRatedMovies();
  const { data: watchlistItems } = useWatchlist();

  const isLoading = recLoading || trendLoading || topLoading;
  const recommendations = recData?.recommendations || [];
  const heroMovie = recommendations[0] || trendingMovies?.[0];
  const watchlistMovies = watchlistItems?.map((w) => w.movie) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen pb-16">
        <HeroSkeleton />
        <RowSkeleton title="Recommended For You" />
        <RowSkeleton title="Trending Now" />
        <RowSkeleton title="Top Rated" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* 1. Hero Pick */}
      {heroMovie && <MovieHero movie={heroMovie} showAiBadge={true} />}

      {/* 2. Recommended For You */}
      {recommendations.length > 0 && (
        <MovieRow
          title="Recommended For You"
          subtitle="Ranked dynamically using your hybrid taste vectors"
          movies={recommendations.slice(0, 12)}
          isAiRecommended={true}
          viewAllHref="/recommendations"
        />
      )}

      {/* 3. Deep Cuts & Similar */}
      {recommendations.length > 12 && (
        <MovieRow
          title="More Tailored Picks"
          subtitle="Thematic alignment with your viewing profile"
          movies={recommendations.slice(12, 20)}
          isAiRecommended={true}
        />
      )}

      {/* 4. Watchlist */}
      {watchlistMovies.length > 0 && (
        <MovieRow
          title="Your Watchlist"
          subtitle="Films and series queued for upcoming movie nights"
          movies={watchlistMovies}
          viewAllHref="/watchlist"
        />
      )}

      {/* 5. Trending This Week */}
      {trendingMovies && trendingMovies.length > 0 && (
        <MovieRow
          title="Trending Now"
          subtitle="Popular selections gaining momentum"
          movies={trendingMovies}
          viewAllHref="/discover"
        />
      )}

      {/* 6. Top Rated Masterpieces */}
      {topRatedMovies && topRatedMovies.length > 0 && (
        <MovieRow
          title="Top Rated & Acclaimed"
          subtitle="Highest critical scores across the catalog"
          movies={topRatedMovies}
          viewAllHref="/discover"
        />
      )}
    </div>
  );
}
