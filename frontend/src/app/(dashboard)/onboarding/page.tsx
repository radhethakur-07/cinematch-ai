"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const GENRES = [
  { id: 878, name: "Science Fiction" },
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 53, name: "Thriller" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 16, name: "Animation" },
  { id: 14, name: "Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
];

const DECADES = ["1970s - 1980s", "1990s Golden Era", "2000s Modern Classics", "2010s Blockbusters", "2020s Contemporary"];

const MOODS = [
  "Mind-bending & Intellectual",
  "Emotional & Moving",
  "Dark, Gritty & Atmospheric",
  "Uplifting & Inspiring",
  "Adrenaline & Fast-Paced",
  "Epic & Cinematic"
];

export default function OnboardingPage() {
  const router = useRouter();
  const refreshUser = useAuth((state) => state.refreshUser);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([878, 53]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>(["2010s Blockbusters", "2020s Contemporary"]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Mind-bending & Intellectual"]);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleDecade = (d: string) => {
    setSelectedDecades((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const toggleMood = (m: string) => {
    setSelectedMoods((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await api.put("/preferences", {
        favorite_genres: selectedGenres,
        preferred_languages: ["en"],
        preferred_decades: selectedDecades,
        mood_preferences: selectedMoods,
        onboarding_done: true,
      });
      await refreshUser();
      router.push("/home");
    } catch {
      router.push("/home");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface px-3 py-1 text-xs font-medium text-cinema-muted">
          <Sparkles className="h-3.5 w-3.5 text-crimson" />
          <span>Taste Calibration</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-cinema-text">
          What films do you enjoy?
        </h1>
        <p className="text-sm text-cinema-muted max-w-md mx-auto">
          Select your favorite genres and themes. CineMatch uses these preferences to initialize your recommendation vector.
        </p>
      </div>

      {/* 1. Genres Selection */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cinema-text">
            1. Favorite Genres
          </h2>
          <span className="text-xs text-cinema-muted font-medium">
            {selectedGenres.length} selected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {GENRES.map((g) => {
            const isSelected = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-crimson/60 bg-crimson/10 text-crimson"
                    : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
                }`}
              >
                <span>{g.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-crimson" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Decades Selection */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold text-cinema-text">
          2. Preferred Eras
        </h2>
        <div className="flex flex-wrap gap-2">
          {DECADES.map((d) => {
            const isSelected = selectedDecades.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDecade(d)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-crimson/60 bg-crimson/10 text-crimson"
                    : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Mood Preference */}
      <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold text-cinema-text">
          3. Themes & Moods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MOODS.map((m) => {
            const isSelected = selectedMoods.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMood(m)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-crimson/60 bg-crimson/10 text-crimson"
                    : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
                }`}
              >
                <span>{m}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-crimson" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-cinema-border">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="text-xs text-cinema-muted hover:text-cinema-text font-medium transition-colors"
        >
          Skip calibration
        </button>

        <Button
          type="button"
          disabled={saving}
          onClick={handleComplete}
          className="gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <>
              <span>Explore Recommendations</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
