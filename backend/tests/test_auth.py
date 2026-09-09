def test_register_and_login(client):
    email = "tester@cinematch.ai"
    password = "SuperSecretPassword123!"

    # 1. Register
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Test Cinephile"}
    )
    assert reg_resp.status_code == 200
    data = reg_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == email

    # 2. Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password}
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data

    # 3. Access Protected /auth/me
    token = login_data["access_token"]
    me_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == email

def test_unauthorized_access(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
    assert resp.json()["success"] is False
    assert resp.json()["error"]["code"] == "UNAUTHORIZED"
