from fastapi import APIRouter


router = APIRouter(tags=["health"])


@router.get("/")
async def root():
    return {"message": "Welcome to the AI Business Generator API"}


@router.get("/health")
async def health_check():
    return {"status": "healthy"}
