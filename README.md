# AI Business Generator

AI Business Generator is a professional full-stack project (originally frontend-only) that transforms a simple startup idea into a comprehensive, investor-ready business plan using a modular Generative AI pipeline.

## 🚀 Recent Project Progress

### Updates by Joseph Bae
Joseph officially transitioned the project from a frontend prototype to a functional full-stack application. Key updates include:

- **Full Backend Scaffolding**: Initialized a modular Python/FastAPI backend architecture to handle robust AI processing.
- **AI Prompt-Chaining Pipeline**: Engineered a sophisticated, multi-step LLM orchestration layer that generates 7 detailed business plan sections sequentially.
- **Core Concept Extraction Logic**: Implemented an extraction layer to distill raw user ideas into clean, structured business data for more accurate results.
- **Async LLM Service Integration**: Wired up the OpenAI API with an asynchronous service to ensure smooth, non-blocking plan generation for a better user experience.
- **Full-Stack Connectivity Prep**: Configured CORS and middleware to allow secure communication between the existing React frontend and new FastAPI backend.

### Updates by Joseph Esquivel
Joseph Esquivel completed the backend/LLM integration layer, connecting the pipeline to a live API endpoint. Key updates include:

- **Pydantic Request/Response Models**: Defined typed `GenerateRequest` and `GenerateResponse` models in `app/models/schema.py` for input validation and automatic API documentation.
- **Live `/generate` Endpoint**: Wired up the `POST /generate` route in `main.py`, exposing the full business plan pipeline to the frontend with proper error handling.
- **Parallel LLM Execution**: Refactored `generate_business_plan()` to run five independent pipeline sections concurrently using `asyncio.gather()`, reducing generation time significantly.
- **Optional Refinement Pass**: Added a `refine` flag to the request model allowing an optional final consistency-check LLM pass to polish the full plan before returning it.
- **Environment Variable Loading**: Added `load_dotenv()` to ensure the API key is properly loaded from `.env` at startup.




## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, `motion/react`, `lucide-react`
- **Backend**: Python 3.10+, FastAPI, Uvicorn, OpenAI GPT-4o
- **Persistence**: `localStorage` (current) and MongoDB (planned)

## Project Structure

```text
.
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/                # API Endpoints
│   │   ├── models/             # Data Validation
│   │   └── services/           # LLM Orchestration & Prompts
│   ├── requirements.txt
│   └── main.py
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── pages/              # Main application views
│   │   └── utils/              # Export & Storage logic
│   ├── package.json
│   └── tsconfig.json
├── package.json                 # Monorepo root
├── PROGRESS.md                  # Project tracking
└── README.md                    # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Add your OPENAI_API_KEY to a .env file
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Contributing

We welcome contributions from the team! To ensure a smooth development process, please follow these guidelines:

### How to Contribute
1. **Report Bugs**: If you find an issue, please open an Issue with steps to reproduce it.
2. **Feature Requests**: Have an idea for a new feature? Suggest it in the Issues section.
3. **Pull Requests**:
    - Fork the repository and create a new feature branch.
    - Keep changes focused and descriptive.
    - Ensure your code follows the existing style and is well-commented (focused on context/intent).
    - Verify that both the frontend (`npm run lint`) and backend still function correctly.
    - Submit your PR with a clear summary of what was changed and why.

### Team Roles
- **Frontend & UX**: UI design, interactive forms, and data visualization.
- **Backend & LLM**: Prompt engineering, API development, and pipeline orchestration.
- **Evaluation & Integration**: Testing, validation, and performance monitoring.

## Documentation

- [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md) - Overall improvements and features
- [FRONTEND_IMPROVEMENTS.md](./FRONTEND_IMPROVEMENTS.md) - Technical breakdown
- Component source code has JSDoc comments

## License

MIT (Add your license here)

## Team

This is a collaborative capstone project:
- **Joseph Bae**: Full-Stack & AI Pipeline
    - **Frontend & UX**: Lead UI/UX design and multi-step interaction logic.
    - **Full-Stack Scaffolding**: Initialized the modular FastAPI backend architecture and CORS middleware.
    - **AI Prompt-Chaining**: Engineered the sophisticated, multi-step LLM orchestration layer for 7 detailed sections.
    - **LLM Pipeline**: Integrated the asynchronous OpenAI service to handle non-blocking plan generation.
    - **Core Concept Extraction**: Implemented logic to distill raw startup ideas into structured, actionable business data.
- **Joseph Esquivel**: Backend & LLM Pipeline | Prompt Engineering, API Integration, and Refinement Logic.
- **Teammate 2**: Evaluation & System Integration | Testing, Validation, and Performance Monitoring.

---

**Status**: Frontend v2 Production Ready | waiting Backend Integration

**Next Step**: Backend team connects real LLM endpoint to generate live business plans!

```

## Current Features

- Startup idea form with optional business context fields
- Loading state for mock AI generation
- Structured output cards for:
  - Value Proposition
  - Customer Personas
  - Competitive Analysis
  - Revenue Model
  - MVP Features
  - Go-To-Market Strategy
  - Pitch Deck Outline
- Creative responsive header and footer
- Smooth scroll to generated results
- Placeholder `Download as PDF` button

## Notes

- This repository is intentionally scoped as a standalone frontend project.
- The current business-plan generation is mocked, so no backend or API keys are required.
