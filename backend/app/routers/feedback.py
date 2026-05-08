from fastapi import APIRouter, Depends, status

from app.auth import get_current_user
from app.routers.plans import get_owned_plan
from app.schemas import FeedbackCreate, FeedbackResponse, FeedbackSummary
from app.storage import get_storage
from app.utils import serialize_doc, utc_now


router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.get("/summary", response_model=FeedbackSummary)
async def feedback_summary(current_user: dict = Depends(get_current_user)):
    return await get_storage().get_feedback_summary(current_user["id"])


@router.post("/{plan_id}", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    plan_id: str,
    payload: FeedbackCreate,
    current_user: dict = Depends(get_current_user),
):
    store = get_storage()
    await get_owned_plan(plan_id, current_user["id"])

    feedback_doc = {
        "plan_id": plan_id,
        "user_id": current_user["id"],
        "clarity_score": payload.clarity_score,
        "coherence_score": payload.coherence_score,
        "completeness_score": payload.completeness_score,
        "feasibility_score": payload.feasibility_score,
        "usefulness_score": payload.usefulness_score,
        "comments": payload.comments,
        "created_at": utc_now(),
    }
    saved_feedback = await store.create_feedback(feedback_doc)
    return serialize_doc(saved_feedback)
