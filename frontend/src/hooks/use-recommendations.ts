"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Movie, AIMoodSearchResponse } from "@/types";

interface RecommendationResponse {
  success: boolean;
  recommendations: Movie[];
  total: number;
  recommendation_type: string;
  applied_weights?: Record<string, number>;
}

export function useRecommendations(topN: number = 20) {
  return useQuery({
    queryKey: ["recommendations", topN],
    queryFn: () =>
      api.get<RecommendationResponse>("/recommendations", {
        top_n: topN,
      }),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useAIMoodSearch() {
  return useMutation({
    mutationFn: (prompt: string) =>
      api.post<AIMoodSearchResponse>("/recommendations/mood", { prompt }),
  });
}
