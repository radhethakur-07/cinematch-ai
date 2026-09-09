def test_get_movies(client):
    resp = client.get("/api/v1/movies")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert data["total"] > 0
    assert len(data["items"]) > 0

def test_get_trending_and_top_rated(client):
    t_resp = client.get("/api/v1/movies/trending")
    assert t_resp.status_code == 200
    assert len(t_resp.json()) > 0

    top_resp = client.get("/api/v1/movies/top_rated")
    assert top_resp.status_code == 200
    assert len(top_resp.json()) > 0

def test_get_movie_by_id(client):
    # Interstellar TMDB ID: 157336
    resp = client.get("/api/v1/movies/157336")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == 157336
    assert data["title"] == "Interstellar"
    assert "genres" in data

def test_get_movie_not_found(client):
    resp = client.get("/api/v1/movies/999999999")
    assert resp.status_code == 404
    assert resp.json()["success"] is False
    assert resp.json()["error"]["code"] == "MOVIE_NOT_FOUND"

def test_search_movies(client):
    resp = client.get("/api/v1/search?q=Inception")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1
    assert any("Inception" in item["title"] for item in data["items"])
