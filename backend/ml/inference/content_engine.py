"""
Content-Based Recommendation Engine using TF-IDF and Cosine Similarity
"""
import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ml.preprocessing.text_normalizer import build_soup, clean_text

class ContentEngine:
    def __init__(self, max_features: int = 10000, ngram_range: Tuple[int, int] = (1, 2)):
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            stop_words="english",
            sublinear_tf=True
        )
        self.tfidf_matrix = None
        self.movies_df: Optional[pd.DataFrame] = None
        self.movie_id_to_idx: Dict[int, int] = {}
        self.idx_to_movie_id: Dict[int, int] = {}
        self.similarity_matrix = None

    def fit(self, movies: List[Dict[str, Any]]) -> "ContentEngine":
        """Fit TF-IDF matrix on movie list."""
        if not movies:
            return self
        
        records = []
        for m in movies:
            records.append({
                "id": m["id"],
                "title": m.get("title", ""),
                "vote_average": float(m.get("vote_average", 0.0)),
                "popularity": float(m.get("popularity", 0.0)),
                "genres": [g if isinstance(g, str) else g.get("name", "") for g in m.get("genres", [])],
                "directors": [d if isinstance(d, str) else d.get("name", "") for d in m.get("directors", [])],
                "keywords": [k if isinstance(k, str) else k.get("keyword", "") for k in m.get("keywords", [])],
                "soup": build_soup(m)
            })
        
        self.movies_df = pd.DataFrame(records)
        self.movie_id_to_idx = {row["id"]: idx for idx, row in self.movies_df.iterrows()}
        self.idx_to_movie_id = {idx: row["id"] for idx, row in self.movies_df.iterrows()}
        
        self.tfidf_matrix = self.vectorizer.fit_transform(self.movies_df["soup"])
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        return self

    def get_similar_movies(self, movie_id: int, top_n: int = 10) -> List[Dict[str, Any]]:
        """Get top-N similar movies for a given movie_id."""
        if self.similarity_matrix is None or movie_id not in self.movie_id_to_idx:
            return []
        
        idx = self.movie_id_to_idx[movie_id]
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = [s for s in sim_scores if s[0] != idx][:top_n]
        
        results = []
        for i, score in sim_scores:
            m_id = self.idx_to_movie_id[i]
            movie_row = self.movies_df.iloc[i]
            results.append({
                "movie_id": int(m_id),
                "title": movie_row["title"],
                "similarity_score": round(float(score), 4),
                "vote_average": float(movie_row["vote_average"]),
                "genres": movie_row["genres"],
                "directors": movie_row["directors"]
            })
        return results

    def score_user_profile(self, user_profile_vector: np.ndarray) -> np.ndarray:
        """Compute cosine similarity between a user preference vector and all movies."""
        if self.tfidf_matrix is None or user_profile_vector is None:
            return np.zeros(len(self.movies_df) if self.movies_df is not None else 0)
        
        user_vector_reshaped = user_profile_vector.reshape(1, -1)
        scores = cosine_similarity(user_vector_reshaped, self.tfidf_matrix).flatten()
        return scores

    def build_user_vector(self, user_ratings: List[Dict[str, Any]], onboarding_genres: List[str] = None) -> Optional[np.ndarray]:
        """Build a weighted user taste vector."""
        if self.tfidf_matrix is None or self.movies_df is None:
            return None
            
        vectors = []
        weights = []
        
        for r in user_ratings:
            m_id = r.get("movie_id")
            rating = float(r.get("rating", 3.0))
            if m_id in self.movie_id_to_idx:
                idx = self.movie_id_to_idx[m_id]
                weight = rating - 2.5
                vectors.append(self.tfidf_matrix[idx].toarray()[0])
                weights.append(weight)
        
        if onboarding_genres:
            genre_text = " ".join([clean_text(g) for g in onboarding_genres])
            if genre_text:
                genre_vec = self.vectorizer.transform([f"{genre_text} {genre_text}"]).toarray()[0]
                vectors.append(genre_vec)
                weights.append(1.5)
                
        if not vectors:
            return None
            
        vectors = np.array(vectors)
        weights = np.array(weights).reshape(-1, 1)
        user_vec = np.sum(vectors * weights, axis=0)
        norm = np.linalg.norm(user_vec)
        if norm > 0:
            user_vec = user_vec / norm
        return user_vec

    def save_model(self, file_path: str):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        joblib.dump({
            "vectorizer": self.vectorizer,
            "tfidf_matrix": self.tfidf_matrix,
            "movies_df": self.movies_df,
            "movie_id_to_idx": self.movie_id_to_idx,
            "idx_to_movie_id": self.idx_to_movie_id,
            "similarity_matrix": self.similarity_matrix
        }, file_path)

    @classmethod
    def load_model(cls, file_path: str) -> "ContentEngine":
        data = joblib.load(file_path)
        engine = cls()
        engine.vectorizer = data["vectorizer"]
        engine.tfidf_matrix = data["tfidf_matrix"]
        engine.movies_df = data["movies_df"]
        engine.movie_id_to_idx = data["movie_id_to_idx"]
        engine.idx_to_movie_id = data["idx_to_movie_id"]
        engine.similarity_matrix = data["similarity_matrix"]
        return engine
