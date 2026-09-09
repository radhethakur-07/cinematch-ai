"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Movie } from "@/types";
import { Film, ArrowLeft, Loader2, Star, Eye } from "lucide-react";
import { formatReleaseYear } from "@/lib/utils";

export default function AdminMoviesPage() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["admin", "movies"],
    queryFn: () => api.get<Movie[]>("/admin/movies"),
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-cinema-border/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-card text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Film className="h-6 w-6 text-rose-400" />
              Movie Catalog & Metadata
            </h1>
            <p className="text-xs text-zinc-400">Ingested TMDB movies with genre relations and vector fields</p>
          </div>
        </div>

        <span className="text-xs text-zinc-300 font-semibold bg-cinema-card border border-cinema-border px-3 py-1.5 rounded-lg">
          {movies?.length || 0} Ingested Titles
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          <p className="text-sm text-zinc-400">Loading catalog titles...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-cinema-border bg-cinema-card shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/40 text-zinc-400 font-semibold border-b border-cinema-border">
                <tr>
                  <th className="p-4">TMDB ID</th>
                  <th className="p-4">Movie Title</th>
                  <th className="p-4">Release Year</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Vote Count</th>
                  <th className="p-4">Genres</th>
                  <th className="p-4">Director</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border/50">
                {movies?.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-zinc-400">{m.id}</td>
                    <td className="p-4 font-semibold text-white">{m.title}</td>
                    <td className="p-4 text-zinc-300">{formatReleaseYear(m.release_date)}</td>
                    <td className="p-4 text-amber-400 font-bold">{m.vote_average?.toFixed(1)}★</td>
                    <td className="p-4 text-zinc-300">{m.vote_count?.toLocaleString()}</td>
                    <td className="p-4 text-zinc-400">{m.genres?.map((g) => g.name).join(", ")}</td>
                    <td className="p-4 text-zinc-300">{m.directors?.[0]?.name || "N/A"}</td>
                    <td className="p-4">
                      <Link
                        href={`/movie/${m.id}`}
                        className="inline-flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-200 hover:bg-brand-600 hover:text-white transition-colors"
                      >
                        <Eye className="h-3 w-3" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
