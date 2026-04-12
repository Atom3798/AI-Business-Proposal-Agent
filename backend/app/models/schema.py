from pydantic import BaseModel
from typing import Any

class GenerateRequest(BaseModel):
    startup_idea: str
    target_audience: str = ""
    industry: str = ""
    unique_differentiator: str = ""
    refine: bool = False

class GenerateResponse(BaseModel):
    core_concept: dict[str, Any]
    value_proposition: dict[str, Any]
    customer_personas: dict[str, Any]
    competitive_analysis: dict[str, Any]
    revenue_model: dict[str, Any]
    mvp_features: dict[str, Any]
    gtm_strategy: dict[str, Any]
    pitch_deck: dict[str, Any]
