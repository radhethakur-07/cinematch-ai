import uuid
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, BigInteger,
    Boolean, DateTime, ForeignKey, Date, JSON, Table, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(Text, nullable=True)
    is_admin = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    ratings = relationship("Rating", back_populates="profile", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="profile", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="profile", cascade="all, delete-orphan")
    history = relationship("WatchHistory", back_populates="profile", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="profile", uselist=False, cascade="all, delete-orphan")

class Genre(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)

    movies = relationship("Movie", secondary="movie_genres", back_populates="genres")

class MovieGenre(Base):
    __tablename__ = "movie_genres"
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), primary_key=True)
    genre_id = Column(Integer, ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True)

class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True) # TMDB movie ID
    title = Column(String(255), nullable=False)
    original_title = Column(String(255), nullable=True)
    overview = Column(Text, nullable=True)
    release_date = Column(Date, nullable=True)
    poster_path = Column(String(255), nullable=True)
    backdrop_path = Column(String(255), nullable=True)
    vote_average = Column(Numeric(3, 1), default=0.0)
    vote_count = Column(Integer, default=0)
    popularity = Column(Numeric(10, 2), default=0.0)
    runtime = Column(Integer, nullable=True)
    tagline = Column(Text, nullable=True)
    status = Column(String(50), default="Released")
    trailer_url = Column(String(255), nullable=True)
    budget = Column(BigInteger, default=0)
    revenue = Column(BigInteger, default=0)
    media_type = Column(String(20), default="Movie")
    number_of_seasons = Column(Integer, nullable=True)
    number_of_episodes = Column(Integer, nullable=True)
    language = Column(String(50), default="hi")
    creator = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    genres = relationship("Genre", secondary="movie_genres", back_populates="movies")
    cast = relationship("MovieCast", back_populates="movie", cascade="all, delete-orphan")
    directors = relationship("MovieDirector", back_populates="movie", cascade="all, delete-orphan")
    keywords = relationship("MovieKeyword", back_populates="movie", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="movie", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="movie", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="movie", cascade="all, delete-orphan")

class MovieCast(Base):
    __tablename__ = "movie_cast"
    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    character = Column(String(255), nullable=True)
    profile_path = Column(String(255), nullable=True)
    cast_order = Column(Integer, default=0)

    movie = relationship("Movie", back_populates="cast")

class MovieDirector(Base):
    __tablename__ = "movie_directors"
    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    profile_path = Column(String(255), nullable=True)

    movie = relationship("Movie", back_populates="directors")

class MovieKeyword(Base):
    __tablename__ = "movie_keywords"
    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    keyword = Column(String(100), nullable=False)

    movie = relationship("Movie", back_populates="keywords")

class Rating(Base):
    __tablename__ = "ratings"
    __table_args__ = (UniqueConstraint("user_id", "movie_id", name="uq_user_movie_rating"),)

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Numeric(2, 1), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("Profile", back_populates="ratings")
    movie = relationship("Movie", back_populates="ratings")

class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "movie_id", name="uq_user_movie_like"),)

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    is_like = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="likes")
    movie = relationship("Movie", back_populates="likes")

class Watchlist(Base):
    __tablename__ = "watchlist"
    __table_args__ = (UniqueConstraint("user_id", "movie_id", name="uq_user_movie_watchlist"),)

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="watchlist")
    movie = relationship("Movie", back_populates="watchlist")

class WatchHistory(Base):
    __tablename__ = "watch_history"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    interaction_type = Column(String(50), nullable=False) # view, rate, like, watchlist, rec_click
    metadata_info = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="history")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    favorite_genres = Column(JSON, default=[]) # Stored as JSON list of genre IDs or names
    preferred_languages = Column(JSON, default=["en"])
    preferred_decades = Column(JSON, default=[])
    mood_preferences = Column(JSON, default=[])
    onboarding_done = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("Profile", back_populates="preferences")

class RecommendationEvent(Base):
    __tablename__ = "recommendation_events"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    recommendation_type = Column(String(50), nullable=False)
    query_prompt = Column(Text, nullable=True)
    recommended_movie_ids = Column(JSON, default=[])
    clicked_movie_id = Column(Integer, nullable=True)
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
