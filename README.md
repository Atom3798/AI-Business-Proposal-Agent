# AI Business Generator

A full-stack capstone web app that turns a startup idea into a structured AI-generated business plan. The app includes user accounts, saved plan history, PDF/DOCX exports, feedback scoring, and a React frontend wired to a FastAPI backend.

## Features

- User signup/login with JWT authentication.
- Local backend storage by default, no MongoDB required for class/demo use.
- Prompt-chained business plan generation with Gemini when `GEMINI_API_KEY` is configured.
- Local structured fallback generation when no Gemini key is provided.
- Saved business plan history per user.
- PDF and DOCX export from the backend.
- Feedback scoring for generated plans.
- React/Vite frontend with auth pages and protected workspace.

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS.
- Backend: FastAPI, Uvicorn, Pydantic, JWT, bcrypt.
- Storage: local JSON file by default, optional MongoDB/Motor mode.
- LLM: Google Gemini API, with local fallback for testing.

## Project Structure

```text
backend/
  app/
    main.py
    config.py
    auth.py
    llm.py
    schemas.py
    storage.py
    utils.py
    routers/
      auth.py
      generate.py
      plans.py
      export.py
      feedback.py
      health.py
  data/
    .gitignore
  .env.example
  requirements.txt

frontend/
  src/
    components/
    pages/
    utils/
  .env.example
  package.json

package.json
```

## Setup

### 1. Backend

From PowerShell:

```powershell
cd path\to\AI-Business-Proposal-Agent\backend
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend health check:

```text
http://127.0.0.1:8000/health
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### 2. Frontend

Open a second terminal:

```powershell
cd path\to\AI-Business-Proposal-Agent
Copy-Item frontend\.env.example frontend\.env.local
npm install
npm run dev
```

Open the Vite URL:

```text
http://localhost:5173
```

## Environment

Backend `.env` defaults:

```env
STORAGE_MODE=local
LOCAL_DATA_FILE=data/local_store.json
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=ai_business_generator
JWT_SECRET_KEY=change_me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=
FRONTEND_ORIGIN=http://localhost:5173
```

For class/demo use, `STORAGE_MODE=local` is enough. Data is saved to:

```text
backend/data/local_store.json
```

That file is ignored by Git.

If `GEMINI_API_KEY` is blank or left as a placeholder, the app still generates a structured local fallback draft so the project can be tested without external API access.

## Test Flow

1. Start the backend.
2. Start the frontend.
3. Sign up from the frontend.
4. Open the workspace.
5. Generate a business plan.
6. Confirm it appears in plan history.
7. Export PDF or DOCX.
8. Submit feedback.

## Useful Commands

Frontend type check:

```powershell
npm run lint --workspace frontend
```

Frontend production build:

```powershell
npm run build --workspace frontend
```

Backend import check:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m compileall app
```

## Notes For Contributors

- Keep the backend running separately from the frontend during development.
- Do not commit `.env`, `.env.local`, `.venv`, `node_modules`, `dist`, logs, or `backend/data/local_store.json`.
- The chat page is not implemented as a real persisted chat system yet; the main completed flow is auth, generation, saved plans, export, and feedback.
- MongoDB support remains available through `STORAGE_MODE=mongo`, but local mode is the default for easier class demos.
