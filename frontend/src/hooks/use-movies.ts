"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Movie, MovieListResponse, UserTasteProfile, WatchlistItem, WatchHistoryItem } from "@/types";

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => api.get<Movie[]>("/movies/trending"),
    staleTime: 1000 * 60 * 10, // 10 mins
  });
}

export function useTopRatedMovies() {
  return useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: () => api.get<Movie[]>("/movies/top_rated"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => api.get<Movie>(`/movies/${movieId}`),
    enabled: !!movieId,
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "similar"],
    queryFn: () => api.get<Movie[]>(`/movies/${movieId}/similar`),
    enabled: !!movieId,
  });
}

export function useSearchMovies(query: string, genreId?: number, page: number = 1) {
  return useQuery({
    queryKey: ["search", query, genreId, page],
    queryFn: () =>
      api.get<MovieListResponse>("/search", {
        q: query,
        genre_id: genreId,
        page,
      }),
    enabled: query.length >= 0,
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: () => api.get<WatchlistItem[]>("/watchlist"),
  });
}

export function useWatchHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => api.get<WatchHistoryItem[]>("/history"),
  });
}

export function useTasteProfile() {
  return useQuery({
    queryKey: ["profile", "taste"],
    queryFn: () => api.get<UserTasteProfile>("/users/taste-profile"),
  });
}

export function useRateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ movieId, rating }: { movieId: number; rating: number }) =>
      api.post("/ratings", { movie_id: movieId, rating }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "taste"] });
    },
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ movieId, isInWatchlist }: { movieId: number; isInWatchlist: boolean }) => {
      if (isInWatchlist) {
        return api.delete(`/watchlist/${movieId}`);
      } else {
        return api.post("/watchlist", { movie_id: movieId });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
