import time
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.services.movie_service import movie_service
from app.services.ai_service import ai_service
from ml.inference.content_engine import ContentEngine
from ml.inference.collaborative_engine import CollaborativeEngine
from ml.inference.hybrid_engine import HybridRecommender
from app.models.db_models import Rating, Like, UserPreference, RecommendationEvent, Watchlist
from app.core.logging import logger

class RecommendationService:
    def __init__(self):
        self.content_engine = ContentEngine()
        self.collab_engine = CollaborativeEngine()
        self.hybrid_engine = HybridRecommender(self.content_engine, self.collab_engine)
        self.is_initialized = False

    def initialize(self, movies: List[Dict[str, Any]], ratings: Optional[List[Dict[str, Any]]] = None):
        """Fit or warm up models in memory."""
        try:
            self.content_engine.fit(movies)
            if ratings:
                self.collab_engine.fit(ratings)
            self.hybrid_engine = HybridRecommender(self.content_engine, self.collab_engine)
            self.is_initialized = True
            logger.info(f"[RecommendationService] ML Models initialized with {len(movies)} movies.")
        except Exception as e:
            logger.error(f"[RecommendationService] Initialization failed: {e}")

    def _ensure_initialized(self, db: Session):
        if not self.is_initialized:
            movies = movie_service.get_all_movies(db)
            ratings = []
            try:
                db_ratings = db.query(Rating).all()
                ratings = [{"user_id": r.user_id, "movie_id": r.movie_id, "rating": float(r.rating)} for r in db_ratings]
            except Exception:
                pass
            self.initialize(movies, ratings)

    def get_similar_movies(self, db: Session, movie_id: int, top_n: int = 10) -> List[Dict[str, Any]]:
        """Get 'More Like This' movie recommendations with grounded content similarity."""
        self._ensure_initialized(db)
        similar_items = self.content_engine.get_similar_movies(movie_id, top_n=top_n)
        if not similar_items:
            # Fallback to general high popularity in same genre
            source = movie_service.get_movie_by_id(db, movie_id)
            all_m = movie_service.get_all_movies(db)
            source_genres = set(g["name"] for g in source.get("genres", []))
            matches = [m for m in all_m if m["id"] != movie_id and any(g["name"] in source_genres for g in m.get("genres", []))]
            return sorted(matches, key=lambda x: x["popularity"], reverse=True)[:top_n]

        # Hydrate with full movie objects
        all_movies_map = {m["id"]: m for m in movie_service.get_all_movies(db)}
        hydrated = []
        for item in similar_items:
            m_id = item["movie_id"]
            if m_id in all_movies_map:
                full_m = all_movies_map[m_id]
                match_pct = int(round(50 + (item["similarity_score"] * 48)))
                hydrated.append({
                    **full_m,
                    "match_percentage": match_pct,
                    "reasons": [f"High content similarity ({int(item['similarity_score']*100)}%) with source movie"]
                })
        return hydrated

    def get_personalized_recommendations(
        self,
        db: Session,
        user_id: Optional[str] = None,
        top_n: int = 20
    ) -> Dict[str, Any]:
        """Generate personalized hybrid recommendations."""
        start_time = time.time()
        self._ensure_initialized(db)

        all_movies = movie_service.get_all_movies(db)
        user_ratings = []
        user_likes = []
        onboarding_genres = []

        if user_id:
            try:
                ratings_q = db.query(Rating).filter(Rating.user_id == user_id).all()
                user_ratings = [{"movie_id": r.movie_id, "rating": float(r.rating)} for r in ratings_q]

                likes_q = db.query(Like).filter(Like.user_id == user_id).all()
                user_likes = [{"movie_id": l.movie_id, "is_like": l.is_like} for l in likes_q]

                pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
                if pref and pref.favorite_genres:
                    onboarding_genres = [str(g) for g in pref.favorite_genres]
            except Exception:
                pass

        recommendations = self.hybrid_engine.recommend(
            user_id=user_id,
            candidate_movies=all_movies,
            user_ratings=user_ratings,
            user_likes=user_likes,
            onboarding_genres=onboarding_genres,
            top_n=top_n
        )

        rec_type = "cold_start" if len(user_ratings) == 0 else "hybrid"
        latency_ms = int((time.time() - start_time) * 1000)

        # Log recommendation event telemetry
        try:
            event = RecommendationEvent(
                user_id=user_id,
                recommendation_type=rec_type,
                recommended_movie_ids=[r["id"] for r in recommendations[:10]],
                latency_ms=latency_ms
            )
            db.add(event)
            db.commit()
        except Exception:
            db.rollback()

        return {
            "success": True,
            "recommendations": recommendations,
            "total": len(recommendations),
            "recommendation_type": rec_type,
            "applied_weights": self.hybrid_engine.get_adjusted_weights(len(user_ratings), self.collab_engine.is_fitted)
        }

    async def get_mood_recommendations(
        self,
        db: Session,
        prompt: str,
        user_id: Optional[str] = None,
        top_n: int = 15
    ) -> Dict[str, Any]:
        """Convert natural language to structured intent and rank using recommendation engine."""
        self._ensure_initialized(db)
        intent, fallback_used = await ai_service.parse_natural_language_intent(prompt)
        all_movies = movie_service.get_all_movies(db)

        # Filter candidates matching intent criteria
        candidates = []
        intent_genres = set([g.lower() for g in intent.genres])
        similar_titles = [s.lower() for s in intent.similar_to]

        for m in all_movies:
            movie_genres = [g["name"].lower() for g in m.get("genres", [])]
            genre_match = any(g in intent_genres for g in movie_genres) if intent_genres else True
            runtime_match = (m.get("runtime") or 120) <= intent.max_runtime if intent.max_runtime else True
            rating_match = float(m.get("vote_average", 0)) >= (intent.min_rating or 6.0)

            if (genre_match or any(ref in m["title"].lower() for ref in similar_titles)) and runtime_match:
                candidates.append(m)

        if not candidates:
            candidates = all_movies # Fallback to all if overly constrained

        # Hybrid ranking with intent genres as priority profile
        recommendations = self.hybrid_engine.recommend(
            user_id=user_id,
            candidate_movies=candidates,
            onboarding_genres=intent.genres,
            top_n=top_n
        )

        return {
            "success": True,
            "prompt": prompt,
            "structured_intent": intent,
            "recommendations": recommendations,
            "ai_provider": "Google Gemini" if not fallback_used else "Heuristic NLP Engine",
            "fallback_used": fallback_used
        }

recommendation_service = RecommendationService()
