"""
Shared fixtures for all test modules.

- app_client  : sync TestClient with LocalJsonStorage backed by a tmp file
- auth_headers: Bearer token for a pre-created test user
- mock_llm    : patches generate_with_llm so tests never hit real APIs
"""

import json
import os
import tempfile
from collections.abc import AsyncGenerator
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

# Point config at a scratch env file before importing the app
os.environ.setdefault("STORAGE_MODE", "local")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-not-for-production")

from app.main import app  # noqa: E402  (must come after env setup)


# ---------------------------------------------------------------------------
# Minimal valid LLM output returned by the mock so every chain step succeeds
# ---------------------------------------------------------------------------

_FAKE_LLM_RESPONSES: dict[str, dict[str, Any]] = {
    "core_components": {
        "problem": "Test problem statement",
        "solution": "Test solution",
        "customer": "Test customer",
        "differentiation": "Test differentiator",
    },
    "value_proposition": {
        "tagline": "Test tagline",
        "description": "Test description",
    },
    "customer_personas": {
        "personas": [
            {
                "name": "Alice",
                "role": "Power user",
                "demographics": "25-40",
                "pain_points": ["pain1"],
                "goals": ["goal1"],
                "solution_fit": "fits well",
            }
        ]
    },
    "competitive_analysis": {
        "competitors": [
            {
                "type_or_name": "Incumbent",
                "strengths": "Brand",
                "weaknesses": "Slow",
                "our_advantage": "Speed",
            }
        ]
    },
    "revenue_model": {
        "primary_stream": {"name": "SaaS", "description": "Monthly subscription"},
        "secondary_stream": {"name": "Services", "description": "Onboarding"},
        "rationale": "Recurring revenue fits product value",
    },
    "mvp_feature_list": {
        "must_have": ["Feature A", "Feature B"],
        "nice_to_have": ["Feature C"],
    },
    "go_to_market_strategy": {
        "channels": [
            {
                "channel_name": "Outreach",
                "target_audience": "SMBs",
                "strategy_description": "Cold email",
            }
        ]
    },
    "pitch_deck_outline": {
        "slides": [{"slide_number": 1, "title": "Title", "key_message": "Intro"}]
    },
    "refinement": {
        "disclaimer": "AI-generated draft",
        "executive_summary": "Summary here",
        "refined_sections": {},
        "consistency_notes": ["Looks good"],
    },
}

_STEP_ORDER = [
    "core_components",
    "value_proposition",
    "customer_personas",
    "competitive_analysis",
    "revenue_model",
    "mvp_feature_list",
    "go_to_market_strategy",
    "pitch_deck_outline",
    "refinement",
]
_step_counter: list[int] = [0]


def _fake_llm_side_effect(prompt: str, model: str = "") -> str:
    key = _STEP_ORDER[_step_counter[0] % len(_STEP_ORDER)]
    _step_counter[0] += 1
    return json.dumps(_FAKE_LLM_RESPONSES[key])


@pytest.fixture()
def mock_llm():
    """Replace generate_with_llm with a fast deterministic stub."""
    _step_counter[0] = 0
    with patch(
        "app.llm.generate_with_llm",
        new_callable=AsyncMock,
        side_effect=_fake_llm_side_effect,
    ) as mock:
        yield mock


@pytest.fixture()
def tmp_data_file(tmp_path, monkeypatch):
    """Create a fresh temporary JSON store for each test."""
    data_file = tmp_path / "test_store.json"
    monkeypatch.setenv("LOCAL_DATA_FILE", str(data_file))
    return data_file


@pytest.fixture()
def app_client(tmp_data_file):
    """TestClient wired to a fresh local-JSON store."""
    import importlib

    import app.config as cfg_module
    import app.storage as storage_module

    # Reload settings so LOCAL_DATA_FILE env change is picked up
    importlib.reload(cfg_module)
    from app.config import settings as fresh_settings

    storage_module.settings = fresh_settings  # type: ignore[attr-defined]

    with TestClient(app, raise_server_exceptions=True) as client:
        yield client


@pytest.fixture()
def registered_user(app_client):
    """Register a test user and return their credentials."""
    payload = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "SecurePass1!",
    }
    resp = app_client.post("/auth/signup", json=payload)
    assert resp.status_code == 201, resp.text
    return payload


@pytest.fixture()
def auth_headers(app_client, registered_user):
    """Return Authorization headers for the pre-registered test user."""
    resp = app_client.post(
        "/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    assert resp.status_code == 200, resp.text
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
