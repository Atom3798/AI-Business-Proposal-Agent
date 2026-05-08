from typing import Any, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


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


ALLOWED_MODELS = {
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "deepseek-ai/DeepSeek-V3",
    "deepseek-ai/DeepSeek-V3-0324",
    "deepseek-ai/DeepSeek-R1",
    "moonshotai/Kimi-K2.5",
    "Qwen/Qwen2.5-7B-Instruct-Turbo",
}


class PanelAgent(BaseModel):
    model: str
    role: Literal["generator", "critic", "refiner"]

    @field_validator("model")
    @classmethod
    def validate_model(cls, value: str) -> str:
        if value not in ALLOWED_MODELS:
            raise ValueError(f"model must be one of: {', '.join(sorted(ALLOWED_MODELS))}")
        return value


class ModelPanel(BaseModel):
    agents: list[PanelAgent] = Field(min_length=2, max_length=4)

    @model_validator(mode="after")
    def validate_roles(self) -> "ModelPanel":
        roles = {agent.role for agent in self.agents}
        if "generator" not in roles:
            raise ValueError("Panel must include at least one agent with role 'generator'")
        if "critic" not in roles:
            raise ValueError("Panel must include at least one agent with role 'critic'")
        return self


class GenerateRequest(BaseModel):
    startup_idea: str = Field(min_length=3, max_length=2000)
    target_audience: str = Field(default="", max_length=1000)
    industry: str = Field(default="", max_length=500)
    unique_differentiator: str = Field(default="", max_length=1000)
    model: str = Field(default="meta-llama/Llama-3.3-70B-Instruct-Turbo")
    panel: Optional[ModelPanel] = None

    @field_validator("model")
    @classmethod
    def validate_model(cls, value: str) -> str:
        if value not in ALLOWED_MODELS:
            raise ValueError(f"model must be one of: {', '.join(sorted(ALLOWED_MODELS))}")
        return value


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
    panel_trace: Optional[list[dict[str, Any]]] = None


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
