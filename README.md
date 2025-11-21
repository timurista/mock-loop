# MockLoop

AI-powered mock interview studio inspired by the product outline in `PLAN.md`. MockLoop pairs a React/Next.js front-end with a FastAPI backend that simulates interviewer personas, records transcript snapshots, and generates rubric-based feedback.

The initial MVP focuses on backend/Python candidates preparing for FAANG-style loops:

- Spin up a mock session by selecting company, experience band, and focus area.
- Capture code snapshots + chat events that would normally stream to an LLM.
- Produce structured feedback detailing strengths, improvements, and next steps.
- Prep-integrated sidebar for dashboards, scorecards, and weekend sprint upsell.
- Deployment via GitHub Actions → DigitalOcean Kubernetes using `app.yml`.

## Repository layout

```
.
├── PLAN.md                 # Product + UX blueprint provided by the user
├── README.md               # You're reading it
├── app.yml                 # Kubernetes deployments/services/ingress
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── routers/
│   │   └── services/
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── requirements.txt
├── frontend/               # Next.js + Tailwind UI
│   ├── Dockerfile
│   ├── package.json
│   ├── src/app/...
│   └── tsconfig.json
└── .github/workflows/      # CI + deployment pipeline
```

## Prerequisites

- Python 3.11+
- Node.js 20+ with [pnpm](https://pnpm.io/) (`corepack enable pnpm`)
- (Optional) Docker + kubectl for containerized workflows

## Local development

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Useful endpoints:

- `GET /health` – readiness probe
- `POST /api/interviews` – start a mock session (returns prompts)
- `POST /api/interviews/{session_id}/end` – generate rubric-driven feedback

Environment variables live in `backend/.env` (see `.env.example`).

### Frontend (Next.js + Tailwind)

```bash
cd frontend
pnpm install
pnpm dev
```

Create `frontend/.env.local` and point the UI at the FastAPI backend:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

The Next.js app currently stubs authentication but leaves placeholders to pass signed cookies/token headers through to FastAPI for real interview “jobs” and logging.

### Combined workflow

1. Start FastAPI on port 8000.
2. Start Next.js on port 3000.
3. Navigate to `http://localhost:3000` to spin up a mock room from the hero section. Code snapshots route through the API helper in `frontend/src/lib/api.ts`.

## Testing & linting

- Frontend: `pnpm lint`
- Backend: `python -m compileall backend/app` (lightweight static check) and add `pytest` as the service layer grows.

## Docker images

- `backend/Dockerfile` – installs FastAPI dependencies and runs `uvicorn`.
- `frontend/Dockerfile` – builds the Next.js standalone bundle via pnpm.

Build locally:

```bash
docker build -t mockloop-backend -f backend/Dockerfile .
docker build -t mockloop-frontend -f frontend/Dockerfile .
```

## GitHub Actions → DigitalOcean Kubernetes

`.github/workflows/ci-deploy.yml` performs:

1. Frontend lint/build via pnpm.
2. Backend dependency install + byte-compilation.
3. Builds & pushes Docker images to `registry.digitalocean.com/mockloop`.
4. Applies `app.yml` to the target DigitalOcean Kubernetes cluster (requires `DIGITALOCEAN_ACCESS_TOKEN` + `DO_CLUSTER_NAME` secrets, along with registry credentials).

`app.yml` defines two deployments (frontend + backend), ClusterIP services, and a dual-host ingress (`app.mockloop.com` and `api.mockloop.com`). Adjust replica counts, resource requests, or add sealed secrets before productionizing.

## Next steps

- Wire real authentication (NextAuth or custom) so session cookies proxy to FastAPI.
- Replace the placeholder `MockInterviewEngine` with actual LLM orchestration + scoring pipeline (per PLAN.md section 4/5).
- Add persistence for session history and trend charts backing the dashboard sidebar.
- Expand GitHub Actions with integration tests and staged rollouts (preview env + prod).
