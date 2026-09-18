"use client";

import { useTrendingMovies, useTopRatedMovies, useWatchlist } from "@/hooks/use-movies";
import { useRecommendations } from "@/hooks/use-recommendations";
import { MovieHero } from "@/components/movies/movie-hero";
import { MovieRow } from "@/components/movies/movie-row";
import { Movie } from "@/types";

const PRIORITY_TITLES = [
  "mirzapur: the movie",
  "dhurandhar",
  "pritam and pedro",
  "kota factory",
  "special ops",
  "panchayat",
  "mirzapur",
];

const DEPRIORITIZED_TITLES = [
  "the glass breakfront",
  "freddy",
];

function getCanonicalKey(m: Movie): string {
  const t = (m.title || "").toLowerCase().trim();
  if (t.startsWith("special ops")) return "special_ops";
  if (t.includes("pritam and pedro") || t.includes("pritam & pedro")) return "pritam_and_pedro";
  if (t.includes("mirzapur: the movie")) return "mirzapur_movie";
  if (t === "mirzapur" || (t.includes("mirzapur") && !t.includes("movie"))) return "mirzapur_series";
  if (t.includes("panchayat")) return "panchayat";
  if (t.includes("kota factory")) return "kota_factory";
  if (t.includes("dhurandhar")) return "dhurandhar";
  if (t.includes("sacred games")) return "sacred_games";
  if (t.includes("the family man") || t.includes("family man")) return "family_man";
  if (t.includes("paatal lok")) return "paatal_lok";
  if (t.includes("scam 1992")) return "scam_1992";

  const clean = t.replace(/[^a-z0-9]/g, "");
  return clean || String(m.id);
}

function deduplicateMoviePool(movies: (Movie | undefined | null)[]): Movie[] {
  const seen = new Set<string>();
  const list: Movie[] = [];
  for (const m of movies) {
    if (!m || !m.title) continue;
    const key = getCanonicalKey(m);
    if (!seen.has(key)) {
      seen.add(key);
      list.push(m);
    }
  }
  return list;
}

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
  const { data: recData, isLoading: recLoading } = useRecommendations(30);
  const { data: trendingMovies, isLoading: trendLoading } = useTrendingMovies();
  const { data: topRatedMovies, isLoading: topLoading } = useTopRatedMovies();
  const { data: watchlistItems } = useWatchlist();

  const isLoading = recLoading || trendLoading || topLoading;
  const rawRecommendations = recData?.recommendations || [];
  const watchlistMovies = watchlistItems?.map((w) => w.movie) || [];

  // Intelligently deduplicate across all data feeds
  const uniquePool = deduplicateMoviePool([
    ...rawRecommendations,
    ...(trendingMovies || []),
    ...(topRatedMovies || []),
  ]);

  const priorityItems: Movie[] = [];
  const regularItems: Movie[] = [];
  const deprioritizedItems: Movie[] = [];

  uniquePool.forEach((m) => {
    const titleLower = (m.title || "").toLowerCase();
    const isDeprioritized = DEPRIORITIZED_TITLES.some((d) => titleLower.includes(d));
    const isPriority = PRIORITY_TITLES.some((p) => titleLower.includes(p));

    if (isDeprioritized) {
      deprioritizedItems.push(m);
    } else if (isPriority) {
      priorityItems.push(m);
    } else {
      regularItems.push(m);
    }
  });

  // Sort priority items by designated order
  priorityItems.sort((a, b) => {
    const aIdx = PRIORITY_TITLES.findIndex((p) => (a.title || "").toLowerCase().includes(p));
    const bIdx = PRIORITY_TITLES.findIndex((p) => (b.title || "").toLowerCase().includes(p));
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  const recommendations = [...priorityItems, ...regularItems, ...deprioritizedItems];
  const heroMovie = priorityItems[0] || recommendations[0];

  const dedupedTrending = deduplicateMoviePool(trendingMovies || []);
  const dedupedTopRated = deduplicateMoviePool(topRatedMovies || []);
  const dedupedWatchlist = deduplicateMoviePool(watchlistMovies);

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
      {/* 1. Hero Spotlight */}
      {heroMovie && <MovieHero movie={heroMovie} showAiBadge={true} />}

      {/* 2. Recommended For You (Curated Marquee First) */}
      {recommendations.length > 0 && (
        <MovieRow
          title="Recommended For You"
          subtitle="Top rated Hindi blockbusters and premier web series matched to your taste"
          movies={recommendations.slice(0, 12)}
          isAiRecommended={true}
          viewAllHref="/recommendations"
        />
      )}

      {/* 3. Deep Cuts & Tailored Picks */}
      {recommendations.length > 12 && (
        <MovieRow
          title="More Tailored Picks"
          subtitle="Thematic alignment with your viewing profile"
          movies={recommendations.slice(12, 24)}
          isAiRecommended={true}
        />
      )}

      {/* 4. Watchlist */}
      {dedupedWatchlist.length > 0 && (
        <MovieRow
          title="Continue Watching & Saved"
          subtitle="Titles you saved to your library"
          movies={dedupedWatchlist}
          viewAllHref="/watchlist"
        />
      )}

      {/* 5. Trending */}
      {dedupedTrending.length > 0 && (
        <MovieRow
          title="Trending Now"
          subtitle="Popular selections gaining momentum across the platform"
          movies={dedupedTrending}
          viewAllHref="/discover"
        />
      )}

      {/* 6. Top Rated */}
      {dedupedTopRated.length > 0 && (
        <MovieRow
          title="Critically Acclaimed"
          subtitle="Highest voter consensus and cinematic milestones"
          movies={dedupedTopRated}
          viewAllHref="/discover"
        />
      )}
    </div>
  );
}
