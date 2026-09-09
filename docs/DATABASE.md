# CineMatch AI - Database Schema & Architecture

## 1. Overview

CineMatch AI uses **Supabase PostgreSQL** as its primary relational datastore. The schema is fully normalized, indexed for high-volume read queries, and secured using **Row Level Security (RLS)** policies.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    PROFILES ||--o{ RATINGS : "rates"
    PROFILES ||--o{ LIKES : "likes/dislikes"
    PROFILES ||--o{ WATCHLIST : "saves"
    PROFILES ||--o{ WATCH_HISTORY : "logs"
    PROFILES ||--|| USER_PREFERENCES : "configures"
    
    MOVIES ||--o{ MOVIE_GENRES : "categorized_by"
    GENRES ||--o{ MOVIE_GENRES : "contains"
    
    MOVIES ||--o{ MOVIE_CAST : "features"
    MOVIES ||--o{ MOVIE_DIRECTORS : "directed_by"
    MOVIES ||--o{ MOVIE_KEYWORDS : "tagged_with"
    
    MOVIES ||--o{ RATINGS : "rated_in"
    MOVIES ||--o{ LIKES : "liked_in"
    MOVIES ||--o{ WATCHLIST : "saved_in"
    MOVIES ||--o{ WATCH_HISTORY : "tracked_in"

    PROFILES {
        uuid id PK
        string email
        string full_name
        boolean is_admin
        boolean onboarding_completed
        timestamp created_at
    }

    MOVIES {
        int id PK
        string title
        string overview
        date release_date
        numeric vote_average
        int vote_count
        numeric popularity
        int runtime
        string trailer_url
    }

    RATINGS {
        uuid id PK
        uuid user_id FK
        int movie_id FK
        numeric rating
        timestamp updated_at
    }

    WATCHLIST {
        uuid id PK
        uuid user_id FK
        int movie_id FK
        timestamp created_at
    }
```

---

## 3. Key Constraints & Performance Indexes

1. **Unique Interaction Constraints**:
   - `ratings`: `UNIQUE(user_id, movie_id)` (Guarantees one active rating per movie per user).
   - `likes`: `UNIQUE(user_id, movie_id)`
   - `watchlist`: `UNIQUE(user_id, movie_id)`
2. **Indexes**:
   - `idx_movies_popularity`: Fast retrieval of globally trending films.
   - `idx_movies_vote_average`: Accelerates top-rated catalog queries.
   - `idx_movies_title`: GIN full-text search index on movie titles.
   - `idx_ratings_user`: Instant user vector compilation during recommendation requests.
3. **Row Level Security (RLS)**:
   - Public read access on movies, genres, cast, and directors.
   - Strict authenticated ownership on profiles, ratings, watchlist, and history (`auth.uid() = user_id`).
