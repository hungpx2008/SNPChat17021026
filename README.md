# ChatSNP Monorepo

ChatSNP là ứng dụng chat với bộ nhớ dài hạn, gồm:
- Frontend: Next.js.
- Backend: FastAPI (Postgres/Redis/Qdrant).
- Mem0: dịch vụ bộ nhớ dài hạn (embedding HF, LLM qua OpenRouter/LM Studio).

```
.
├── backend/          # FastAPI service (chat persistence, RAG, REST API)
├── frontend/         # Next.js application (UI)
├── mem0/             # Mem0 server + core lib
├── docker/           # Database bootstrap scripts
├── docker-compose.yml        # Infra only
├── docker-compose.full.yml   # All services (frontend+backend+mem0+infra)
└── docs/
```

## Yêu cầu
- Docker & Docker Compose
- Node 20+ (nếu chạy frontend dev)
- Python 3.11 (nếu chạy backend dev)

## Cấu hình môi trường
Điền các file sau (dùng placeholders nếu chưa có khóa):
- `.env.databases`: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `backend/.env`: `DATABASE_URL`, `REDIS_URL`, `QDRANT_HOST/PORT`, CORS…
- `frontend/.env.local`: `NEXT_PUBLIC_BACKEND_URL`, `MEM0_URL`, các key Firebase/LLM nếu dùng
- `mem0/server/.env`: `OPENAI_API_KEY`/`OPENROUTER_API_KEY`, `HF_TOKEN`, `EMBEDDING_DIM=1024`, `QDRANT_HOST/PORT`

## Chạy nhanh (tất cả bằng Docker)
```bash
docker compose -f docker-compose.full.yml up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Mem0:     http://localhost:8888
```

## Chạy dev thủ công
### Backend
```bash
docker compose up -d postgres redis qdrant
cd backend
pip install -e .
uvicorn app.main:app --reload
```

### 🚀 Deployment (Simplified)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hungpx2008/SNPChat17021026.git
    cd SNPChat17021026
    ```

2.  **Setup Environment:**
    Copy the example configuration to a real `.env` file:
    ```bash
    cp .env.example .env
    ```
    *Edit `.env` and fill in your secrets (API Keys, Passwords).*

3.  **Run with Docker Compose:**
    ```bash
    docker compose -f docker-compose.full.yml up -d --build
    ```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

## Kiểm thử
- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm run lint`
