from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.movie import MovieSummarySchema

class ProfileResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_admin: bool = False
    onboarding_completed: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserPreferenceUpdate(BaseModel):
    favorite_genres: List[int] = Field(default=[], description="List of genre IDs")
    preferred_languages: List[str] = Field(default=["en"])
    preferred_decades: List[str] = Field(default=[])
    mood_preferences: List[str] = Field(default=[])
    onboarding_done: bool = True

class UserPreferenceResponse(BaseModel):
    user_id: str
    favorite_genres: List[int] = []
    preferred_languages: List[str] = ["en"]
    preferred_decades: List[str] = []
    mood_preferences: List[str] = []
    onboarding_done: bool = False

    model_config = ConfigDict(from_attributes=True)

class GenreAffinity(BaseModel):
    genre_name: str
    affinity_percentage: int
    movie_count: int

class UserTasteProfile(BaseModel):
    total_movies_rated: int
    average_rating_given: float
    total_watchlist_count: int
    top_genres: List[GenreAffinity]
    preferred_decades: List[str]
    recent_activity_count: int
    top_rated_movies: List[MovieSummarySchema]

class RatingCreate(BaseModel):
    movie_id: int
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating between 1.0 and 5.0")

class RatingResponse(BaseModel):
    id: str
    user_id: str
    movie_id: int
    rating: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LikeCreate(BaseModel):
    movie_id: int
    is_like: bool

class LikeResponse(BaseModel):
    id: str
    user_id: str
    movie_id: int
    is_like: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WatchlistItem(BaseModel):
    id: str
    movie_id: int
    created_at: datetime
    movie: MovieSummarySchema

    model_config = ConfigDict(from_attributes=True)

class WatchHistoryItem(BaseModel):
    id: str
    movie_id: int
    interaction_type: str
    metadata: Dict[str, Any] = {}
    created_at: datetime
    movie: Optional[MovieSummarySchema] = None

    model_config = ConfigDict(from_attributes=True)
