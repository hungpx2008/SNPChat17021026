# CLAUDE.md — ChatSNP Project

## Cách làm việc

Xử lý yêu cầu trực tiếp, rõ ràng, ngắn gọn và ưu tiên hành động thật trên codebase hiện tại.

Không được in ra pseudo-tool-call, slash command, command nội bộ, hay các dòng điều phối như `gsd:do`, `gsd:do skill`, `Tôi sẽ route đến command phù hợp`, hoặc các câu tương tự.

Nếu có tool/skill thật trong môi trường và cần dùng thì gọi đúng tool theo cơ chế chuẩn của hệ thống. Nếu không có, tiếp tục làm việc trực tiếp mà không nhắc đến tool nội bộ.

## Dự án

**ChatSNP** = AI Chatbot cho Tân Cảng Sài Gòn. Code nằm trong `chatSNP170226/`.

**Stack:** Next.js 15 + FastAPI + Celery + PostgreSQL + Redis + Qdrant + Mem0 (local lib)

## Cấu trúc

- `chatSNP170226/backend/` — FastAPI + Celery (Python 3.10+)
- `chatSNP170226/frontend/` — Next.js 15 App Router (TypeScript)
- `chatSNP170226/docker-compose.yml` — Orchestration (10 services)

## Quy tắc code

- **Backend:** ruff (line-length=100), async everywhere, Pydantic v2, repository pattern
- **Frontend:** shadcn/ui + TailwindCSS, custom hooks, Server Actions
- Error messages to users in **Vietnamese**
- LLM via OpenRouter (gpt-4o-mini), Embedding: Vietnamese_Embedding_v2 (1024-dim)

## Lệnh thường dùng

```bash
cd chatSNP170226 && docker compose --env-file .env up -d --build  # Dev
cd chatSNP170226 && docker compose -f docker-compose.pro.yml --env-file .env up -d --build  # Prod
cd chatSNP170226/backend && pytest  # Test
```

## Deep context (đọc khi cần, KHÔNG load tự động)

- `chatSNP170226/PROJECT_CONTEXT.md` — Full project map
- `.planning/codebase/STACK.md` — Tech stack chi tiết
- `.planning/codebase/ARCHITECTURE.md` — Kiến trúc hệ thống
- `.planning/codebase/STRUCTURE.md` — Cấu trúc thư mục
- `.planning/codebase/CONVENTIONS.md` — Code conventions
- `.planning/codebase/INTEGRATIONS.md` — API & service integrations
- `.planning/codebase/TESTING.md` — Testing patterns
- `.planning/codebase/CONCERNS.md` — Tech debt & issues

## Lưu ý quan trọng

- 3 agent modes: `chat`, `sql` (Vanna), `rag` (Qdrant direct + sentence-transformers)
- Auth: chỉ localStorage (chưa JWT)
- SSE qua Redis Pub/Sub → `/sessions/{id}/stream`
- Vietnamese-first cho mọi thứ
