from typing import List, Optional, Dict
from pydantic import BaseModel
from backend.app.schemas.movie import MovieSummarySchema

class ScoreBreakdown(BaseModel):
    content: float = 0.0
    collaborative: float = 0.0
    user_preference: float = 0.0
    quality_rating: float = 0.0

class MovieRecommendationItem(MovieSummarySchema):
    score: float
    match_percentage: int
    reasons: List[str] = []
    score_breakdown: Optional[ScoreBreakdown] = None

class RecommendationResponse(BaseModel):
    success: bool = True
    recommendations: List[MovieRecommendationItem]
    total: int
    recommendation_type: str # 'hybrid', 'cold_start', 'content_seed', 'mood_ai'
    applied_weights: Optional[Dict[str, float]] = None

class SimilarMovieResponse(BaseModel):
    source_movie_id: int
    source_title: str
    similar_movies: List[MovieSummarySchema]
