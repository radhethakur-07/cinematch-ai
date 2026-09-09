from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.movie_service import movie_service
from backend.app.schemas.movie import MovieListResponse

router = APIRouter()

@router.get("", response_model=MovieListResponse)
def search_movies(
    q: str = Query("", description="Search term across movie title, actor, director"),
    genre_id: Optional[int] = Query(None, description="Optional genre ID filter"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Fast debounced movie search supporting title, cast, director, and genre filtering."""
    return movie_service.search_movies(db, query=q, genre_id=genre_id, page=page, page_size=page_size)
