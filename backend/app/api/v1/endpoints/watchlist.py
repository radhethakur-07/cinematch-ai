from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import Watchlist, WatchHistory
from app.services.movie_service import movie_service
from app.schemas.user import WatchlistItem
from pydantic import BaseModel

router = APIRouter()

class WatchlistAddRequest(BaseModel):
    movie_id: int

@router.get("", response_model=List[WatchlistItem])
def get_watchlist(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's movie watchlist."""
    items = db.query(Watchlist).filter(Watchlist.user_id == user["id"]).all()
    results = []
    for item in items:
        try:
            m = movie_service.get_movie_by_id(db, item.movie_id, user_id=user["id"])
            results.append({
                "id": str(item.id),
                "movie_id": item.movie_id,
                "created_at": item.created_at,
                "movie": m
            })
        except Exception:
            continue
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    payload: WatchlistAddRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a movie to watchlist."""
    user_id = user["id"]
    existing = db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == payload.movie_id).first()
    if not existing:
        item = Watchlist(user_id=user_id, movie_id=payload.movie_id)
        db.add(item)
        history = WatchHistory(user_id=user_id, movie_id=payload.movie_id, interaction_type="watchlist")
        db.add(history)
        db.commit()
    return {"success": True, "message": "Movie added to watchlist."}

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(
    movie_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a movie from watchlist."""
    item = db.query(Watchlist).filter(Watchlist.user_id == user["id"], Watchlist.movie_id == movie_id).first()
    if item:
        db.delete(item)
        db.commit()
    return None
