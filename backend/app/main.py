from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schema import GenerateRequest, GnerateResponse
from app.services.llm_service import generate_business_plan
import os

app = FastAPI(
    title="AI Business Generator API",
    description="Backend for the AI Business Generator capstone project",
    version="1.0.0"
)

# We're enabling CORS so the React frontend can actually talk to this API. 
# Without this, the browser will block our requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Business Generator API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/generate", response_model=GnerateResponse)
async def generate(request: GenerateRequest):
    """Accepts a start up idea and returns a generated business plan."""
    try:
        plan = await generate_business_plan(
            startup_idea=request.startup_idea,
            target_audience=request.target_audience,
            industry=request.industry,
            unique_differentiator=request.unique_differentiators,
            refine=request.refine
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {str(e)}")