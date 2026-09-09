from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    auth,
    movies,
    recommendations,
    search,
    ai,
    ratings,
    watchlist,
    history,
    preferences,
    users,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(movies.router, prefix="/movies", tags=["Movies"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Natural Language Discovery"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["Ratings"])
api_router.include_router(watchlist.router, prefix="/watchlist", tags=["Watchlist"])
api_router.include_router(history.router, prefix="/history", tags=["Watch History"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["Preferences"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & Analytics"])
