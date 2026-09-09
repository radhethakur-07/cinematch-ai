from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.schemas.user import ProfileResponse
from backend.app.schemas.movie import MovieSummarySchema

class AdminDashboardMetrics(BaseModel):
    total_users: int
    active_users_30d: int
    total_movies: int
    total_ratings: int
    total_watchlist_entries: int
    total_recommendation_requests: int
    average_platform_rating: float
    system_latency_ms: float

class RatingsDistribution(BaseModel):
    star_1: int = 0
    star_2: int = 0
    star_3: int = 0
    star_4: int = 0
    star_5: int = 0

class GenreDistribution(BaseModel):
    genre: str
    count: int
    percentage: float

class DailyActivity(BaseModel):
    date: str
    ratings_count: int
    recommendations_count: int
    new_users: int

class AdminAnalyticsChart(BaseModel):
    ratings_distribution: RatingsDistribution
    genre_distribution: List[GenreDistribution]
    activity_trend: List[DailyActivity]
    popular_movies: List[MovieSummarySchema]
    highest_rated_movies: List[MovieSummarySchema]

class AdminUserItem(ProfileResponse):
    ratings_count: int = 0
    watchlist_count: int = 0
    last_active: Optional[datetime] = None
