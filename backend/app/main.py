from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import auth, export, feedback, generate, health, plans
from app.storage import close_storage, initialize_storage


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_storage()
    yield
    await close_storage()


app = FastAPI(
    title="AI Business Generator API",
    description="Backend for the AI Business Generator capstone project",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(
        {
            settings.frontend_origin,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        }
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Unexpected server error"},
    )


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(generate.router)
app.include_router(plans.router)
app.include_router(export.router)
app.include_router(feedback.router)
