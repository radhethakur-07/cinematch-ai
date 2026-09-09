# CineMatch AI - REST API Reference

Base Endpoint: `/api/v1`  
Interactive Swagger UI: `http://localhost:8000/docs`  
Interactive ReDoc: `http://localhost:8000/redoc`

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Register a new user account and receive a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Christopher Nolan"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "full_name": "Christopher Nolan",
      "is_admin": false,
      "onboarding_completed": false,
      "created_at": "2024-03-01T12:00:00Z"
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Request Body**: `{"email": "user@example.com", "password": "..."}`
- **Response `200 OK`**: Returns JWT access token and profile.

### `GET /api/v1/auth/me` *(Protected)*
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Profile of currently authenticated user.

---

## 2. Movies Catalog (`/api/v1/movies`)

### `GET /api/v1/movies`
List movies with optional pagination and genre filtering.
- **Query Parameters**:
  - `page`: int (default: 1)
  - `page_size`: int (default: 20, max: 100)
  - `genre_id`: int (optional TMDB genre ID)
  - `sort_by`: string (`popularity.desc`, `vote_average.desc`, `release_date.desc`)

### `GET /api/v1/movies/{id}`
Retrieve complete movie details including cast, directors, keywords, trailer video link, and personalized user state (rating, watchlist status, like status).

### `GET /api/v1/movies/{id}/similar`
Retrieve top similar movies computed via content-based TF-IDF cosine similarity.

---

## 3. Recommendations (`/api/v1/recommendations`)

### `GET /api/v1/recommendations`
Generate personalized hybrid recommendations based on user ratings, onboarding preferences, and collaborative matrices.
- **Query Parameters**: `top_n` (default: 20)
- **Response**:
  ```json
  {
    "success": true,
    "recommendations": [
      {
        "id": 157336,
        "title": "Interstellar",
        "match_percentage": 96,
        "score": 0.892,
        "reasons": [
          "Shares thematic DNA with Inception",
          "Matches your affinity for Science Fiction",
          "Masterpiece acclaim (8.4★ community score)"
        ],
        "score_breakdown": {
          "content": 0.91,
          "collaborative": 0.85,
          "user_preference": 0.95,
          "quality_rating": 0.84
        }
      }
    ],
    "total": 20,
    "recommendation_type": "hybrid",
    "applied_weights": {
      "w_content": 0.40,
      "w_collab": 0.30,
      "w_user": 0.15,
      "w_rating": 0.10,
      "w_recency": 0.05
    }
  }
  ```

### `POST /api/v1/recommendations/mood`
AI natural language movie discovery.
- **Request Body**: `{"prompt": "I want something like Interstellar but more emotional and not too long."}`
- **Response**: Returns structured intent schema + ranked recommendations with explainability reasons.

---

## 4. User Ratings & Watchlist

- `GET /api/v1/ratings` - List user ratings
- `POST /api/v1/ratings` - Submit/update rating (1.0 to 5.0)
- `DELETE /api/v1/ratings/{movie_id}` - Delete rating
- `GET /api/v1/watchlist` - List user watchlist
- `POST /api/v1/watchlist` - Add movie to watchlist
- `DELETE /api/v1/watchlist/{movie_id}` - Remove movie from watchlist
- `GET /api/v1/history` - User interaction history timeline
- `GET /api/v1/preferences` - User onboarding & genre preferences
- `PUT /api/v1/preferences` - Update user onboarding preferences

---

## 5. Admin & Analytics (`/api/v1/admin`) *(Admin Protected)*

- `GET /api/v1/admin/metrics` - Total users, active users, ratings count, system latency
- `GET /api/v1/admin/analytics` - Ratings distribution, genre pie breakdown, daily activity trend
- `GET /api/v1/admin/users` - User list with interaction metrics
- `GET /api/v1/admin/movies` - Catalog overview table
