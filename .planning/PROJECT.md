# Smart2Brain Techniques Integration

## Vision
Port 5 proven techniques from obsidian-Smart2Brain into ChatSNP to improve context management, search quality, summarization intelligence, and conversation flexibility.

## Stack
- **Backend:** FastAPI + Celery + PostgreSQL + Redis + Qdrant
- **Frontend:** Next.js 15 App Router (TypeScript)
- **LLM:** OpenRouter (gpt-4o-mini), Embedding: Vietnamese_Embedding_v2 (1024-dim)
- **Memory:** Mem0 service

## Approach
Direct port — translate TypeScript logic/constants to Python, adapt for server-side architecture. Keep original thresholds and algorithms (battle-tested in Smart2Brain production).

## Design Spec
`/docs/superpowers/specs/2026-04-13-smart2brain-techniques-design.md`

## Key Decisions
- Vietnamese token estimation: TOKENS_PER_WORD_VI = 1.8 (vs 1.3 English)
- Budget allocation: 85% context window, 15% response reserve
- Summarization: token-aware triggers replace hardcoded "every 10 messages"
- Search: Hybrid (Semantic + BM25 + RRF fusion)
- Conversation: Tree structure with branching support
