import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CineMatch AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server Binding
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", 8000))

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cinematch_dev.db")
    
    # Supabase Auth & Storage
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # External APIs
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS Origins (comma separated or JSON list)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://cinematch-ai.vercel.app",
        "*"
    ]

    # Recommendation Engine Weights
    W_CONTENT: float = 0.40
    W_COLLAB: float = 0.30
    W_USER: float = 0.15
    W_RATING: float = 0.10
    W_RECENCY: float = 0.05

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()
