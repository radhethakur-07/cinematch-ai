"""
Hybrid Recommendation Engine with Dynamic Cold-Start Adaptation and Grounded Explainability
"""
from typing import List, Dict, Any, Optional
import numpy as np
from backend.ml.inference.content_engine import ContentEngine
from backend.ml.inference.collaborative_engine import CollaborativeEngine

class HybridRecommender:
    def __init__(
        self,
        content_engine: ContentEngine,
        collaborative_engine: CollaborativeEngine,
        w_content: float = 0.40,
        w_collab: float = 0.30,
        w_user: float = 0.15,
        w_rating: float = 0.10,
        w_recency: float = 0.05
    ):
        self.content_engine = content_engine
        self.collab_engine = collaborative_engine
        self.w_content = w_content
        self.w_collab = w_collab
        self.w_user = w_user
        self.w_rating = w_rating
        self.w_recency = w_recency

    def get_adjusted_weights(self, num_user_ratings: int, has_collab_data: bool) -> Dict[str, float]:
        if num_user_ratings == 0 or not has_collab_data:
            return {
                "w_content": 0.30,
                "w_collab": 0.00,
                "w_user": 0.40,
                "w_rating": 0.20,
                "w_recency": 0.10
            }
        elif num_user_ratings < 5:
            return {
                "w_content": 0.35,
                "w_collab": 0.15,
                "w_user": 0.25,
                "w_rating": 0.15,
                "w_recency": 0.10
            }
        else:
            return {
                "w_content": self.w_content,
                "w_collab": self.w_collab,
                "w_user": self.w_user,
                "w_rating": self.w_rating,
                "w_recency": self.w_recency
            }

    def recommend(
        self,
        user_id: Optional[str],
        candidate_movies: List[Dict[str, Any]],
        user_ratings: Optional[List[Dict[str, Any]]] = None,
        user_likes: Optional[List[Dict[str, Any]]] = None,
        onboarding_genres: Optional[List[str]] = None,
        exclude_movie_ids: Optional[List[int]] = None,
        top_n: int = 20
    ) -> List[Dict[str, Any]]:
        if not candidate_movies:
            return []

        user_ratings = user_ratings or []
        user_likes = user_likes or []
        onboarding_genres = onboarding_genres or []
        exclude_set = set(exclude_movie_ids or [])
        
        for r in user_ratings:
            exclude_set.add(r["movie_id"])
        for l in user_likes:
            if not l.get("is_like", True):
                exclude_set.add(l["movie_id"])

        user_profile_vec = self.content_engine.build_user_vector(user_ratings, onboarding_genres)
        if user_profile_vec is not None and self.content_engine.tfidf_matrix is not None:
            raw_content_scores = self.content_engine.score_user_profile(user_profile_vec)
        else:
            raw_content_scores = np.zeros(len(candidate_movies))

        candidate_ids = [m["id"] for m in candidate_movies]
        collab_scores_map = self.collab_engine.score_all_movies(user_id, candidate_ids, user_ratings)
        has_collab = any(score > 0.01 for score in collab_scores_map.values())

        weights = self.get_adjusted_weights(len(user_ratings), has_collab)

        preferred_genres_set = set([g.lower() for g in onboarding_genres])
        favorite_rated_titles = []
        for r in user_ratings:
            if r.get("rating", 0) >= 4.0:
                m_match = next((m for m in candidate_movies if m["id"] == r["movie_id"]), None)
                if m_match:
                    favorite_rated_titles.append(m_match.get("title", ""))
                    for g in m_match.get("genres", []):
                        g_name = g if isinstance(g, str) else g.get("name", "")
                        if g_name:
                            preferred_genres_set.add(g_name.lower())

        max_pop = max([float(m.get("popularity", 1.0)) for m in candidate_movies] or [1.0])
        max_pop = max(max_pop, 1.0)

        scored_candidates = []
        for idx, movie in enumerate(candidate_movies):
            m_id = movie["id"]
            if m_id in exclude_set:
                continue

            if self.content_engine.movie_id_to_idx and m_id in self.content_engine.movie_id_to_idx:
                c_idx = self.content_engine.movie_id_to_idx[m_id]
                s_content = float(raw_content_scores[c_idx]) if c_idx < len(raw_content_scores) else 0.0
            else:
                s_content = 0.0
            s_content = max(0.0, min(1.0, s_content))

            s_collab = collab_scores_map.get(m_id, 0.0)

            movie_genres = [g if isinstance(g, str) else g.get("name", "") for g in movie.get("genres", [])]
            genre_overlap = sum(1 for g in movie_genres if g.lower() in preferred_genres_set)
            s_user = min(1.0, genre_overlap / max(1, len(preferred_genres_set))) if preferred_genres_set else 0.5

            vote_avg = float(movie.get("vote_average", 7.0))
            s_rating = min(1.0, max(0.0, vote_avg / 10.0))

            pop = float(movie.get("popularity", 0.0))
            s_popularity = min(1.0, pop / max_pop)

            total_score = (
                weights["w_content"] * s_content +
                weights["w_collab"] * s_collab +
                weights["w_user"] * s_user +
                weights["w_rating"] * s_rating +
                weights["w_recency"] * s_popularity
            )

            match_percentage = int(np.clip(round(50 + (total_score * 48)), 55, 98))

            reasons = []
            if favorite_rated_titles and s_content > 0.15:
                ref_title = favorite_rated_titles[0]
                reasons.append(f"Shares thematic DNA with {ref_title}")
            
            matched_g = [g for g in movie_genres if g.lower() in preferred_genres_set]
            if matched_g:
                reasons.append(f"Matches your affinity for {matched_g[0]}")

            if s_collab > 0.4:
                reasons.append("Loved by viewers with similar cinematic taste")

            if vote_avg >= 8.0:
                reasons.append(f"Masterpiece acclaim ({vote_avg}★ community score)")
            elif vote_avg >= 7.5:
                reasons.append(f"Highly rated ({vote_avg}★ score)")

            if not reasons:
                reasons.append("Popular recommendation aligned with your profile")

            scored_candidates.append({
                **movie,
                "score": round(float(total_score), 4),
                "match_percentage": match_percentage,
                "reasons": reasons[:3],
                "score_breakdown": {
                    "content": round(s_content, 3),
                    "collaborative": round(s_collab, 3),
                    "user_preference": round(s_user, 3),
                    "quality_rating": round(s_rating, 3)
                }
            })

        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        return scored_candidates[:top_n]
