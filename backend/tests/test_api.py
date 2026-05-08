"""
API integration tests against the FastAPI app using TestClient.

LLM calls are replaced by the mock_llm fixture so tests are fast and offline.
Tests verify HTTP contract (status codes, response shape, auth enforcement).
"""

import pytest

from app.schemas import ALLOWED_MODELS


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


class TestHealth:
    def test_root(self, app_client):
        resp = app_client.get("/")
        assert resp.status_code == 200
        assert "message" in resp.json()

    def test_health(self, app_client):
        resp = app_client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------


class TestAuth:
    def test_register_success(self, app_client):
        resp = app_client.post(
            "/auth/signup",
            json={"name": "Alice", "email": "alice@test.com", "password": "Password123!"},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert "access_token" in data
        assert data["user"]["email"] == "alice@test.com"

    def test_register_duplicate_email(self, app_client):
        payload = {"name": "Bob", "email": "bob@test.com", "password": "Password123!"}
        app_client.post("/auth/signup", json=payload)
        resp = app_client.post("/auth/signup", json=payload)
        assert resp.status_code == 400

    def test_register_invalid_email(self, app_client):
        resp = app_client.post(
            "/auth/signup",
            json={"name": "Carol", "email": "not-email", "password": "Password123!"},
        )
        assert resp.status_code == 422

    def test_register_short_password(self, app_client):
        resp = app_client.post(
            "/auth/signup",
            json={"name": "Dave", "email": "dave@test.com", "password": "short"},
        )
        assert resp.status_code == 422

    def test_login_success(self, app_client, registered_user):
        resp = app_client.post(
            "/auth/login",
            json={"email": registered_user["email"], "password": registered_user["password"]},
        )
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_login_wrong_password(self, app_client, registered_user):
        resp = app_client.post(
            "/auth/login",
            json={"email": registered_user["email"], "password": "WrongPassword!"},
        )
        assert resp.status_code == 401

    def test_login_unknown_email(self, app_client):
        resp = app_client.post(
            "/auth/login",
            json={"email": "ghost@example.com", "password": "Password123!"},
        )
        assert resp.status_code == 401

    def test_me_returns_user(self, app_client, auth_headers):
        resp = app_client.get("/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        assert "email" in resp.json()

    def test_me_requires_auth(self, app_client):
        resp = app_client.get("/auth/me")
        assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Generate
# ---------------------------------------------------------------------------


GENERATE_PAYLOAD = {
    "startup_idea": "AI-powered meal planning for athletes",
    "target_audience": "Fitness enthusiasts",
    "industry": "Health and Wellness",
    "unique_differentiator": "Macro tracking integrated with workout data",
}


class TestGenerate:
    def test_generate_returns_full_response(self, app_client, auth_headers, mock_llm):
        resp = app_client.post("/generate", json=GENERATE_PAYLOAD, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert "plan_id" in data
        assert "generated_sections" in data
        assert "refined_plan" in data
        assert "pitch_deck_outline" in data
        assert "validation_result" in data

    def test_generate_requires_auth(self, app_client):
        resp = app_client.post("/generate", json=GENERATE_PAYLOAD)
        assert resp.status_code == 401

    def test_generate_invalid_model_rejected(self, app_client, auth_headers):
        resp = app_client.post(
            "/generate",
            json={**GENERATE_PAYLOAD, "model": "gpt-99"},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    @pytest.mark.parametrize("model", list(ALLOWED_MODELS))
    def test_generate_accepts_all_allowed_models(self, app_client, auth_headers, mock_llm, model):
        resp = app_client.post(
            "/generate",
            json={**GENERATE_PAYLOAD, "model": model},
            headers=auth_headers,
        )
        assert resp.status_code == 201

    def test_generate_idea_too_short_rejected(self, app_client, auth_headers):
        resp = app_client.post(
            "/generate",
            json={**GENERATE_PAYLOAD, "startup_idea": "AB"},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_generated_plan_saved_and_retrievable(self, app_client, auth_headers, mock_llm):
        gen_resp = app_client.post("/generate", json=GENERATE_PAYLOAD, headers=auth_headers)
        plan_id = gen_resp.json()["plan_id"]

        get_resp = app_client.get(f"/plans/{plan_id}", headers=auth_headers)
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == plan_id


# ---------------------------------------------------------------------------
# Plans
# ---------------------------------------------------------------------------


class TestPlans:
    def _generate(self, client, headers):
        resp = client.post("/generate", json=GENERATE_PAYLOAD, headers=headers)
        assert resp.status_code == 201
        return resp.json()["plan_id"]

    def test_list_plans_empty_initially(self, app_client, auth_headers):
        resp = app_client.get("/plans", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["plans"] == []

    def test_list_plans_shows_generated(self, app_client, auth_headers, mock_llm):
        self._generate(app_client, auth_headers)
        resp = app_client.get("/plans", headers=auth_headers)
        assert len(resp.json()["plans"]) == 1

    def test_get_plan_not_found(self, app_client, auth_headers):
        resp = app_client.get("/plans/nonexistentid123", headers=auth_headers)
        assert resp.status_code == 404

    def test_delete_plan(self, app_client, auth_headers, mock_llm):
        plan_id = self._generate(app_client, auth_headers)
        del_resp = app_client.delete(f"/plans/{plan_id}", headers=auth_headers)
        assert del_resp.status_code == 204

        get_resp = app_client.get(f"/plans/{plan_id}", headers=auth_headers)
        assert get_resp.status_code == 404

    def test_plans_require_auth(self, app_client):
        assert app_client.get("/plans").status_code == 401


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------


FEEDBACK_PAYLOAD = {
    "clarity_score": 4,
    "coherence_score": 5,
    "completeness_score": 3,
    "feasibility_score": 4,
    "usefulness_score": 5,
    "comments": "Very helpful output",
}


class TestFeedback:
    def _plan_id(self, client, headers):
        resp = client.post("/generate", json=GENERATE_PAYLOAD, headers=headers)
        return resp.json()["plan_id"]

    def test_submit_feedback(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        resp = app_client.post(
            f"/feedback/{plan_id}", json=FEEDBACK_PAYLOAD, headers=auth_headers
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["clarity_score"] == 4
        assert data["plan_id"] == plan_id

    def test_feedback_score_out_of_range(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        resp = app_client.post(
            f"/feedback/{plan_id}",
            json={**FEEDBACK_PAYLOAD, "clarity_score": 10},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_feedback_summary(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        app_client.post(
            f"/feedback/{plan_id}", json=FEEDBACK_PAYLOAD, headers=auth_headers
        )
        resp = app_client.get("/feedback/summary", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["feedback_count"] == 1
        assert "average_scores" in data

    def test_feedback_requires_auth(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        resp = app_client.post(f"/feedback/{plan_id}", json=FEEDBACK_PAYLOAD)
        assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------


class TestExport:
    def _plan_id(self, client, headers):
        resp = client.post("/generate", json=GENERATE_PAYLOAD, headers=headers)
        return resp.json()["plan_id"]

    def test_export_pdf(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        resp = app_client.post(f"/export/pdf/{plan_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.headers["content-type"] == "application/pdf"

    def test_export_docx(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        resp = app_client.post(f"/export/docx/{plan_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert "wordprocessingml" in resp.headers["content-type"]

    def test_export_requires_auth(self, app_client, auth_headers, mock_llm):
        plan_id = self._plan_id(app_client, auth_headers)
        assert app_client.post(f"/export/pdf/{plan_id}").status_code == 401
