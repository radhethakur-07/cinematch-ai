"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { MovieListResponse, Genre } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Compass, SlidersHorizontal, X } from "lucide-react";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <div className="skeleton aspect-[2/3] w-full rounded-xl" />
          <div className="skeleton h-4 w-3/4 rounded-md" />
          <div className="skeleton h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(undefined);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [page, setPage] = useState<number>(1);
  const genreContainerRef = useRef<HTMLDivElement>(null);

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => api.get<Genre[]>("/movies/genres"),
  });

  const { data: movieData, isLoading } = useQuery({
    queryKey: ["movies", "discover", selectedMediaType, selectedGenre, sortBy, page],
    queryFn: () =>
      api.get<MovieListResponse>("/movies", {
        media_type: selectedMediaType,
        genre_id: selectedGenre,
        sort_by: sortBy,
        page,
        page_size: 20,
      }),
  });

  const hasActiveFilters = selectedMediaType !== undefined || selectedGenre !== undefined || sortBy !== "popularity.desc";

  const clearFilters = () => {
    setSelectedMediaType(undefined);
    setSelectedGenre(undefined);
    setSortBy("popularity.desc");
    setPage(1);
  };

  const scrollGenres = (direction: "left" | "right") => {
    if (genreContainerRef.current) {
      const { scrollLeft, clientWidth } = genreContainerRef.current;
      const amount = clientWidth * 0.6;
      genreContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
          Discover Catalog
        </h1>
        <p className="text-sm text-cinema-muted">
          Browse verified Hindi cinema, iconic blockbusters, and premier web series.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Media Type Segmented Control */}
          <div className="inline-flex items-center p-1 rounded-lg bg-cinema-surface border border-cinema-border">
            {[
              { label: "All", value: undefined },
              { label: "Movies", value: "Movie" },
              { label: "Web Series", value: "Series" },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => { setSelectedMediaType(value); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedMediaType === value
                    ? "bg-cinema-elevated text-cinema-text shadow-sm border border-cinema-border"
                    : "text-cinema-muted hover:text-cinema-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="rounded-lg border border-cinema-border bg-cinema-surface px-3 py-1.5 text-xs font-medium text-cinema-text focus:border-crimson focus:outline-none cursor-pointer transition-colors"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest Releases</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-cinema-muted hover:text-crimson h-8"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Genre Pills with Scroll Buttons */}
        {genres && genres.length > 0 && (
          <div className="relative flex items-center gap-2">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollGenres("left")}
              className="hidden sm:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cinema-surface border border-cinema-border text-cinema-muted hover:text-cinema-text hover:bg-cinema-hover transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll genres left"
              title="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Scrollable Container */}
            <div className="relative flex-1 overflow-hidden">
              <div
                ref={genreContainerRef}
                onWheel={(e) => {
                  if (genreContainerRef.current && e.deltaY !== 0) {
                    genreContainerRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth touch-pan-x"
              >
                <button
                  onClick={() => { setSelectedGenre(undefined); setPage(1); }}
                  className={`genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedGenre === undefined
                      ? "border border-crimson/50 bg-crimson-soft text-crimson font-semibold"
                      : "border border-cinema-border bg-cinema-surface text-cinema-muted hover:text-cinema-text hover:border-cinema-hover"
                  }`}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => { setSelectedGenre(genre.id); setPage(1); }}
                    className={`genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedGenre === genre.id
                        ? "border border-crimson/50 bg-crimson-soft text-crimson font-semibold"
                        : "border border-cinema-border bg-cinema-surface text-cinema-muted hover:text-cinema-text hover:border-cinema-hover"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => scrollGenres("right")}
              className="hidden sm:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cinema-surface border border-cinema-border text-cinema-muted hover:text-cinema-text hover:bg-cinema-hover transition-colors shadow-sm cursor-pointer"
              aria-label="Scroll genres right"
              title="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      {!isLoading && movieData && (
        <div className="flex items-center gap-2 text-xs text-cinema-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Showing <span className="font-medium text-cinema-text">{movieData.items.length}</span> of <span className="font-medium text-cinema-text">{movieData.total}</span> titles</span>
        </div>
      )}

      {/* Grid Content */}
      {isLoading ? (
        <GridSkeleton />
      ) : movieData?.items && movieData.items.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movieData.items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showMatchPercentage={false} />
            ))}
          </div>

          {/* Minimal Pagination */}
          <div className="flex items-center justify-between border-t border-cinema-border pt-6">
            <span className="text-xs text-cinema-muted">
              Page <strong className="text-cinema-text font-medium">{movieData.page}</strong> of <strong className="text-cinema-text font-medium">{movieData.total_pages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(movieData.total_pages, p + 1))}
                disabled={page >= movieData.total_pages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No titles found"
          description="Try adjusting your genre or type filters to broaden your discovery."
          actionLabel="Reset Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}
