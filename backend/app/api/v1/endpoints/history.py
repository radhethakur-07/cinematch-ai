from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.db_models import WatchHistory
from backend.app.services.movie_service import movie_service
from backend.app.schemas.user import WatchHistoryItem
from pydantic import BaseModel

router = APIRouter()

class HistoryLogRequest(BaseModel):
    movie_id: int
    interaction_type: str = "view" # 'view', 'trailer_play', 'recommendation_click'
    metadata: Optional[Dict[str, Any]] = None

@router.get("", response_model=List[WatchHistoryItem])
def get_watch_history(
    limit: int = Query(30, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get interaction history timeline for the current user."""
    items = db.query(WatchHistory).filter(
        WatchHistory.user_id == user["id"]
    ).order_by(desc(WatchHistory.created_at)).limit(limit).all()

    results = []
    for item in items:
        movie_obj = None
        try:
            movie_obj = movie_service.get_movie_by_id(db, item.movie_id, user_id=user["id"])
        except Exception:
            pass

        results.append({
            "id": str(item.id),
            "movie_id": item.movie_id,
            "interaction_type": item.interaction_type,
            "metadata": item.metadata_info or {},
            "created_at": item.created_at,
            "movie": movie_obj
        })
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def log_interaction(
    payload: HistoryLogRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log an interaction event (movie viewed, trailer clicked, etc.)."""
    history = WatchHistory(
        user_id=user["id"],
        movie_id=payload.movie_id,
        interaction_type=payload.interaction_type,
        metadata_info=payload.metadata or {}
    )
    db.add(history)
    db.commit()
    return {"success": True, "message": "Interaction logged"}
