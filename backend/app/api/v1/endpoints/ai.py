from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_optional_current_user
from app.services.recommendation_service import recommendation_service
from app.schemas.ai import AIMoodSearchRequest, AIMoodSearchResponse

router = APIRouter()

@router.post("/discover", response_model=AIMoodSearchResponse)
async def ai_discover(
    payload: AIMoodSearchRequest,
    user: Optional[dict] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    AI Natural Language Discovery.
    Takes conversational prompts like:
    'I want a mind-bending sci-fi movie like Interstellar but not too long.'
    and extracts structured intent for ML ranking.
    """
    user_id = user.get("id") if user else None
    return await recommendation_service.get_mood_recommendations(db, prompt=payload.prompt, user_id=user_id)
