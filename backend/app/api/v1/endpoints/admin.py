from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin, get_optional_current_user
from app.services.admin_service import admin_service
from app.services.movie_service import movie_service
from app.models.db_models import Profile, Rating, Watchlist
from app.schemas.admin import AdminDashboardMetrics, AdminAnalyticsChart, AdminUserItem
from app.schemas.movie import MovieSummarySchema

router = APIRouter()

@router.get("/metrics", response_model=AdminDashboardMetrics)
def get_metrics(
    user: dict = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve platform-wide KPIs for admin dashboard."""
    return admin_service.get_dashboard_metrics(db)

@router.get("/analytics", response_model=AdminAnalyticsChart)
def get_analytics(
    user: dict = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve detailed platform analytics: rating distribution, genre affinities, and activity trends."""
    return admin_service.get_analytics(db)

@router.get("/users", response_model=List[AdminUserItem])
def get_admin_users(
    user: dict = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """List registered users with rating activity summary."""
    profiles = db.query(Profile).limit(50).all()
    results = []
    for p in profiles:
        r_cnt = db.query(Rating).filter(Rating.user_id == p.id).count()
        w_cnt = db.query(Watchlist).filter(Watchlist.user_id == p.id).count()
        results.append(AdminUserItem(
            id=p.id,
            email=p.email,
            full_name=p.full_name,
            avatar_url=p.avatar_url,
            is_admin=p.is_admin,
            onboarding_completed=p.onboarding_completed,
            created_at=p.created_at,
            ratings_count=r_cnt,
            watchlist_count=w_cnt,
            last_active=p.updated_at
        ))
    return results

@router.get("/movies", response_model=List[MovieSummarySchema])
def get_admin_movies(
    user: dict = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """List movies for admin catalog oversight."""
    return movie_service.get_all_movies(db)
