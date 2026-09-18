"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, Save, Check, Loader2, Sun, Moon, Laptop, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/theme/theme-provider";
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
  const { theme, setTheme, mounted } = useTheme();
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
          Update your profile details, customize appearance, and fine-tune personalized recommendation weights.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-card bg-semantic-success/10 border border-semantic-success/30 p-4 text-xs font-medium text-semantic-success flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Your preferences have been updated successfully.</span>
        </div>
      )}

      {/* Appearance / Theme Selector */}
      <div className="rounded-card border border-cinema-border bg-cinema-surface p-6 space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm font-semibold text-cinema-text">Appearance & Theme</h2>
            <p className="text-xs text-cinema-muted">Choose your preferred visual mode for CineMatch AI</p>
          </div>
          {mounted && (
            <span className="text-[11px] font-medium text-cinema-muted bg-cinema-elevated px-2.5 py-1 rounded-control border border-cinema-border-subtle w-fit">
              Active: <strong className="text-cinema-text capitalize">{theme}</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* System Mode */}
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex items-start gap-3 p-4 rounded-card border text-left transition-all cursor-pointer ${
              theme === "system"
                ? "border-crimson bg-crimson-soft text-cinema-text shadow-subtle"
                : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
            }`}
          >
            <div className={`p-2 rounded-control ${theme === "system" ? "bg-crimson text-white" : "bg-cinema-surface border border-cinema-border text-cinema-muted"}`}>
              <Laptop className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-cinema-text">System Default</span>
                {theme === "system" && <Check className="h-3 w-3 text-crimson" />}
              </div>
              <p className="text-[11px] text-cinema-muted leading-tight">Syncs automatically with your operating system</p>
            </div>
          </button>

          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-start gap-3 p-4 rounded-card border text-left transition-all cursor-pointer ${
              theme === "light"
                ? "border-crimson bg-crimson-soft text-cinema-text shadow-subtle"
                : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
            }`}
          >
            <div className={`p-2 rounded-control ${theme === "light" ? "bg-crimson text-white" : "bg-cinema-surface border border-cinema-border text-cinema-muted"}`}>
              <Sun className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-cinema-text">Light Mode</span>
                {theme === "light" && <Check className="h-3 w-3 text-crimson" />}
              </div>
              <p className="text-[11px] text-cinema-muted leading-tight">Warm ivory editorial daylight palette</p>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-start gap-3 p-4 rounded-card border text-left transition-all cursor-pointer ${
              theme === "dark"
                ? "border-crimson bg-crimson-soft text-cinema-text shadow-subtle"
                : "border-cinema-border bg-cinema-elevated text-cinema-secondary hover:border-cinema-hover hover:text-cinema-text"
            }`}
          >
            <div className={`p-2 rounded-control ${theme === "dark" ? "bg-crimson text-white" : "bg-cinema-surface border border-cinema-border text-cinema-muted"}`}>
              <Moon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-cinema-text">Dark Mode</span>
                {theme === "dark" && <Check className="h-3 w-3 text-crimson" />}
              </div>
              <p className="text-[11px] text-cinema-muted leading-tight">Deep cinematic graphite nighttime palette</p>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Info */}
        <div className="rounded-card border border-cinema-border bg-cinema-surface p-6 space-y-4 shadow-card">
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
                className="w-full rounded-control bg-cinema-elevated border border-cinema-border-subtle px-3.5 py-2.5 text-xs text-cinema-muted cursor-not-allowed"
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
                className="w-full rounded-control bg-cinema-elevated border border-cinema-border px-3.5 py-2.5 text-xs text-cinema-text focus:border-crimson focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Favorite Genres Tuning */}
        <div className="rounded-card border border-cinema-border bg-cinema-surface p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-cinema-text">
                Favorite Genres
              </h2>
              <p className="text-xs text-cinema-muted">Fine-tune your primary taste anchors</p>
            </div>
            <span className="text-xs text-cinema-muted font-medium bg-cinema-elevated px-2.5 py-1 rounded-control border border-cinema-border-subtle">
              {selectedGenres.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {ALL_GENRES.map((g) => {
              const isSelected = selectedGenres.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGenre(g.id)}
                  className={`flex items-center justify-between p-3 rounded-control border text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "border-crimson/60 bg-crimson-soft text-crimson font-semibold"
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

      {/* Legal & License Footer Card */}
      <div className="rounded-card border border-cinema-border bg-cinema-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-control bg-cinema-elevated border border-cinema-border text-cinema-muted">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-cinema-text">Open Source License & Attributions</h3>
            <p className="text-[11px] text-cinema-muted">View MIT license terms, TMDB guidelines, and AI safety notices</p>
          </div>
        </div>
        <Link
          href="/license"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-control text-xs font-medium text-cinema-text bg-cinema-elevated hover:bg-cinema-hover border border-cinema-border transition-colors shadow-subtle"
        >
          <span>View License</span>
        </Link>
      </div>
    </div>
  );
}
