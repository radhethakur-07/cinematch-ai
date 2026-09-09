from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from backend.app.core.config import settings

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

def get_db():
    """FastAPI dependency for database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
