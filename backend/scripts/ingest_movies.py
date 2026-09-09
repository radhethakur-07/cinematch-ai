"""
TMDB Movie Ingestion CLI Script
Paginates through TMDB popular, top rated, and trending movies, fetches deep metadata
(cast, directors, keywords, videos) and upserts them directly into the PostgreSQL database.
"""
import os
import sys
import time
import argparse
from pathlib import Path

# Add backend directory to sys.path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
from app.models.db_models import Movie, Genre, MovieGenre, MovieCast, MovieDirector, MovieKeyword

TMDB_BASE = "https://api.themoviedb.org/3"

def fetch_tmdb(endpoint: str, params: dict, api_key: str):
    p = {"api_key": api_key, "language": "en-US"}
    p.update(params)
    resp = httpx.get(f"{TMDB_BASE}{endpoint}", params=p, timeout=15.0)
    if resp.status_code == 200:
        return resp.json()
    print(f"[Warning] TMDB {endpoint} returned {resp.status_code}: {resp.text[:100]}")
    return None

def ingest_genres(db: Session, api_key: str):
    print("[Ingest] Fetching official TMDB genres...")
    data = fetch_tmdb("/genre/movie/list", {}, api_key)
    if not data or "genres" not in data:
        return
    for g in data["genres"]:
        existing = db.query(Genre).filter(Genre.id == g["id"]).first()
        if not existing:
            genre_obj = Genre(id=g["id"], name=g["name"])
            db.add(genre_obj)
    db.commit()
    print(f"[Ingest] Ingested {len(data['genres'])} genres.")

def ingest_movie_batch(db: Session, api_key: str, endpoint: str, pages: int = 3):
    print(f"[Ingest] Ingesting from {endpoint} for {pages} pages...")
    ingested_count = 0
    
    for page in range(1, pages + 1):
        print(f" -> Fetching page {page} of {pages}...")
        data = fetch_tmdb(endpoint, {"page": page}, api_key)
        if not data or "results" not in data:
            continue
            
        for item in data["results"]:
            m_id = item["id"]
            
            # Fetch full details including credits, keywords, videos
            details = fetch_tmdb(f"/movie/{m_id}", {"append_to_response": "credits,keywords,videos"}, api_key)
            if not details:
                continue

            # Trailer url extraction
            trailer_url = None
            if "videos" in details and "results" in details["videos"]:
                for vid in details["videos"]["results"]:
                    if vid.get("site") == "YouTube" and vid.get("type") in ["Trailer", "Teaser"]:
                        trailer_url = f"https://www.youtube.com/watch?v={vid.get('key')}"
                        break

            # Upsert movie
            movie = db.query(Movie).filter(Movie.id == m_id).first()
            if not movie:
                movie = Movie(id=m_id)
                db.add(movie)

            movie.title = details.get("title") or item.get("title", "")
            movie.original_title = details.get("original_title")
            movie.overview = details.get("overview")
            movie.release_date = details.get("release_date") or None
            movie.poster_path = details.get("poster_path")
            movie.backdrop_path = details.get("backdrop_path")
            movie.vote_average = float(details.get("vote_average", 0.0))
            movie.vote_count = int(details.get("vote_count", 0))
            movie.popularity = float(details.get("popularity", 0.0))
            movie.runtime = details.get("runtime")
            movie.tagline = details.get("tagline")
            movie.status = details.get("status", "Released")
            movie.trailer_url = trailer_url
            movie.budget = details.get("budget", 0)
            movie.revenue = details.get("revenue", 0)
            db.commit()

            # Link genres
            if "genres" in details:
                for g in details["genres"]:
                    existing_link = db.query(MovieGenre).filter(
                        MovieGenre.movie_id == m_id,
                        MovieGenre.genre_id == g["id"]
                    ).first()
                    if not existing_link:
                        db.add(MovieGenre(movie_id=m_id, genre_id=g["id"]))

            # Insert Cast (Top 6)
            if "credits" in details and "cast" in details["credits"]:
                # Clear previous cast for clean update
                db.query(MovieCast).filter(MovieCast.movie_id == m_id).delete()
                for c in details["credits"]["cast"][:6]:
                    db.add(MovieCast(
                        movie_id=m_id,
                        name=c.get("name", ""),
                        character=c.get("character"),
                        profile_path=c.get("profile_path"),
                        cast_order=c.get("order", 0)
                    ))

            # Insert Directors
            if "credits" in details and "crew" in details["credits"]:
                db.query(MovieDirector).filter(MovieDirector.movie_id == m_id).delete()
                for crew in details["credits"]["crew"]:
                    if crew.get("job") == "Director":
                        db.add(MovieDirector(
                            movie_id=m_id,
                            name=crew.get("name", ""),
                            profile_path=crew.get("profile_path")
                        ))

            # Insert Keywords (Top 8)
            kw_data = details.get("keywords", {}).get("keywords", [])
            if kw_data:
                db.query(MovieKeyword).filter(MovieKeyword.movie_id == m_id).delete()
                for kw in kw_data[:8]:
                    db.add(MovieKeyword(
                        movie_id=m_id,
                        keyword=kw.get("name", "").lower()
                    ))

            db.commit()
            ingested_count += 1
            time.sleep(0.1) # Respect TMDB rate limits

    print(f"[Ingest] Successfully ingested {ingested_count} movies from {endpoint}.")

def main():
    parser = argparse.ArgumentParser(description="Ingest movies from TMDB API into CineMatch AI database.")
    parser.add_argument("--pages", type=int, default=3, help="Number of pages to ingest per category (20 movies/page)")
    parser.add_argument("--api-key", type=str, default="", help="TMDB API v3 Key (defaults to TMDB_API_KEY env)")
    args = parser.parse_args()

    api_key = args.api_key or settings.TMDB_API_KEY
    if not api_key:
        print("[Error] TMDB_API_KEY is required. Pass --api-key or set in .env file.")
        sys.exit(1)

    print("[CineMatch AI] Starting TMDB Data Ingestion...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ingest_genres(db, api_key)
        ingest_movie_batch(db, api_key, "/movie/popular", pages=args.pages)
        ingest_movie_batch(db, api_key, "/movie/top_rated", pages=args.pages)
        ingest_movie_batch(db, api_key, "/trending/movie/week", pages=args.pages)
        print("[CineMatch AI] Ingestion completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    main()
