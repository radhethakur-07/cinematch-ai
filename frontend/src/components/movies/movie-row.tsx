"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";
import Link from "next/link";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isAiRecommended?: boolean;
  viewAllHref?: string;
}

export function MovieRow({ title, subtitle, movies, isAiRecommended = false, viewAllHref }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group/row my-6 sm:my-8">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-cinema-text">
              {title}
            </h2>
            {isAiRecommended && (
              <span className="rounded-full bg-crimson-soft border border-crimson/25 px-2 py-0.5 text-[10px] font-medium text-crimson">
                AI Ranked
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-cinema-muted font-normal">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-xs font-medium text-cinema-secondary hover:text-cinema-text transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded-control bg-cinema-surface border border-cinema-border text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded-control bg-cinema-surface border border-cinema-border text-cinema-secondary hover:text-cinema-text hover:bg-cinema-hover transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-3 w-4 sm:w-8 bg-gradient-to-r from-cinema-void to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-3 w-4 sm:w-8 bg-gradient-to-l from-cinema-void to-transparent z-10 pointer-events-none" />

        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 touch-scroll pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[140px] sm:min-w-[175px] md:min-w-[195px] max-w-[195px] flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <MovieCard movie={movie} showMatchPercentage={isAiRecommended} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
