# ChatSNP Backend (FastAPI)

This service persists chat conversations, manages semantic retrieval, and exposes HTTP APIs for the Next.js frontend.

## Prerequisites

- Python 3.10+
- Docker & Docker Compose
- `docker-compose.yml` and `.env.databases` at repository root (already provided)

## Setup

1. Copy the database environment template and adjust secrets if needed:

   ```bash
   cp .env.databases.example .env.databases
   ```

2. Start the infrastructure services (PostgreSQL, Qdrant, Redis):

   ```bash
   docker compose up -d
   ```

3. Install Python dependencies:

   ```bash
   cd backend
   pip install -e .
   ```

4. Create an application `.env` file (optional – defaults connect to local services):

   ```bash
   cat > .env <<'EOF'
   DATABASE_URL=postgresql+asyncpg://chatsnp:chatsnp_password@localhost:5432/chatsnp
   REDIS_URL=redis://localhost:6379/0
   QDRANT_URL=http://localhost:6333
   CHAT_MAX_SESSIONS=100
   EOF
   ```

## Running the API

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Key Endpoints

- `POST /sessions` – create a chat session
- `GET /sessions?user_id=...` – list sessions for a user
- `GET /sessions/{session_id}` – retrieve a session with cached messages
- `POST /sessions/{session_id}/messages` – append a message
- `POST /sessions/search` – semantic retrieval across chat chunks & long-term memory

## Tests & Linting

Run both lint and tests (ensure docker services are running first):

```bash
cd backend
ruff check .
pytest
```

## Notes

- Embedding generation uses a deterministic mock (`app/embeddings.py`). Replace with a real embedding model when ready.
- The service enforces a maximum of 100 sessions per user. Overflow sessions are summarised and stored inside Qdrant long-term memory before deletion from PostgreSQL.
- Redis caches the most recent conversation window per session for fast reads. Cache TTL is 1 hour by default.
