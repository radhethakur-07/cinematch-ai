from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
from app.schemas.recommendation import MovieRecommendationItem

class StructuredMovieIntent(BaseModel):
    """Schema validated structured intent extracted by Google Gemini from natural language prompt."""
    genres: List[str] = Field(default=[], description="List of recognized movie genre names")
    moods: List[str] = Field(default=[], description="Target mood descriptors, e.g. dark, emotional, lighthearted, mind-bending")
    similar_to: List[str] = Field(default=[], description="Reference movie or franchise titles mentioned by user")
    max_runtime: Optional[int] = Field(default=None, description="Maximum desired movie runtime in minutes")
    min_rating: Optional[float] = Field(default=None, description="Minimum TMDB rating threshold (e.g. 7.0)")
    keywords: List[str] = Field(default=[], description="Core thematic keywords and topics")
    reasoning: Optional[str] = Field(default=None, description="Brief explanation of how the query was mapped")

class AIMoodSearchRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=500, description="Natural language prompt describing what to watch")

class AIMoodSearchResponse(BaseModel):
    success: bool = True
    prompt: str
    structured_intent: StructuredMovieIntent
    recommendations: List[MovieRecommendationItem]
    ai_provider: str = "Google Gemini"
    fallback_used: bool = False
