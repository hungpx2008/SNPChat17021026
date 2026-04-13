# CLAUDE.md — ChatSNP Project

## Auto-GSD (BẮT BUỘC)

Khi user chat bất kỳ yêu cầu nào, TỰ ĐỘNG gọi Skill tool với đúng GSD command — KHÔNG bao giờ bắt user gõ slash command. Mapping:

| User nói gì | Gọi command |
|---|---|
| Muốn làm gì đó (mơ hồ) | `gsd:do` |
| Làm nhanh cái nhỏ | `gsd:fast` |
| Debug / fix bug | `gsd:debug` |
| Review code | `gsd:code-review` |
| Tiếp tục / làm tiếp | `gsd:next` |
| Xem tiến độ | `gsd:progress` |
| Thảo luận ý tưởng | `gsd:explore` |
| Khởi tạo dự án mới | `gsd:new-project` |
| Lên kế hoạch phase | `gsd:plan-phase` |
| Thực thi phase | `gsd:execute-phase` |
| Tạo PR / ship | `gsd:ship` |
| Quay lại session cũ | `gsd:resume-work` |

Nếu không chắc command nào → dùng `gsd:do` (nó sẽ tự route).

## Dự án

**ChatSNP** = AI Chatbot cho Tân Cảng Sài Gòn. Code nằm trong `chatSNP170226/`.

**Stack:** Next.js 15 + FastAPI + Celery + PostgreSQL + Redis + Qdrant + Mem0

## Cấu trúc

- `chatSNP170226/backend/` — FastAPI + Celery (Python 3.10+)
- `chatSNP170226/frontend/` — Next.js 15 App Router (TypeScript)
- `chatSNP170226/mem0-service/` — Mem0 memory server
- `chatSNP170226/docker-compose.yml` — Orchestration (11 services)

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

- 3 agent modes: `chat`, `sql` (Vanna), `rag` (LlamaIndex + Qdrant)
- Auth: chỉ localStorage (chưa JWT)
- SSE qua Redis Pub/Sub → `/sessions/{id}/stream`
- Vietnamese-first cho mọi thứ
