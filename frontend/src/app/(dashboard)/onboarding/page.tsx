"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ArrowRight, Film } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

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

const DECADES = ["1970s - 1980s", "1990s Golden Era", "2000s Modern Classic", "2010s Blockbuster Era", "2020s Contemporary"];

const MOODS = [
  "Mind-bending & Intellectual",
  "Emotional & Tearjerker",
  "Dark, Gritty & Atmospheric",
  "Uplifting & Feel-Good",
  "Adrenaline & Fast-Paced",
  "Epic & Mythological"
];

export default function OnboardingPage() {
  const router = useRouter();
  const refreshUser = useAuth((state) => state.refreshUser);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([878, 53]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>(["2010s Blockbuster Era", "2020s Contemporary"]);
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
    } catch (err) {
      router.push("/home");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Cold-Start Taste Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          What kind of movies do you enjoy?
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Select your favorite genres and movie vibes. CineMatch AI uses these starter signals to generate immediate recommendations.
        </p>
      </div>

      {/* 1. Genres Selection */}
      <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
          1. Select Favorite Genres
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {GENRES.map((g) => {
            const isSelected = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-600/20 text-white shadow-md shadow-brand-600/20"
                    : "border-cinema-border bg-cinema-hover/40 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <span>{g.name}</span>
                {isSelected && <Check className="h-4 w-4 text-brand-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Decades Selection */}
      <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
          2. Preferred Eras & Decades
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {DECADES.map((d) => {
            const isSelected = selectedDecades.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDecade(d)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "border-cinema-border bg-cinema-hover/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Mood Preference */}
      <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
          3. Desired Movie Moods & Themes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOODS.map((m) => {
            const isSelected = selectedMoods.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMood(m)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm"
                    : "border-cinema-border bg-cinema-hover/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                <span>{m}</span>
                {isSelected && <Check className="h-4 w-4 text-amber-400" />}
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
          className="text-xs font-semibold text-zinc-400 hover:text-white"
        >
          Skip for now
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleComplete}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-500 shadow-xl shadow-brand-600/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          <span>{saving ? "Personalizing Experience..." : "Launch CineMatch AI"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
