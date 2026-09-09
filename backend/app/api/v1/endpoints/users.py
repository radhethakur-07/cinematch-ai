from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.models.db_models import Profile, Rating, Watchlist, WatchHistory, UserPreference
from backend.app.services.movie_service import movie_service
from backend.app.schemas.user import ProfileResponse, UserTasteProfile, GenreAffinity
from pydantic import BaseModel

router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

@router.get("/profile", response_model=ProfileResponse)
def get_current_profile(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile."""
    profile = db.query(Profile).filter(Profile.id == user["id"]).first()
    if not profile:
        profile = Profile(id=user["id"], email=user.get("email", "user@cinematch.ai"), full_name="Movie Explorer")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile information."""
    profile = db.query(Profile).filter(Profile.id == user["id"]).first()
    if profile:
        if payload.full_name is not None:
            profile.full_name = payload.full_name
        if payload.avatar_url is not None:
            profile.avatar_url = payload.avatar_url
        db.commit()
        db.refresh(profile)
    return profile

@router.get("/taste-profile", response_model=UserTasteProfile)
def get_taste_profile(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate visual user taste profile analytics for charts and stats."""
    user_id = user["id"]
    ratings = db.query(Rating).filter(Rating.user_id == user_id).all()
    watchlist_count = db.query(Watchlist).filter(Watchlist.user_id == user_id).count()
    history_count = db.query(WatchHistory).filter(WatchHistory.user_id == user_id).count()
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    avg_rating = 0.0
    if ratings:
        avg_rating = sum(float(r.rating) for r in ratings) / len(ratings)

    # Compute genre affinities based on rated movies and onboarding prefs
    genre_counts = {}
    top_rated_movies = []

    all_movies_map = {m["id"]: m for m in movie_service.get_all_movies(db)}

    for r in sorted(ratings, key=lambda x: float(x.rating), reverse=True):
        m = all_movies_map.get(r.movie_id)
        if m:
            if float(r.rating) >= 4.0 and len(top_rated_movies) < 5:
                top_rated_movies.append(m)
            for g in m.get("genres", []):
                g_name = g["name"]
                genre_counts[g_name] = genre_counts.get(g_name, 0) + int(float(r.rating))

    # Add onboarding genres if rating count is low
    if pref and pref.favorite_genres:
        genre_id_to_name = {
            28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
            18: "Drama", 14: "Fantasy", 27: "Horror", 9648: "Mystery", 10749: "Romance",
            878: "Science Fiction", 53: "Thriller"
        }
        for g_id in pref.favorite_genres:
            name = genre_id_to_name.get(int(g_id) if str(g_id).isdigit() else 0, str(g_id))
            genre_counts[name] = genre_counts.get(name, 0) + 10

    # Ensure baseline genres exist for demo
    if not genre_counts:
        genre_counts = {"Science Fiction": 25, "Thriller": 18, "Drama": 15, "Adventure": 12, "Action": 10}

    total_weight = sum(genre_counts.values()) or 1
    genre_affinities = [
        GenreAffinity(
            genre_name=k,
            affinity_percentage=min(98, max(45, int((v / total_weight) * 100 * 2.5))),
            movie_count=v
        )
        for k, v in sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    ]

    return UserTasteProfile(
        total_movies_rated=len(ratings),
        average_rating_given=round(avg_rating, 1) if avg_rating > 0 else 4.5,
        total_watchlist_count=watchlist_count,
        top_genres=genre_affinities,
        preferred_decades=pref.preferred_decades if pref and pref.preferred_decades else ["2010s", "2020s"],
        recent_activity_count=history_count + len(ratings),
        top_rated_movies=top_rated_movies or movie_service.get_all_movies(db)[:4]
    )
