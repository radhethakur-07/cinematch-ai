-- CineMatch AI - Supabase PostgreSQL Schema Migration
-- 20240101000000_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Genres Table
CREATE TABLE IF NOT EXISTS public.genres (
    id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Movies Table
CREATE TABLE IF NOT EXISTS public.movies (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    overview TEXT,
    release_date DATE,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    vote_average NUMERIC(3,1) DEFAULT 0.0,
    vote_count INT DEFAULT 0,
    popularity NUMERIC(10,2) DEFAULT 0.0,
    runtime INT,
    tagline TEXT,
    status VARCHAR(50) DEFAULT 'Released',
    trailer_url VARCHAR(255),
    budget BIGINT DEFAULT 0,
    revenue BIGINT DEFAULT 0,
    media_type VARCHAR(20) DEFAULT 'Movie',
    number_of_seasons INT,
    number_of_episodes INT,
    language VARCHAR(10) DEFAULT 'hi',
    creator VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Movie Genres Junction
CREATE TABLE IF NOT EXISTS public.movie_genres (
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- 5. Movie Cast
CREATE TABLE IF NOT EXISTS public.movie_cast (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    character VARCHAR(255),
    profile_path VARCHAR(255),
    cast_order INT DEFAULT 0
);

-- 6. Movie Directors
CREATE TABLE IF NOT EXISTS public.movie_directors (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    profile_path VARCHAR(255)
);

-- 7. Movie Keywords
CREATE TABLE IF NOT EXISTS public.movie_keywords (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL
);

-- 8. Ratings (1 to 5 stars)
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_movie_rating UNIQUE(user_id, movie_id)
);

-- 9. Likes / Dislikes
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_movie_like UNIQUE(user_id, movie_id)
);

-- 10. Watchlist
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_movie_watchlist UNIQUE(user_id, movie_id)
);

-- 11. Watch History & Interactions
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    movie_id INT REFERENCES public.movies(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    favorite_genres JSONB DEFAULT '[]'::jsonb,
    preferred_languages JSONB DEFAULT '["en"]'::jsonb,
    preferred_decades JSONB DEFAULT '[]'::jsonb,
    mood_preferences JSONB DEFAULT '[]'::jsonb,
    onboarding_done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. Recommendation Events
CREATE TABLE IF NOT EXISTS public.recommendation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    recommendation_type VARCHAR(50) NOT NULL,
    query_prompt TEXT,
    recommended_movie_ids JSONB DEFAULT '[]'::jsonb,
    clicked_movie_id INT,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_movies_popularity ON public.movies(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_movies_vote_average ON public.movies(vote_average DESC);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON public.movies(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_movies_title ON public.movies USING gin (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON public.movie_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_movie_cast_movie ON public.movie_cast(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_keywords_movie ON public.movie_keywords(movie_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_movie ON public.ratings(movie_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON public.watch_history(user_id);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public movies read access" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public genres read access" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Public movie_genres read access" ON public.movie_genres FOR SELECT USING (true);
CREATE POLICY "Public movie_cast read access" ON public.movie_cast FOR SELECT USING (true);
CREATE POLICY "Public movie_directors read access" ON public.movie_directors FOR SELECT USING (true);
CREATE POLICY "Public movie_keywords read access" ON public.movie_keywords FOR SELECT USING (true);

CREATE POLICY "Users view their profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin = true);
CREATE POLICY "Users update their profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert their profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users read their ratings" ON public.ratings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete their ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users read their likes" ON public.likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their likes" ON public.likes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete their likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users read their watchlist" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their watchlist" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete their watchlist" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users read their watch_history" ON public.watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their watch_history" ON public.watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read their preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
