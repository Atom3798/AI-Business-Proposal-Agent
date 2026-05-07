from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.auth import get_current_user
from app.schemas import PlansResponse
from app.storage import get_storage
from app.utils import serialize_doc


router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("", response_model=PlansResponse)
async def list_plans(current_user: dict = Depends(get_current_user)):
    plans = [serialize_doc(plan) for plan in await get_storage().list_user_plans(current_user["id"])]
    return {"plans": plans}


@router.get("/{plan_id}")
async def get_plan(plan_id: str, current_user: dict = Depends(get_current_user)):
    plan = await get_owned_plan(plan_id, current_user["id"])
    return serialize_doc(plan)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plan(plan_id: str, current_user: dict = Depends(get_current_user)):
    plan = await get_owned_plan(plan_id, current_user["id"])
    await get_storage().delete_user_plan(str(plan["_id"]), current_user["id"])
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def get_owned_plan(plan_id: str, user_id: str) -> dict:
    plan = await get_storage().get_plan_by_id(plan_id)
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found",
        )
    if plan.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this plan",
        )
    return plan
