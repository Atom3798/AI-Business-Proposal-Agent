from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class SafeUser(BaseModel):
    id: str
    name: str
    email: EmailStr


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: SafeUser


class GenerateRequest(BaseModel):
    startup_idea: str = Field(min_length=3, max_length=2000)
    target_audience: str = Field(default="", max_length=1000)
    industry: str = Field(default="", max_length=500)
    unique_differentiator: str = Field(default="", max_length=1000)


class ValidationResult(BaseModel):
    complete: bool
    missing_sections: list[str] = []
    warnings: list[str] = []


class GeneratedPlanResponse(BaseModel):
    plan_id: str
    generated_sections: dict[str, Any]
    refined_plan: dict[str, Any]
    pitch_deck_outline: dict[str, Any]
    validation_result: ValidationResult


class PlansResponse(BaseModel):
    plans: list[dict[str, Any]]


class FeedbackCreate(BaseModel):
    clarity_score: int = Field(ge=1, le=5)
    coherence_score: int = Field(ge=1, le=5)
    completeness_score: int = Field(ge=1, le=5)
    feasibility_score: int = Field(ge=1, le=5)
    usefulness_score: int = Field(ge=1, le=5)
    comments: str = Field(default="", max_length=2000)


class FeedbackResponse(BaseModel):
    id: str
    plan_id: str
    clarity_score: int
    coherence_score: int
    completeness_score: int
    feasibility_score: int
    usefulness_score: int
    comments: str
    created_at: str


class FeedbackSummary(BaseModel):
    feedback_count: int
    average_scores: dict[str, float]
