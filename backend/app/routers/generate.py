from fastapi import APIRouter, Depends, status

from app.auth import get_current_user
from app.llm import generate_business_plan_chain
from app.schemas import GeneratedPlanResponse, GenerateRequest
from app.storage import get_storage
from app.utils import utc_now


router = APIRouter(tags=["generate"])


@router.post(
    "/generate",
    response_model=GeneratedPlanResponse,
    status_code=status.HTTP_201_CREATED,
)
async def generate_business_plan(
    payload: GenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    store = get_storage()
    generation_result = await generate_business_plan_chain(payload, model=payload.model)
    generation_steps = generation_result.pop("_steps", [])

    now = utc_now()
    plan_doc = {
        "user_id": current_user["id"],
        "startup_idea": payload.startup_idea,
        "target_audience": payload.target_audience,
        "industry": payload.industry,
        "unique_differentiator": payload.unique_differentiator,
        "generated_sections": generation_result["generated_sections"],
        "refined_plan": generation_result["refined_plan"],
        "pitch_deck_outline": generation_result["pitch_deck_outline"],
        "validation_result": generation_result["validation_result"],
        "created_at": now,
        "updated_at": now,
    }

    saved_plan = await store.create_plan(plan_doc)
    plan_id = str(saved_plan["_id"])

    if generation_steps:
        await store.add_generation_steps(
            [
                {
                    "plan_id": plan_id,
                    "user_id": current_user["id"],
                    "step_name": step["step_name"],
                    "prompt": step["prompt"],
                    "output": step["output"],
                    "created_at": now,
                }
                for step in generation_steps
            ]
        )

    return {
        "plan_id": plan_id,
        "generated_sections": generation_result["generated_sections"],
        "refined_plan": generation_result["refined_plan"],
        "pitch_deck_outline": generation_result["pitch_deck_outline"],
        "validation_result": generation_result["validation_result"],
    }
