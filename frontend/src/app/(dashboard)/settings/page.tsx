"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const ALL_GENRES = [
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

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
    // Fetch preferences
    api
      .get<any>("/preferences")
      .then((data) => {
        if (data?.favorite_genres) {
          setSelectedGenres(data.favorite_genres.map((g: any) => Number(g)));
        }
      })
      .catch(() => {});
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <EmptyState
          icon={Settings}
          title="Sign in to manage settings"
          description="Update your display name and fine-tune your favorite genres for personalized recommendations."
          actionLabel="Sign In"
          onAction={() => router.push("/login")}
        />
      </div>
    );
  }

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.put("/users/profile", { full_name: fullName });
      await api.put("/preferences", {
        favorite_genres: selectedGenres,
        preferred_languages: ["en"],
        preferred_decades: ["2010s", "2020s"],
        mood_preferences: ["Mind-bending & Intellectual"],
        onboarding_done: true,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-cinema-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cinema-text">
          Account & Taste Settings
        </h1>
        <p className="text-sm text-cinema-muted">
          Update your profile details and fine-tune your personalized recommendation weights.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Your preferences have been updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Info */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
          <h2 className="text-sm font-semibold text-cinema-text">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-cinema-muted">Email Address (Read-only)</label>
              <input
                type="text"
                disabled
                value={user?.email || ""}
                className="w-full rounded-lg bg-cinema-elevated border border-cinema-border-subtle px-3.5 py-2.5 text-xs text-cinema-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-cinema-text font-medium">Display Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Christopher Nolan"
                className="w-full rounded-lg bg-cinema-elevated border border-cinema-border px-3.5 py-2.5 text-xs text-cinema-text focus:border-crimson focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Favorite Genres Tuning */}
        <div className="rounded-xl border border-cinema-border bg-cinema-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-cinema-text">
              Favorite Genres
            </h2>
            <span className="text-xs text-cinema-muted font-medium">
              {selectedGenres.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {ALL_GENRES.map((g) => {
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

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
