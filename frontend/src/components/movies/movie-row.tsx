"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movies/movie-card";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isAiRecommended?: boolean;
}

export function MovieRow({ title, subtitle, movies, isAiRecommended = false }: MovieRowProps) {
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
    <section className="relative group/row my-8 sm:my-10 z-10">
      {/* Row Header */}
      <div className="flex items-end justify-between px-3 sm:px-6 lg:px-8 mb-3.5 sm:mb-4">
        <div>
          <div className="flex items-center gap-2.5">
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
          {subtitle && <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>

        {/* Scroll Arrows on Desktop */}
        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-cinema-card border border-cinema-border text-zinc-300 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xl cursor-pointer active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-cinema-card border border-cinema-border text-zinc-300 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xl cursor-pointer active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container - Mobile Touch-Friendly with Snap */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-3 sm:px-6 lg:px-8 touch-scroll scroll-smooth pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[140px] sm:min-w-[185px] md:min-w-[210px] max-w-[210px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <MovieCard movie={movie} showMatchPercentage={isAiRecommended} />
          </div>
        ))}
      </div>
    </section>
  );
}
