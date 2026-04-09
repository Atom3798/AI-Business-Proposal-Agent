# AI Business Generator

AI Business Generator is a focused frontend project built with React, Vite, TypeScript, and Tailwind CSS. It lets users enter a startup idea and generates a polished mock business plan UI with sections for positioning, personas, competition, monetization, MVP scope, go-to-market strategy, and pitch structure.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- `motion/react`
- `lucide-react`

## Project Structure

```text
.
|-- frontend
|-- package.json
`-- README.md
```

## Quick Start

```bash
git clone https://github.com/Atom3798/AI-Business-Proposal-Agent.git
cd AI-Business-Proposal-Agent
npm install
npm install --workspace frontend
npm run dev --workspace frontend
```

Open `http://localhost:5173`.

## Available Scripts

From the repo root:

```bash
npm run dev
npm run build
npm run lint
```

Or directly in the frontend workspace:

```bash
npm run dev --workspace frontend
npm run build --workspace frontend
npm run lint --workspace frontend
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
