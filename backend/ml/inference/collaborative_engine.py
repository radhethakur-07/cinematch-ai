"""
Collaborative Filtering Recommendation Engine
Implements Item-Based Collaborative Filtering and Matrix Factorization (Truncated SVD).
"""
import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeEngine:
    def __init__(self, n_components: int = 10):
        self.n_components = n_components
        self.user_item_matrix: Optional[pd.DataFrame] = None
        self.item_similarity_df: Optional[pd.DataFrame] = None
        self.svd_model: Optional[TruncatedSVD] = None
        self.user_factors: Optional[np.ndarray] = None
        self.item_factors: Optional[np.ndarray] = None
        self.is_fitted = False

    def fit(self, ratings: List[Dict[str, Any]]) -> "CollaborativeEngine":
        if not ratings or len(ratings) < 3:
            self.is_fitted = False
            return self

        df = pd.DataFrame(ratings)
        df["rating"] = pd.to_numeric(df["rating"])
        df["movie_id"] = df["movie_id"].astype(int)

        pivot = df.pivot_table(index="user_id", columns="movie_id", values="rating", fill_value=0.0)
        self.user_item_matrix = pivot

        item_matrix = pivot.T
        if item_matrix.shape[0] > 1:
            item_sim = cosine_similarity(item_matrix)
            self.item_similarity_df = pd.DataFrame(
                item_sim,
                index=item_matrix.index,
                columns=item_matrix.index
            )

        min_dim = min(pivot.shape)
        if min_dim >= 2:
            k = min(self.n_components, min_dim - 1)
            if k >= 1:
                self.svd_model = TruncatedSVD(n_components=k, random_state=42)
                self.user_factors = self.svd_model.fit_transform(pivot)
                self.item_factors = self.svd_model.components_
                self.is_fitted = True
            else:
                self.is_fitted = False
        else:
            self.is_fitted = False

        return self

    def predict_user_movie_score(self, user_id: str, movie_id: int, user_ratings: Optional[List[Dict[str, Any]]] = None) -> float:
        if not self.is_fitted or self.item_similarity_df is None:
            return 0.0

        if movie_id not in self.item_similarity_df.columns:
            return 0.0

        if self.user_item_matrix is not None and user_id in self.user_item_matrix.index:
            user_ratings_series = self.user_item_matrix.loc[user_id]
            rated_movies = user_ratings_series[user_ratings_series > 0]
            if not rated_movies.empty:
                similarities = self.item_similarity_df.loc[movie_id, rated_movies.index]
                sim_sum = similarities.abs().sum()
                if sim_sum > 0:
                    predicted = np.dot(similarities, rated_movies.values) / sim_sum
                    return float(np.clip(predicted / 5.0, 0.0, 1.0))

        if user_ratings:
            rated_ids = [r["movie_id"] for r in user_ratings if r["movie_id"] in self.item_similarity_df.columns]
            if rated_ids:
                sims = self.item_similarity_df.loc[movie_id, rated_ids]
                vals = np.array([r["rating"] for r in user_ratings if r["movie_id"] in rated_ids])
                sim_sum = sims.abs().sum()
                if sim_sum > 0:
                    predicted = np.dot(sims, vals) / sim_sum
                    return float(np.clip(predicted / 5.0, 0.0, 1.0))

        return 0.0

    def score_all_movies(self, user_id: Optional[str], candidate_movie_ids: List[int], user_ratings: Optional[List[Dict[str, Any]]] = None) -> Dict[int, float]:
        scores = {}
        for m_id in candidate_movie_ids:
            scores[m_id] = self.predict_user_movie_score(user_id or "", m_id, user_ratings)
        return scores

    def save_model(self, file_path: str):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        joblib.dump({
            "user_item_matrix": self.user_item_matrix,
            "item_similarity_df": self.item_similarity_df,
            "svd_model": self.svd_model,
            "is_fitted": self.is_fitted
        }, file_path)

    @classmethod
    def load_model(cls, file_path: str) -> "CollaborativeEngine":
        data = joblib.load(file_path)
        engine = cls()
        engine.user_item_matrix = data.get("user_item_matrix")
        engine.item_similarity_df = data.get("item_similarity_df")
        engine.svd_model = data.get("svd_model")
        engine.is_fitted = data.get("is_fitted", False)
        return engine
