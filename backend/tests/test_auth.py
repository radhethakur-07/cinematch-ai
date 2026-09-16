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

    # 2. Duplicate registration fails
    dup_resp = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password}
    )
    assert dup_resp.status_code == 400
    assert dup_resp.json()["error"]["code"] == "USER_ALREADY_EXISTS"

    # 3. Login with wrong password fails
    wrong_pwd_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "WrongPassword999!"}
    )
    assert wrong_pwd_resp.status_code == 401
    assert wrong_pwd_resp.json()["error"]["code"] == "INVALID_CREDENTIALS"

    # 4. Login with uncreated user fails
    unknown_user_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@cinematch.ai", "password": password}
    )
    assert unknown_user_resp.status_code == 401
    assert unknown_user_resp.json()["error"]["code"] == "INVALID_CREDENTIALS"

    # 5. Successful Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password}
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data

    # 6. Access Protected /auth/me
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

