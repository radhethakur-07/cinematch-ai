from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import Rating, WatchHistory
from app.schemas.user import RatingCreate, RatingResponse
from app.core.errors import AppException

router = APIRouter()

@router.get("", response_model=List[RatingResponse])
def get_user_ratings(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all ratings submitted by the current authenticated user."""
    ratings = db.query(Rating).filter(Rating.user_id == user["id"]).all()
    return ratings

@router.post("", response_model=RatingResponse)
def rate_movie(
    payload: RatingCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit or update a rating for a movie (1.0 to 5.0)."""
    user_id = user["id"]
    existing = db.query(Rating).filter(Rating.user_id == user_id, Rating.movie_id == payload.movie_id).first()
    
    if existing:
        existing.rating = payload.rating
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_rating = Rating(
            user_id=user_id,
            movie_id=payload.movie_id,
            rating=payload.rating
        )
        db.add(new_rating)
        # Log to watch history
        history = WatchHistory(
            user_id=user_id,
            movie_id=payload.movie_id,
            interaction_type="rate",
            metadata_info={"rating": payload.rating}
        )
        db.add(history)
        db.commit()
        db.refresh(new_rating)
        target = new_rating

    return target

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(
    movie_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove user's rating for a movie."""
    rating = db.query(Rating).filter(Rating.user_id == user["id"], Rating.movie_id == movie_id).first()
    if rating:
        db.delete(rating)
        db.commit()
    return None
