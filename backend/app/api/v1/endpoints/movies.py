from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_optional_current_user
from backend.app.services.movie_service import movie_service
from backend.app.services.recommendation_service import recommendation_service
from backend.app.schemas.movie import MovieSummarySchema, MovieDetailSchema, MovieListResponse, GenreSchema

router = APIRouter()

@router.get("", response_model=MovieListResponse)
def get_movies(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    genre_id: Optional[int] = None,
    sort_by: Optional[str] = "popularity.desc",
    db: Session = Depends(get_db)
):
    """List movies with optional genre filter and pagination."""
    all_movies = movie_service.get_all_movies(db)
    filtered = all_movies
    if genre_id:
        filtered = [m for m in filtered if any(g["id"] == genre_id for g in m.get("genres", []))]
    
    if sort_by == "vote_average.desc":
        filtered.sort(key=lambda x: x.get("vote_average", 0), reverse=True)
    elif sort_by == "release_date.desc":
        filtered.sort(key=lambda x: str(x.get("release_date", "")), reverse=True)
    else:
        filtered.sort(key=lambda x: x.get("popularity", 0), reverse=True)

    total = len(filtered)
    start = (page - 1) * page_size
    items = filtered[start:start + page_size]

    return MovieListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, (total + page_size - 1) // page_size)
    )

@router.get("/trending", response_model=List[MovieSummarySchema])
def get_trending_movies(db: Session = Depends(get_db)):
    """Get weekly trending movies."""
    movies = movie_service.get_all_movies(db)
    return sorted(movies, key=lambda x: x.get("popularity", 0), reverse=True)[:10]

@router.get("/top_rated", response_model=List[MovieSummarySchema])
def get_top_rated_movies(db: Session = Depends(get_db)):
    """Get critically acclaimed top rated movies."""
    movies = movie_service.get_all_movies(db)
    return sorted(movies, key=lambda x: x.get("vote_average", 0), reverse=True)[:10]

@router.get("/genres", response_model=List[GenreSchema])
def get_genres(db: Session = Depends(get_db)):
    """Get list of available genres."""
    all_movies = movie_service.get_all_movies(db)
    genres_dict = {}
    for m in all_movies:
        for g in m.get("genres", []):
            genres_dict[g["id"]] = g["name"]
    return [{"id": k, "name": v} for k, v in genres_dict.items()]

@router.get("/{movie_id}", response_model=MovieDetailSchema)
def get_movie_details(
    movie_id: int = Path(..., description="TMDB Movie ID"),
    user: Optional[dict] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive movie details including cast, directors, trailer, and user interaction status."""
    user_id = user.get("id") if user else None
    return movie_service.get_movie_by_id(db, movie_id, user_id=user_id)

@router.get("/{movie_id}/similar", response_model=List[MovieSummarySchema])
def get_similar_movies(
    movie_id: int = Path(..., description="TMDB Movie ID"),
    top_n: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get 'More Like This' movie recommendations computed using TF-IDF cosine similarity."""
    return recommendation_service.get_similar_movies(db, movie_id, top_n=top_n)
