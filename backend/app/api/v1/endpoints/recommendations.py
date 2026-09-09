from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_optional_current_user
from backend.app.services.recommendation_service import recommendation_service
from backend.app.schemas.recommendation import RecommendationResponse
from backend.app.schemas.ai import AIMoodSearchRequest, AIMoodSearchResponse

router = APIRouter()

@router.get("", response_model=RecommendationResponse)
def get_recommendations(
    top_n: int = Query(15, ge=1, le=50),
    user: Optional[dict] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate personalized hybrid recommendations.
    Uses TF-IDF Content vectors + Collaborative filtering + User preferences with cold-start adaptation.
    """
    user_id = user.get("id") if user else None
    return recommendation_service.get_personalized_recommendations(db, user_id=user_id, top_n=top_n)

@router.post("/mood", response_model=AIMoodSearchResponse)
async def get_mood_recommendations(
    payload: AIMoodSearchRequest,
    user: Optional[dict] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    AI-powered natural language recommendation endpoint.
    Translates user's prompt (via Gemini or heuristic) into structured intent and performs hybrid ranking.
    """
    user_id = user.get("id") if user else None
    return await recommendation_service.get_mood_recommendations(db, prompt=payload.prompt, user_id=user_id)
