export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  name: string;
  character?: string;
  profile_path?: string;
  cast_order?: number;
}

export interface Director {
  name: string;
  profile_path?: string;
}

export interface ScoreBreakdown {
  content: number;
  collaborative: number;
  user_preference: number;
  quality_rating: number;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime?: number;
  tagline?: string;
  status?: string;
  trailer_url?: string;
  budget?: number;
  revenue?: number;
  media_type?: "Movie" | "Series" | string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  language?: string;
  creator?: string;
  genres: Genre[];
  cast?: CastMember[];
  directors?: Director[];
  keywords?: string[];
  
  // Recommendation metadata
  match_percentage?: number;
  score?: number;
  reasons?: string[];
  score_breakdown?: ScoreBreakdown;

  // User state
  user_rating?: number | null;
  is_liked?: boolean | null;
  is_in_watchlist?: boolean;
}

export interface MovieListResponse {
  items: Movie[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface StructuredMovieIntent {
  genres: string[];
  moods: string[];
  similar_to: string[];
  max_runtime?: number | null;
  min_rating?: number | null;
  keywords: string[];
  reasoning?: string;
}

export interface AIMoodSearchResponse {
  success: boolean;
  prompt: string;
  structured_intent: StructuredMovieIntent;
  recommendations: Movie[];
  ai_provider: string;
  fallback_used: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

export interface GenreAffinity {
  genre_name: string;
  affinity_percentage: number;
  movie_count: number;
}

export interface UserTasteProfile {
  total_movies_rated: number;
  average_rating_given: number;
  total_watchlist_count: number;
  top_genres: GenreAffinity[];
  preferred_decades: string[];
  recent_activity_count: number;
  top_rated_movies: Movie[];
}

export interface WatchlistItem {
  id: string;
  movie_id: number;
  created_at: string;
  movie: Movie;
}

export interface WatchHistoryItem {
  id: string;
  movie_id: number;
  interaction_type: string;
  metadata: Record<string, any>;
  created_at: string;
  movie?: Movie;
}

export interface AdminDashboardMetrics {
  total_users: number;
  active_users_30d: number;
  total_movies: number;
  total_ratings: number;
  total_watchlist_entries: number;
  total_recommendation_requests: number;
  average_platform_rating: number;
  system_latency_ms: number;
}

export interface AdminAnalyticsChart {
  ratings_distribution: {
    star_1: number;
    star_2: number;
    star_3: number;
    star_4: number;
    star_5: number;
  };
  genre_distribution: {
    genre: string;
    count: number;
    percentage: number;
  }[];
  activity_trend: {
    date: string;
    ratings_count: number;
    recommendations_count: number;
    new_users: number;
  }[];
  popular_movies: Movie[];
  highest_rated_movies: Movie[];
}
