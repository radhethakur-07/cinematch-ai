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
    <section className="relative group/row my-8">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
            {isAiRecommended && (
              <span className="flex items-center gap-1 rounded-full bg-brand-600/20 border border-brand-500/40 px-2 py-0.5 text-[11px] font-semibold text-brand-400">
                <Sparkles className="h-3 w-3" />
                Hybrid AI
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-cinema-card border border-cinema-border text-zinc-300 hover:text-white hover:bg-cinema-hover transition-colors shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-cinema-card border border-cinema-border text-zinc-300 hover:text-white hover:bg-cinema-hover transition-colors shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 scroll-smooth pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] max-w-[220px] flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
            <MovieCard movie={movie} showMatchPercentage={isAiRecommended} />
          </div>
        ))}
      </div>
    </section>
  );
}
