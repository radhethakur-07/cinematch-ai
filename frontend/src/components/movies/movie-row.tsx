"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
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
      const scrollAmount = clientWidth * 0.8;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group/row my-8 sm:my-10 z-10">
      {/* Row Header */}
      <div className="flex items-end justify-between px-3 sm:px-6 lg:px-8 mb-4 sm:mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {isAiRecommended && (
              <div className="h-5 w-1 rounded-full bg-gradient-to-b from-brand-500 to-brand-violet flex-shrink-0" />
            )}
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow">
              {title}
            </h2>
            {isAiRecommended && (
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600/30 to-purple-600/30 border border-brand-500/50 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-brand-300 shadow-md">
                <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                Hybrid AI
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-zinc-500 font-medium pl-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-brand-400 transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-cinema-card/90 border border-cinema-border text-zinc-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-600/30 transition-all shadow-md cursor-pointer active:scale-90"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-cinema-card/90 border border-cinema-border text-zinc-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-600/30 transition-all shadow-md cursor-pointer active:scale-90"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel with Edge Fade */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-4 w-6 sm:w-10 bg-gradient-to-r from-cinema-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-6 sm:w-10 bg-gradient-to-l from-cinema-bg to-transparent z-10 pointer-events-none" />

        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-3 sm:px-6 lg:px-8 touch-scroll pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {movies.map((movie, idx) => (
            <div
              key={movie.id}
              className="min-w-[145px] sm:min-w-[190px] md:min-w-[215px] max-w-[215px] flex-shrink-0 animate-fade-in-up"
              style={{
                scrollSnapAlign: "start",
                animationDelay: `${Math.min(idx * 40, 320)}ms`,
              }}
            >
              <MovieCard movie={movie} showMatchPercentage={isAiRecommended} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
