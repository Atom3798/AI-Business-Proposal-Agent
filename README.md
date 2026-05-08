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

## Test Flow (Manual)

1. Start the backend.
2. Start the frontend.
3. Sign up from the frontend.
4. Open the workspace.
5. Generate a business plan.
6. Confirm it appears in plan history.
7. Export PDF or DOCX.
8. Submit feedback.

## Automated Tests

The backend has a pytest suite covering the API, LLM pipeline, Pydantic schemas, and a live model benchmark. All fast tests run fully offline — no real API keys required.

### Requirements

Install the test dependencies from the `backend/` directory:

```bash
cd backend
pip install -r requirements-test.txt
```

`requirements-test.txt` pulls in everything from `requirements.txt` plus:

| Package | Version | Purpose |
|---|---|---|
| `pytest` | 8.3.0 | Test runner |
| `pytest-asyncio` | 0.24.0 | Async test support |
| `httpx` | 0.27.0 | ASGI test transport for FastAPI |

### Running the Tests

Run all tests (fast, offline):

```bash
cd backend
pytest
```

Run a specific file:

```bash
pytest tests/test_api.py
pytest tests/test_schemas.py
pytest tests/test_llm_unit.py
```

Run a specific class or single test:

```bash
pytest tests/test_api.py::TestAuth
pytest tests/test_api.py::TestAuth::test_login_success
```

Run with verbose output:

```bash
pytest -v
```

Run the live model benchmark (requires a real Hugging Face token):

```bash
HF_TOKEN=hf_yourtoken pytest tests/test_model_comparison.py -v -s
```

The `-s` flag is required so the comparison table prints to stdout at the end.

### What Each Test File Covers

**`tests/conftest.py`** — Shared fixtures used by all test files. Sets up a temporary JSON data store for each test so nothing persists between runs. Provides a `mock_llm` fixture that replaces real LLM API calls with deterministic fake responses, and an `auth_headers` fixture that registers and logs in a test user.

**`tests/test_schemas.py`** — Unit tests for all Pydantic request/response models. Verifies that emails are normalized to lowercase, passwords enforce length limits, feedback scores are rejected outside the 1–5 range, unknown LLM models are rejected with a clear error, and all field length constraints are enforced.

**`tests/test_llm_unit.py`** — Unit tests for the internal LLM utility functions with no network or storage involved. Covers `_parse_json` (handles plain JSON, markdown code fences, JSON buried in prose, raises on garbage input), `_input_to_dict` (accepts Pydantic models or plain dicts, fills missing keys, strips whitespace), credential sentinel checks (rejects placeholder values like `"your_token_here"` for HF and Gemini keys), all 8 fallback factory functions (verifies structural correctness — correct keys, slide count, channel count), and `_validate_plan` (flags missing sections and fallback usage).

**`tests/test_api.py`** — Integration tests against the full FastAPI app using `TestClient`. LLM calls are replaced by the mock fixture. Covers:

- `GET /` and `GET /health` return healthy responses
- `POST /auth/signup` — success, duplicate email (400), invalid email/short password (422)
- `POST /auth/login` — success, wrong password, unknown email (all 401)
- `GET /auth/me` — returns user when authenticated, 401 without token
- `POST /generate` — returns full plan shape, requires auth, rejects bad models, saves plan that is retrievable by ID
- `GET /plans`, `GET /plans/{id}`, `DELETE /plans/{id}` — list, fetch, delete, 404 on missing
- `POST /feedback/{plan_id}` — submit feedback, score out of range (422), summary aggregation
- `POST /export/pdf/{plan_id}` and `/export/docx/{plan_id}` — correct content-type headers returned

**`tests/test_model_comparison.py`** — Live benchmark test that hits real Hugging Face APIs. Auto-skips when `HF_TOKEN` is not set. Runs the full `generate_business_plan_chain` against 6 models (Llama 3.3 70B, DeepSeek V3, DeepSeek V3-0324, DeepSeek R1, Kimi K2.5, Qwen 2.5 7B) and measures wall-clock time, plan completeness, fallback usage, consistency note count, and a rough token estimate. Prints a formatted side-by-side comparison table sorted by speed at the end of the run.

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
