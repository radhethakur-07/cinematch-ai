from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.db_models import UserPreference, Profile
from backend.app.schemas.user import UserPreferenceUpdate, UserPreferenceResponse

router = APIRouter()

@router.get("", response_model=UserPreferenceResponse)
def get_user_preferences(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve onboarding and genre preferences for current user."""
    pref = db.query(UserPreference).filter(UserPreference.user_id == user["id"]).first()
    if not pref:
        pref = UserPreference(
            user_id=user["id"],
            favorite_genres=[],
            preferred_languages=["en"],
            preferred_decades=[],
            mood_preferences=[],
            onboarding_done=False
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)

    return UserPreferenceResponse(
        user_id=pref.user_id,
        favorite_genres=pref.favorite_genres or [],
        preferred_languages=pref.preferred_languages or ["en"],
        preferred_decades=pref.preferred_decades or [],
        mood_preferences=pref.mood_preferences or [],
        onboarding_done=pref.onboarding_done or False
    )

@router.put("", response_model=UserPreferenceResponse)
def update_user_preferences(
    payload: UserPreferenceUpdate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save onboarding choices and update recommendation profile weights."""
    user_id = user["id"]
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not pref:
        pref = UserPreference(user_id=user_id)
        db.add(pref)

    pref.favorite_genres = payload.favorite_genres
    pref.preferred_languages = payload.preferred_languages
    pref.preferred_decades = payload.preferred_decades
    pref.mood_preferences = payload.mood_preferences
    pref.onboarding_done = payload.onboarding_done

    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if profile:
        profile.onboarding_completed = payload.onboarding_done

    db.commit()
    db.refresh(pref)

    return UserPreferenceResponse(
        user_id=pref.user_id,
        favorite_genres=pref.favorite_genres or [],
        preferred_languages=pref.preferred_languages or ["en"],
        preferred_decades=pref.preferred_decades or [],
        mood_preferences=pref.mood_preferences or [],
        onboarding_done=pref.onboarding_done or False
    )
