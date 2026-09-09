"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, Check, User, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <Settings className="h-12 w-12 text-brand-500" />
        <h2 className="text-2xl font-bold text-white">Sign In to Manage Settings</h2>
        <button
          onClick={() => router.push("/login")}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-500"
        >
          Sign In
        </button>
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
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-cinema-border/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-brand-500" />
          Account & Taste Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Update profile details and fine-tune your recommendation algorithm weights
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Your profile preferences and ML weights were saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Info */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Email Address (Read-only)</label>
              <input
                type="text"
                disabled
                value={user?.email || ""}
                className="w-full rounded-xl bg-black/40 border border-cinema-border/50 px-3.5 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Display Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Christopher Nolan"
                className="w-full rounded-xl bg-black/40 border border-cinema-border px-3.5 py-2.5 text-sm text-zinc-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Favorite Genres Tuning */}
        <div className="rounded-2xl border border-cinema-border bg-cinema-card p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Calibrated Favorite Genres
            </h3>
            <span className="text-xs text-brand-400 font-semibold">
              {selectedGenres.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ALL_GENRES.map((g) => {
              const isSelected = selectedGenres.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGenre(g.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-600/20 text-white"
                      : "border-cinema-border bg-cinema-hover/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  <span>{g.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-brand-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-500 shadow-xl shadow-brand-600/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
