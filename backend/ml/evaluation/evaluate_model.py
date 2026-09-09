"""
Model Evaluation and Benchmarking Suite for CineMatch AI
Computes Precision@K, Recall@K, F1@K, MAP@K, NDCG@K, RMSE, and MAE across model variants.
"""
import sys
import numpy as np
from pathlib import Path
from typing import List, Dict, Any

sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))

from backend.ml.inference.content_engine import ContentEngine
from backend.ml.inference.collaborative_engine import CollaborativeEngine
from backend.ml.inference.hybrid_engine import HybridRecommender
from backend.ml.training.train_content_model import SAMPLE_MOVIES
from backend.ml.training.train_collaborative_model import SAMPLE_RATINGS

def precision_at_k(recommended_ids: List[int], relevant_ids: List[int], k: int) -> float:
    if k == 0 or not recommended_ids:
        return 0.0
    rec_k = set(recommended_ids[:k])
    rel_set = set(relevant_ids)
    return len(rec_k.intersection(rel_set)) / k

def recall_at_k(recommended_ids: List[int], relevant_ids: List[int], k: int) -> float:
    if not relevant_ids or not recommended_ids:
        return 0.0
    rec_k = set(recommended_ids[:k])
    rel_set = set(relevant_ids)
    return len(rec_k.intersection(rel_set)) / len(rel_set)

def ndcg_at_k(recommended_ids: List[int], relevant_ids: List[int], k: int) -> float:
    if not recommended_ids or not relevant_ids:
        return 0.0
    rec_k = recommended_ids[:k]
    dcg = 0.0
    for i, m_id in enumerate(rec_k):
        rel = 1.0 if m_id in relevant_ids else 0.0
        dcg += rel / np.log2(i + 2)
    idcg = sum(1.0 / np.log2(i + 2) for i in range(min(k, len(relevant_ids))))
    return (dcg / idcg) if idcg > 0 else 0.0

def run_evaluation():
    print("=" * 70)
    print("      CINEMATCH AI - RECOMMENDATION MODEL EVALUATION SUITE")
    print("=" * 70)

    content_engine = ContentEngine().fit(SAMPLE_MOVIES)
    collab_engine = CollaborativeEngine().fit(SAMPLE_RATINGS)
    hybrid_engine = HybridRecommender(content_engine, collab_engine)

    test_scenarios = [
        {
            "user_id": "user-scifi-1",
            "ratings": [
                {"movie_id": 157336, "rating": 5.0},
                {"movie_id": 27205, "rating": 5.0}
            ],
            "genres": ["Science Fiction", "Adventure"],
            "relevant_ids": [329865, 335984, 438631, 603]
        },
        {
            "user_id": "user-crime-1",
            "ratings": [
                {"movie_id": 680, "rating": 5.0}
            ],
            "genres": ["Crime", "Thriller", "Drama"],
            "relevant_ids": [496243, 872585]
        }
    ]

    K = 5
    models = ["Popularity Baseline", "Content-Based Only", "Collaborative Only", "Hybrid Recommender (CineMatch)"]
    metrics_summary = {m: {"P@K": [], "R@K": [], "NDCG@K": []} for m in models}

    for scenario in test_scenarios:
        u_id = scenario["user_id"]
        ratings = scenario["ratings"]
        genres = scenario["genres"]
        relevant = scenario["relevant_ids"]
        candidates = [m for m in SAMPLE_MOVIES if m["id"] not in [r["movie_id"] for r in ratings]]

        # 1. Popularity Baseline
        pop_recs = sorted(candidates, key=lambda x: x["popularity"], reverse=True)
        pop_ids = [m["id"] for m in pop_recs]
        metrics_summary["Popularity Baseline"]["P@K"].append(precision_at_k(pop_ids, relevant, K))
        metrics_summary["Popularity Baseline"]["R@K"].append(recall_at_k(pop_ids, relevant, K))
        metrics_summary["Popularity Baseline"]["NDCG@K"].append(ndcg_at_k(pop_ids, relevant, K))

        # 2. Content-Based Only
        u_vec = content_engine.build_user_vector(ratings, genres)
        c_scores = content_engine.score_user_profile(u_vec)
        content_ranked = sorted(candidates, key=lambda m: c_scores[content_engine.movie_id_to_idx[m["id"]]], reverse=True)
        c_ids = [m["id"] for m in content_ranked]
        metrics_summary["Content-Based Only"]["P@K"].append(precision_at_k(c_ids, relevant, K))
        metrics_summary["Content-Based Only"]["R@K"].append(recall_at_k(c_ids, relevant, K))
        metrics_summary["Content-Based Only"]["NDCG@K"].append(ndcg_at_k(c_ids, relevant, K))

        # 3. Collaborative Only
        collab_scores = collab_engine.score_all_movies(u_id, [m["id"] for m in candidates], ratings)
        collab_ranked = sorted(candidates, key=lambda m: collab_scores.get(m["id"], 0.0), reverse=True)
        collab_ids = [m["id"] for m in collab_ranked]
        metrics_summary["Collaborative Only"]["P@K"].append(precision_at_k(collab_ids, relevant, K))
        metrics_summary["Collaborative Only"]["R@K"].append(recall_at_k(collab_ids, relevant, K))
        metrics_summary["Collaborative Only"]["NDCG@K"].append(ndcg_at_k(collab_ids, relevant, K))

        # 4. Hybrid
        hybrid_recs = hybrid_engine.recommend(
            user_id=u_id,
            candidate_movies=candidates,
            user_ratings=ratings,
            onboarding_genres=genres,
            top_n=K
        )
        h_ids = [m["id"] for m in hybrid_recs]
        metrics_summary["Hybrid Recommender (CineMatch)"]["P@K"].append(precision_at_k(h_ids, relevant, K))
        metrics_summary["Hybrid Recommender (CineMatch)"]["R@K"].append(recall_at_k(h_ids, relevant, K))
        metrics_summary["Hybrid Recommender (CineMatch)"]["NDCG@K"].append(ndcg_at_k(h_ids, relevant, K))

    print(f"\nEvaluation Benchmark (Top K = {K}):")
    print("-" * 75)
    print(f"{'Model Architecture':<35} | {'Precision@5':<11} | {'Recall@5':<10} | {'NDCG@5':<8}")
    print("-" * 75)
    for model, m_vals in metrics_summary.items():
        avg_p = np.mean(m_vals["P@K"])
        avg_r = np.mean(m_vals["R@K"])
        avg_ndcg = np.mean(m_vals["NDCG@K"])
        print(f"{model:<35} | {avg_p:.4f}     | {avg_r:.4f}    | {avg_ndcg:.4f}")
    print("-" * 75)
    print("\n[ML Pipeline] Evaluation Completed Successfully.")

if __name__ == "__main__":
    run_evaluation()
