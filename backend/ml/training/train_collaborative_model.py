"""
Train and persist Collaborative Filtering model.
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.inference.collaborative_engine import CollaborativeEngine

SAMPLE_RATINGS = [
    {"user_id": "user-scifi-1", "movie_id": 157336, "rating": 5.0},
    {"user_id": "user-scifi-1", "movie_id": 27205, "rating": 5.0},
    {"user_id": "user-scifi-1", "movie_id": 329865, "rating": 4.5},
    {"user_id": "user-scifi-1", "movie_id": 335984, "rating": 4.0},
    {"user_id": "user-scifi-1", "movie_id": 680, "rating": 2.0},
    
    {"user_id": "user-scifi-2", "movie_id": 157336, "rating": 4.5},
    {"user_id": "user-scifi-2", "movie_id": 438631, "rating": 5.0},
    {"user_id": "user-scifi-2", "movie_id": 603, "rating": 4.5},
    {"user_id": "user-scifi-2", "movie_id": 27205, "rating": 4.0},
    
    {"user_id": "user-crime-1", "movie_id": 680, "rating": 5.0},
    {"user_id": "user-crime-1", "movie_id": 496243, "rating": 5.0},
    {"user_id": "user-crime-1", "movie_id": 157336, "rating": 2.0},
    
    {"user_id": "user-crime-2", "movie_id": 680, "rating": 4.5},
    {"user_id": "user-crime-2", "movie_id": 496243, "rating": 4.5},
    {"user_id": "user-crime-2", "movie_id": 872585, "rating": 4.0},
    
    {"user_id": "user-general-1", "movie_id": 872585, "rating": 5.0},
    {"user_id": "user-general-1", "movie_id": 545611, "rating": 4.5},
    {"user_id": "user-general-1", "movie_id": 157336, "rating": 4.5},
    {"user_id": "user-general-1", "movie_id": 27205, "rating": 4.5}
]

def train_collaborative_model(ratings_data=None, output_path="backend/ml/models/collaborative_model.joblib"):
    print("[ML Pipeline] Training Collaborative Filtering Model...")
    ratings = ratings_data if ratings_data is not None else SAMPLE_RATINGS
    engine = CollaborativeEngine(n_components=5)
    engine.fit(ratings)
    
    engine.save_model(output_path)
    print(f"[ML Pipeline] Successfully saved model to {output_path}")
    return engine

if __name__ == "__main__":
    train_collaborative_model()
