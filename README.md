# ChatSNP Monorepo

This repository contains both the Next.js frontend and the FastAPI backend for ChatSNP.

```
.
├── backend/          # FastAPI service (chat persistence, RAG, REST API)
├── frontend/         # Next.js application (UI)
├── docker/           # Database bootstrap scripts
├── docker-compose.yml
└── docs/
```

## Frontend (Next.js)

```bash
cd frontend
npm install            # or npm ci
cp .env.local.example .env.local  # if you keep an example, otherwise edit existing file
npm run dev            # runs on http://localhost:9002 by default
```

`frontend/.env.local` should at minimum expose the backend URL:

```
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

## Backend (FastAPI)

See `backend/README.md` for detailed instructions. In short:

```bash
docker compose up -d        # start PostgreSQL, Redis, Qdrant
cd backend
pip install -e .
uvicorn app.main:app --reload
```

## Common Scripts

- `docker compose up -d`: boot infrastructure services
- `cd backend && pytest`: backend tests
- `cd frontend && npm run lint`: frontend linting

Feel free to add more services under `docker/` or expand the documentation in `docs/` as needed.
