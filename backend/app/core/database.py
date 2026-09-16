from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from app.core.config import settings

# If postgres URL starts with postgres://, fix for SQLAlchemy (postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Handle SQLite vs Postgres connection args
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_engine(
    db_url,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True if "postgresql" in db_url else False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

from sqlalchemy import inspect, text
from app.core.logging import logger

def run_auto_migrations(db_engine):
    """Automatically check and apply missing columns across SQLite & PostgreSQL (Supabase)."""
    try:
        inspector = inspect(db_engine)
        table_names = inspector.get_table_names()

        # 1. Profiles Table Migrations
        if "profiles" in table_names:
            profile_cols = [c["name"] for c in inspector.get_columns("profiles")]
            with db_engine.begin() as conn:
                if "password_hash" not in profile_cols:
                    conn.execute(text("ALTER TABLE profiles ADD COLUMN password_hash VARCHAR(255);"))
                    logger.info("[Migration] Added password_hash column to profiles table.")

        # 2. Movies Table Migrations
        if "movies" in table_names:
            movie_cols = [c["name"] for c in inspector.get_columns("movies")]
            with db_engine.begin() as conn:
                if "media_type" not in movie_cols:
                    conn.execute(text("ALTER TABLE movies ADD COLUMN media_type VARCHAR(20) DEFAULT 'Movie';"))
                    logger.info("[Migration] Added media_type column to movies table.")
                if "number_of_seasons" not in movie_cols:
                    conn.execute(text("ALTER TABLE movies ADD COLUMN number_of_seasons INT;"))
                    logger.info("[Migration] Added number_of_seasons column to movies table.")
                if "number_of_episodes" not in movie_cols:
                    conn.execute(text("ALTER TABLE movies ADD COLUMN number_of_episodes INT;"))
                    logger.info("[Migration] Added number_of_episodes column to movies table.")
                if "language" not in movie_cols:
                    conn.execute(text("ALTER TABLE movies ADD COLUMN language VARCHAR(10) DEFAULT 'hi';"))
                    logger.info("[Migration] Added language column to movies table.")
                if "creator" not in movie_cols:
                    conn.execute(text("ALTER TABLE movies ADD COLUMN creator VARCHAR(255);"))
                    logger.info("[Migration] Added creator column to movies table.")
    except Exception as e:
        logger.warning(f"[Migration Notice] Auto migration check: {e}")

def get_db():
    """FastAPI dependency for database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

