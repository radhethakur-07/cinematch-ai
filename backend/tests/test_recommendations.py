def test_public_recommendations_cold_start(client):
    resp = client.get("/api/v1/recommendations?top_n=5")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert len(data["recommendations"]) > 0
    # Every recommendation should include match_percentage and grounded reasons
    first_rec = data["recommendations"][0]
    assert "match_percentage" in first_rec
    assert "reasons" in first_rec
    assert len(first_rec["reasons"]) > 0

def test_similar_movies(client):
    # Test movie-to-movie similarity on Interstellar (157336)
    resp = client.get("/api/v1/movies/157336/similar?top_n=3")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Interstellar shouldn't be recommended to itself
    assert all(m["id"] != 157336 for m in data)

def test_ai_mood_search(client):
    payload = {"prompt": "I want a mind-bending sci-fi movie like Inception but not too long."}
    resp = client.post("/api/v1/recommendations/mood", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "structured_intent" in data
    assert len(data["recommendations"]) > 0
