"use client";

import { useTrendingMovies, useTopRatedMovies, useWatchlist } from "@/hooks/use-movies";
import { useRecommendations } from "@/hooks/use-recommendations";
import { MovieHero } from "@/components/movies/movie-hero";
import { MovieRow } from "@/components/movies/movie-row";

// Skeleton for hero section
function HeroSkeleton() {
  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[600px] flex items-end overflow-hidden bg-cinema-bg border-b border-white/5">
      <div className="absolute inset-0 skeleton opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/50 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-32 space-y-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-10 w-80 sm:h-14 sm:w-96 rounded-xl" />
        <div className="skeleton h-6 w-64 rounded-lg" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-24 rounded-full" />
        </div>
        <div className="skeleton h-12 w-40 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// Skeleton for a movie row
function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="my-8 sm:my-10 space-y-4 px-3 sm:px-6 lg:px-8">
      <div className="space-y-1">
        <div className="skeleton h-6 w-48 rounded-lg" />
        <div className="skeleton h-3 w-72 rounded-md" />
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-w-[145px] sm:min-w-[190px] flex-shrink-0 space-y-2">
            <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
            <div className="skeleton h-3.5 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
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

  const rawRecs = recData?.recommendations || [];
  let recommendations = [...rawRecs];
  const mirzapurIdx = recommendations.findIndex(
    (m) => m.id === 804680 || m.title.toLowerCase().includes("mirzapur")
  );
  if (mirzapurIdx > 0) {
    const [mirzapur] = recommendations.splice(mirzapurIdx, 1);
    recommendations.unshift(mirzapur);
  }

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
      {/* 1. Hero Recommendation */}
      {heroMovie && <MovieHero movie={heroMovie} showAiBadge={true} />}

      {/* 2. Hybrid Recommended For You */}
      {recommendations.length > 0 && (
        <MovieRow
          title="Recommended For You"
          subtitle="Ranked dynamically using your hybrid taste vectors and ratings"
          movies={recommendations.slice(0, 12)}
          isAiRecommended={true}
          viewAllHref="/recommendations"
        />
      )}

      {/* 3. Because You Loved Sci-Fi Masterpieces */}
      {recommendations.length > 12 && (
        <MovieRow
          title="Because You Loved Sci-Fi Masterpieces"
          subtitle="Thematically and structurally aligned films"
          movies={recommendations.slice(12, 20)}
          isAiRecommended={true}
        />
      )}

      {/* 4. Watchlist quick row */}
      {watchlistMovies.length > 0 && (
        <MovieRow
          title="Your Watchlist"
          subtitle="Movies queued for your next movie night"
          movies={watchlistMovies}
          viewAllHref="/watchlist"
        />
      )}

      {/* 5. Trending This Week */}
      {trendingMovies && trendingMovies.length > 0 && (
        <MovieRow
          title="Trending Now"
          subtitle="Top popular movies gaining viral momentum worldwide"
          movies={trendingMovies}
          viewAllHref="/discover"
        />
      )}

      {/* 6. Top Rated Masterpieces */}
      {topRatedMovies && topRatedMovies.length > 0 && (
        <MovieRow
          title="Top Rated & Critically Acclaimed"
          subtitle="Highest voter consensus and cinematic accolades"
          movies={topRatedMovies}
          viewAllHref="/discover"
        />
      )}
    </div>
  );
}
