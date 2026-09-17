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
    1: "1★ · Poor",
    2: "2★ · Fair",
    3: "3★ · Good",
    4: "4★ · Great",
    5: "5★ · Masterpiece",
  };

  const activeStar = hoveredStar !== null ? hoveredStar : selectedRating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-void/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-panel border border-cinema-border bg-cinema-surface p-6 shadow-modal space-y-4">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 rounded-control text-cinema-muted hover:text-cinema-text hover:bg-cinema-hover transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-base font-semibold text-cinema-text">Rate Film</h3>
          <p className="text-xs text-cinema-muted line-clamp-1">{movieTitle}</p>
        </div>

        {/* Stars Selector */}
        <div className="flex flex-col items-center justify-center gap-2 py-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => setSelectedRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= activeStar
                      ? "fill-gold text-gold"
                      : "text-cinema-border hover:text-cinema-secondary"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-gold h-4">
            {ratingLabels[activeStar] || ""}
          </span>
        </div>

        <p className="text-[11px] text-center text-cinema-muted">
          Your rating helps fine-tune your collaborative and hybrid recommendation model.
        </p>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-btn border border-cinema-border px-3.5 py-2 text-xs font-medium text-cinema-secondary hover:bg-cinema-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={rateMovie.isPending}
            className="flex-1 rounded-btn bg-crimson hover:bg-crimson-hover px-3.5 py-2 text-xs font-semibold text-white shadow-subtle transition-colors cursor-pointer disabled:opacity-50"
          >
            {rateMovie.isPending ? "Saving..." : "Save Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
