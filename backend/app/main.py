from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
