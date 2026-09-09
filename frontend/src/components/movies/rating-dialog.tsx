"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { useRateMovie } from "@/hooks/use-movies";

interface RatingDialogProps {
  movieId: number;
  movieTitle: string;
  currentRating?: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RatingDialog({
  movieId,
  movieTitle,
  currentRating,
  open,
  onOpenChange,
}: RatingDialogProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(currentRating || 5);
  const rateMovie = useRateMovie();

  if (!open) return null;

  const handleSubmit = () => {
    rateMovie.mutate(
      { movieId, rating: selectedRating },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const ratingLabels: Record<number, string> = {
    1: "1★ - Poor",
    2: "2★ - Mediocre",
    3: "3★ - Good",
    4: "4★ - Great",
    5: "5★ - Masterpiece",
  };

  const activeStar = hoveredStar !== null ? hoveredStar : selectedRating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-cinema-border bg-cinema-card p-6 shadow-2xl space-y-5">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-1 text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white">Rate Movie</h3>
          <p className="text-sm text-zinc-400 line-clamp-1">{movieTitle}</p>
        </div>

        {/* Stars Selector */}
        <div className="flex flex-col items-center justify-center gap-3 py-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => setSelectedRating(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= activeStar
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-600 hover:text-zinc-400"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-amber-400 h-5">
            {ratingLabels[activeStar] || ""}
          </span>
        </div>

        <p className="text-xs text-center text-zinc-400">
          Your rating immediately tunes your collaborative and hybrid recommendation profile.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-cinema-border px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rateMovie.isPending}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-600/30 disabled:opacity-50"
          >
            {rateMovie.isPending ? "Submitting..." : "Save Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
