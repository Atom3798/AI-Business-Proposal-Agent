"""
Unit tests for Pydantic schemas in app/schemas.py.

Covers validation rules, field normalization, and rejection of bad input.
"""

import pytest
from pydantic import ValidationError

from app.schemas import (
    ALLOWED_MODELS,
    FeedbackCreate,
    GenerateRequest,
    UserCreate,
    UserLogin,
)


# ---------------------------------------------------------------------------
# UserCreate
# ---------------------------------------------------------------------------


class TestUserCreate:
    def test_valid_user(self):
        user = UserCreate(name="Alice", email="Alice@Example.COM", password="SecurePass1!")
        assert user.email == "alice@example.com"  # normalized to lowercase
        assert user.name == "Alice"

    def test_empty_name_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(name="", email="a@b.com", password="password123")

    def test_short_password_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(name="Bob", email="b@b.com", password="short")

    def test_invalid_email_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(name="Carol", email="not-an-email", password="password123")

    def test_name_too_long_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(name="x" * 121, email="d@d.com", password="password123")

    def test_password_too_long_rejected(self):
        with pytest.raises(ValidationError):
            UserCreate(name="Eve", email="e@e.com", password="p" * 129)


# ---------------------------------------------------------------------------
# UserLogin
# ---------------------------------------------------------------------------


class TestUserLogin:
    def test_email_normalized(self):
        login = UserLogin(email="USER@DOMAIN.COM", password="pass1234")
        assert login.email == "user@domain.com"

    def test_empty_password_rejected(self):
        with pytest.raises(ValidationError):
            UserLogin(email="a@b.com", password="")


# ---------------------------------------------------------------------------
# GenerateRequest
# ---------------------------------------------------------------------------


class TestGenerateRequest:
    def test_defaults_applied(self):
        req = GenerateRequest(startup_idea="Drone delivery service")
        assert req.target_audience == ""
        assert req.industry == ""
        assert req.unique_differentiator == ""
        assert req.model == "meta-llama/Llama-3.3-70B-Instruct-Turbo"

    def test_idea_too_short_rejected(self):
        with pytest.raises(ValidationError):
            GenerateRequest(startup_idea="AB")

    def test_idea_too_long_rejected(self):
        with pytest.raises(ValidationError):
            GenerateRequest(startup_idea="x" * 2001)

    @pytest.mark.parametrize("model", list(ALLOWED_MODELS))
    def test_all_allowed_models_accepted(self, model: str):
        req = GenerateRequest(startup_idea="Valid idea here", model=model)
        assert req.model == model

    def test_unknown_model_rejected(self):
        with pytest.raises(ValidationError, match="model must be one of"):
            GenerateRequest(startup_idea="Valid idea", model="openai/gpt-5-turbo")

    def test_target_audience_max_length(self):
        with pytest.raises(ValidationError):
            GenerateRequest(startup_idea="Idea", target_audience="x" * 1001)

    def test_industry_max_length(self):
        with pytest.raises(ValidationError):
            GenerateRequest(startup_idea="Idea", industry="x" * 501)

    def test_differentiator_max_length(self):
        with pytest.raises(ValidationError):
            GenerateRequest(startup_idea="Idea", unique_differentiator="x" * 1001)


# ---------------------------------------------------------------------------
# FeedbackCreate
# ---------------------------------------------------------------------------


class TestFeedbackCreate:
    def test_valid_feedback(self):
        fb = FeedbackCreate(
            clarity_score=4,
            coherence_score=3,
            completeness_score=5,
            feasibility_score=2,
            usefulness_score=1,
            comments="Good overall",
        )
        assert fb.clarity_score == 4

    @pytest.mark.parametrize("field", [
        "clarity_score",
        "coherence_score",
        "completeness_score",
        "feasibility_score",
        "usefulness_score",
    ])
    def test_score_below_minimum_rejected(self, field):
        data = dict(
            clarity_score=3,
            coherence_score=3,
            completeness_score=3,
            feasibility_score=3,
            usefulness_score=3,
        )
        data[field] = 0
        with pytest.raises(ValidationError):
            FeedbackCreate(**data)

    @pytest.mark.parametrize("field", [
        "clarity_score",
        "coherence_score",
        "completeness_score",
        "feasibility_score",
        "usefulness_score",
    ])
    def test_score_above_maximum_rejected(self, field):
        data = dict(
            clarity_score=3,
            coherence_score=3,
            completeness_score=3,
            feasibility_score=3,
            usefulness_score=3,
        )
        data[field] = 6
        with pytest.raises(ValidationError):
            FeedbackCreate(**data)

    def test_comments_too_long_rejected(self):
        with pytest.raises(ValidationError):
            FeedbackCreate(
                clarity_score=3,
                coherence_score=3,
                completeness_score=3,
                feasibility_score=3,
                usefulness_score=3,
                comments="x" * 2001,
            )

    def test_empty_comments_allowed(self):
        fb = FeedbackCreate(
            clarity_score=3,
            coherence_score=3,
            completeness_score=3,
            feasibility_score=3,
            usefulness_score=3,
        )
        assert fb.comments == ""
