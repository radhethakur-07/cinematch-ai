import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes?: number): string {
  if (!minutes) return "N/A";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function formatReleaseYear(releaseDate?: string): string {
  if (!releaseDate) return "N/A";
  return new Date(releaseDate).getFullYear().toString();
}

export function getTMDBImageUrl(path?: string, size: "w500" | "w780" | "original" = "w500"): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
  }
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
