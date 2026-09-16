import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal, run_auto_migrations
import app.models.db_models  # Ensure models are registered on Base.metadata
from app.core.errors import AppException, app_exception_handler, validation_exception_handler, general_exception_handler
from app.core.logging import logger, RequestLoggingMiddleware
from app.api.v1.api import api_router
from app.services.recommendation_service import recommendation_service
import asyncio
from app.services.movie_service import DEFAULT_CATALOG

async def background_startup_tasks():
    """Run database schema migration and catalog warmup in background so port opens immediately."""
    await asyncio.sleep(0.1)  # Yield to event loop so uvicorn binds to port first
    try:
        # Run blocking DB operations in threadpool so it doesn't block event loop
        await asyncio.to_thread(Base.metadata.create_all, bind=engine)
        await asyncio.to_thread(run_auto_migrations, engine)
        logger.info("[CineMatch AI] Background database schema initialized and migrated.")

        db = SessionLocal()
        try:
            movies = await asyncio.to_thread(movie_service.get_all_movies, db)
            recommendation_service.initialize(movies)
            logger.info(f"[CineMatch AI] Preloaded {len(movies)} movies into recommendation engine.")
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"[CineMatch AI] Background startup notice: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("[CineMatch AI] Starting up API server...")
    # Initialize in-memory recommendation service immediately with default catalog (0.01s)
    try:
        recommendation_service.initialize(DEFAULT_CATALOG)
    except Exception as e:
        logger.warning(f"[CineMatch AI] In-memory init notice: {e}")

    # Launch background DB sync & migrations without blocking Render port scan
    asyncio.create_task(background_startup_tasks())

    yield
    logger.info("[CineMatch AI] Shutting down API server...")

app = FastAPI(
    title="CineMatch AI API",
    description="Production-grade AI Movie Recommendation & Discovery Engine API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration - Dynamically loaded from Environment Variables
origins = list(settings.CORS_ORIGINS) if isinstance(settings.CORS_ORIGINS, list) else [str(settings.CORS_ORIGINS)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request ID & Logging Middleware
app.add_middleware(RequestLoggingMiddleware)

# Centralized Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System Health"])
def health_check():
    """Liveness and readiness health probe for Render / orchestration."""
    return {
        "status": "healthy",
        "service": "CineMatch AI API",
        "environment": settings.ENVIRONMENT,
        "recommendation_engine_ready": recommendation_service.is_initialized,
        "timestamp": time.time()
    }

@app.get("/", tags=["System"])
def root():
    return {
        "name": "CineMatch AI API",
        "tagline": "Find your next obsession.",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
