from typing import List, Optional, Any
from datetime import date
from pydantic import BaseModel, Field, ConfigDict

class GenreSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class CastMemberSchema(BaseModel):
    name: str
    character: Optional[str] = None
    profile_path: Optional[str] = None
    cast_order: int = 0

    model_config = ConfigDict(from_attributes=True)

class DirectorSchema(BaseModel):
    name: str
    profile_path: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class KeywordSchema(BaseModel):
    keyword: str

    model_config = ConfigDict(from_attributes=True)

class MovieSummarySchema(BaseModel):
    id: int
    title: str
    original_title: Optional[str] = None
    media_type: Optional[str] = "Movie"
    overview: Optional[str] = None
    release_date: Optional[date] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_average: float = 0.0
    vote_count: int = 0
    popularity: float = 0.0
    runtime: Optional[int] = None
    number_of_seasons: Optional[int] = None
    number_of_episodes: Optional[int] = None
    language: Optional[str] = "hi"
    creator: Optional[str] = None
    tagline: Optional[str] = None
    genres: List[GenreSchema] = []
    match_percentage: Optional[int] = None
    reasons: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)

class MovieDetailSchema(MovieSummarySchema):
    status: Optional[str] = "Released"
    trailer_url: Optional[str] = None
    budget: int = 0
    revenue: int = 0
    cast: List[CastMemberSchema] = []
    directors: List[DirectorSchema] = []
    keywords: List[str] = []
    
    # User interaction status if authenticated
    user_rating: Optional[float] = None
    is_liked: Optional[bool] = None
    is_in_watchlist: bool = False

    model_config = ConfigDict(from_attributes=True)

class MovieListResponse(BaseModel):
    items: List[MovieSummarySchema]
    total: int
    page: int
    page_size: int
    total_pages: int

class MovieFilterParams(BaseModel):
    media_type: Optional[str] = None # 'Movie', 'Series', or None
    genre_id: Optional[int] = None
    year: Optional[int] = None
    min_rating: Optional[float] = None
    language: Optional[str] = None
    sort_by: Optional[str] = "popularity.desc" # 'popularity.desc', 'vote_average.desc', 'release_date.desc'
    page: int = 1
    page_size: int = 20
