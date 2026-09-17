"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Movie } from "@/types";
import { Film, ArrowLeft, Loader2, Eye } from "lucide-react";
import { formatReleaseYear } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminMoviesPage() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["admin", "movies"],
    queryFn: () => api.get<Movie[]>("/admin/movies"),
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-cinema-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-cinema-border bg-cinema-surface text-cinema-muted hover:text-cinema-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-cinema-text flex items-center gap-2">
              <Film className="h-5 w-5 text-crimson" />
              Catalog Titles & Metadata
            </h1>
            <p className="text-xs text-cinema-muted">Ingested titles with genre relations and feature vectors</p>
          </div>
        </div>

        <span className="text-xs text-cinema-muted font-medium bg-cinema-surface border border-cinema-border px-3 py-1.5 rounded-lg">
          {movies?.length || 0} Ingested Titles
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 text-crimson animate-spin" />
          <p className="text-sm text-cinema-muted">Loading catalog titles...</p>
        </div>
      ) : (
        <div className="rounded-xl border border-cinema-border bg-cinema-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-cinema-secondary">
              <thead className="bg-cinema-elevated text-cinema-muted font-medium border-b border-cinema-border">
                <tr>
                  <th className="p-3.5">TMDB ID</th>
                  <th className="p-3.5">Movie Title</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Votes</th>
                  <th className="p-3.5">Genres</th>
                  <th className="p-3.5">Director</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border-subtle">
                {movies?.map((m) => (
                  <tr key={m.id} className="hover:bg-cinema-hover transition-colors">
                    <td className="p-3.5 font-mono text-cinema-muted">{m.id}</td>
                    <td className="p-3.5 font-medium text-cinema-text">{m.title}</td>
                    <td className="p-3.5 text-cinema-muted">{formatReleaseYear(m.release_date)}</td>
                    <td className="p-3.5 text-gold font-medium">{m.vote_average?.toFixed(1)}★</td>
                    <td className="p-3.5 text-cinema-muted">{m.vote_count?.toLocaleString()}</td>
                    <td className="p-3.5 text-cinema-muted">{m.genres?.map((g) => g.name).join(", ")}</td>
                    <td className="p-3.5 text-cinema-muted">{m.directors?.[0]?.name || "N/A"}</td>
                    <td className="p-3.5">
                      <Link href={`/movie/${m.id}`}>
                        <Button variant="secondary" size="sm" className="h-7 text-xs gap-1 border border-cinema-border">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Button>
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
