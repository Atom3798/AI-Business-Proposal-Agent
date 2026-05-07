from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.schemas import AuthResponse, SafeUser, UserCreate, UserLogin
from app.storage import DuplicateEmailError, get_storage
from app.utils import utc_now


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate):
    store = get_storage()
    existing_user = await store.get_user_by_email(payload.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    now = utc_now()
    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "created_at": now,
        "updated_at": now,
    }

    try:
        saved_user = await store.create_user(user_doc)
    except DuplicateEmailError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        ) from exc

    user = SafeUser(id=str(saved_user["_id"]), name=user_doc["name"], email=user_doc["email"])
    return AuthResponse(
        access_token=create_access_token(user.id),
        token_type="bearer",
        user=user,
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    user_doc = await get_storage().get_user_by_email(payload.email)
    if user_doc is None or not verify_password(
        payload.password, user_doc["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = SafeUser(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
    )
    return AuthResponse(
        access_token=create_access_token(user.id),
        token_type="bearer",
        user=user,
    )


@router.get("/me", response_model=SafeUser)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
