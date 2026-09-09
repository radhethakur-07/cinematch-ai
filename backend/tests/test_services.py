from backend.ml.inference.content_engine import ContentEngine
from backend.ml.inference.collaborative_engine import CollaborativeEngine
from backend.ml.inference.hybrid_engine import HybridRecommender
from backend.ml.training.train_content_model import SAMPLE_MOVIES
from backend.ml.training.train_collaborative_model import SAMPLE_RATINGS

def test_content_engine_similarity():
    engine = ContentEngine().fit(SAMPLE_MOVIES)
    similar = engine.get_similar_movies(157336, top_n=3)
    assert len(similar) > 0
    # Score should be between 0 and 1
    assert 0.0 <= similar[0]["similarity_score"] <= 1.0

def test_collaborative_engine_cold_start():
    engine = CollaborativeEngine().fit(SAMPLE_RATINGS)
    # Unknown user should return 0.0 without throwing errors
    score = engine.predict_user_movie_score("unknown-user-id", 157336)
    assert score == 0.0

def test_hybrid_engine_scoring():
    c_engine = ContentEngine().fit(SAMPLE_MOVIES)
    collab_engine = CollaborativeEngine().fit(SAMPLE_RATINGS)
    hybrid = HybridRecommender(c_engine, collab_engine)

    recs = hybrid.recommend(
        user_id="user-scifi-1",
        candidate_movies=SAMPLE_MOVIES,
        user_ratings=[{"movie_id": 157336, "rating": 5.0}],
        onboarding_genres=["Science Fiction"],
        top_n=5
    )

    assert len(recs) > 0
    top = recs[0]
    assert "match_percentage" in top
    assert 50 <= top["match_percentage"] <= 100
    assert len(top["reasons"]) > 0
