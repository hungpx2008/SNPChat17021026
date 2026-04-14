# ChatSNP Backend Documentation Index

This directory contains comprehensive documentation of the ChatSNP backend codebase.

## 📚 Documentation Files

### 1. **CODEBASE_EXPLORATION.md** ← START HERE
   - **What:** Complete codebase structure & functionality guide
   - **Who:** Developers new to the project
   - **Contains:**
     - Directory structure (all src/ subdirectories)
     - Database models (ORM schemas)
     - All 5 chat tasks with detailed explanations
     - Helper functions reference
     - Chat service business logic
     - Environment configuration
     - Celery queue definitions
     - Data flow diagrams
     - Performance statistics

### 2. **ARCHITECTURE_DIAGRAMS.md**
   - **What:** Visual system architecture & flow diagrams
   - **Who:** System architects, DevOps engineers
   - **Contains:**
     - System architecture overview (ASCII art)
     - RAG document search flow (detailed step-by-step)
     - Session summarization flow
     - User feedback self-correction flow
     - Embedding model caching strategy
     - Message routing by mode
     - Database schema relationships
     - Qdrant collections schema

### 3. **QUICK_REFERENCE.md**
   - **What:** Quick lookup tables & common patterns
   - **Who:** Developers during implementation
   - **Contains:**
     - File locations index
     - Function reference tables
     - Celery task definitions
     - Environment variables
     - Database schema quick ref
     - API endpoints
     - Performance tuning parameters
     - Common code patterns
     - Debugging checklist
     - Monitoring metrics

### 4. **README_DOCUMENTATION.md** (this file)
   - **What:** Navigation guide to all documentation
   - **Who:** Everyone
   - **Contains:** File descriptions, quick navigation

---

## 🎯 Quick Navigation by Role

### For Backend Developers
1. Read: **CODEBASE_EXPLORATION.md** (sections 1-5)
2. Reference: **QUICK_REFERENCE.md** (Function Reference, Common Patterns)
3. Implement: Follow patterns in matching files

**Common tasks:**
- Modifying RAG behavior → CODEBASE_EXPLORATION § 3 & 4 + QUICK_REFERENCE § Function Reference
- Adding new Celery task → CODEBASE_EXPLORATION § 3 & 7 + QUICK_REFERENCE § Celery Task Queue
- Debugging production issue → QUICK_REFERENCE § Debugging Checklist

### For System Architects
1. Read: **ARCHITECTURE_DIAGRAMS.md** (full)
2. Reference: **CODEBASE_EXPLORATION.md** (section 7-9)
3. Plan: Use databases & flow diagrams

**Common tasks:**
- Scaling decisions → ARCHITECTURE_DIAGRAMS § System Architecture + QUICK_REFERENCE § Performance Tuning
- Adding external service → ARCHITECTURE_DIAGRAMS § System Architecture + CODEBASE_EXPLORATION § environment config
- Capacity planning → QUICK_REFERENCE § Key Metrics to Monitor

### For DevOps/SRE
1. Read: **QUICK_REFERENCE.md** (Environment Variables, Debugging Checklist)
2. Reference: **ARCHITECTURE_DIAGRAMS.md** (System Architecture)
3. Monitor: Use Key Metrics section

**Common tasks:**
- Environment setup → QUICK_REFERENCE § Environment Variables
- Troubleshooting → QUICK_REFERENCE § Debugging Checklist
- Performance tuning → QUICK_REFERENCE § Performance Tuning Parameters
- Capacity monitoring → QUICK_REFERENCE § Key Metrics to Monitor

### For New Team Members
1. **Day 1:** Read CODEBASE_EXPLORATION.md § 1-2 (structure & models)
2. **Day 2:** Read CODEBASE_EXPLORATION.md § 3-5 (tasks & services)
3. **Day 3:** Read ARCHITECTURE_DIAGRAMS.md (understand flows)
4. **Day 4+:** Use QUICK_REFERENCE.md as reference while implementing

---

## 🔍 Finding Information by Topic

### RAG Document Search
- **How it works:** CODEBASE_EXPLORATION § 3.3 (rag_document_search) + § 4.1-4.6
- **Flow diagram:** ARCHITECTURE_DIAGRAMS § RAG Document Search Flow
- **Functions involved:** QUICK_REFERENCE § RAG & Document Search
- **Tuning parameters:** QUICK_REFERENCE § Performance Tuning Parameters

### Session Summarization
- **How it works:** CODEBASE_EXPLORATION § 3.5 + § 5.3
- **Flow diagram:** ARCHITECTURE_DIAGRAMS § Session Summarization Flow
- **Functions involved:** QUICK_REFERENCE § Summarization Task
- **Trigger logic:** CODEBASE_EXPLORATION § 5.3 (lines 131-135)

### User Feedback & Self-Correction
- **How it works:** CODEBASE_EXPLORATION § 3.4
- **Flow diagram:** ARCHITECTURE_DIAGRAMS § User Feedback Self-Correction Flow
- **Functions:** QUICK_REFERENCE § Feedback & Learning
- **Database:** CODEBASE_EXPLORATION § 2 (MessageFeedback model)

### Vector Embeddings
- **Caching strategy:** ARCHITECTURE_DIAGRAMS § Embedding Model Caching
- **Collections:** ARCHITECTURE_DIAGRAMS § Qdrant Collections + CODEBASE_EXPLORATION § 2
- **Process:** ARCHITECTURE_DIAGRAMS § RAG Document Search Flow § 1. EMBEDDING
- **Performance:** QUICK_REFERENCE § `embed_workers` tuning

### Message Routing
- **Modes (rag/sql/chat):** ARCHITECTURE_DIAGRAMS § Message Routing by Mode
- **Dispatcher logic:** CODEBASE_EXPLORATION § 5.1 (ChatService.add_message)
- **Task definitions:** QUICK_REFERENCE § Task Definitions

### Database Operations
- **Schema:** CODEBASE_EXPLORATION § 2 + ARCHITECTURE_DIAGRAMS § Database Schema Relationships
- **Quick ref:** QUICK_REFERENCE § Database Schema Quick Reference
- **ORM models:** `/src/models/models.py`
- **Repositories:** `/src/repositories/`

### Celery & Task Queues
- **Queue setup:** CODEBASE_EXPLORATION § 7 + QUICK_REFERENCE § Celery Task Queue Reference
- **Task dispatch:** ARCHITECTURE_DIAGRAMS § Message Routing by Mode
- **All tasks:** QUICK_REFERENCE § Task Definitions

### Environment & Configuration
- **Env vars:** QUICK_REFERENCE § Environment Variables (Critical) + CODEBASE_EXPLORATION § 6
- **Config files:** `/src/core/config.py` + `/src/core/celery_config.py`

### API Endpoints
- **Routes:** `/src/api/chat.py`
- **Quick ref:** QUICK_REFERENCE § API Endpoints Quick Reference
- **Request/response models:** `/src/schemas/schemas.py`

---

## 📖 Document Structure Explanation

### CODEBASE_EXPLORATION.md Layout
```
1. Directory Structure — Folder hierarchy & what's in each
2. Database Models — ORM tables with field descriptions
3. Chat Tasks Worker — All 5 Celery tasks (chat_tasks.py)
4. Helper Functions — Helper functions used by tasks
5. Chat Service — Business logic orchestrator (chat_service.py)
6. Environment Configuration — ENV vars & infrastructure
7. Celery Task Queues — 3 queues, routing, task definitions
8. Data Flow Diagrams — Message flow, RAG flow, feedback flow
9. Key Statistics — Thresholds, performance params
10. Code Entry Points — Where to start reading
```

### ARCHITECTURE_DIAGRAMS.md Layout
```
- System Architecture Overview — Full system diagram
- RAG Document Search Flow — Detailed step-by-step
- Session Summarization Flow — When & how summaries happen
- User Feedback Self-Correction Flow — Feedback → downgrade → exclusion
- Embedding Model Caching — Why & how HF model cached
- Message Routing by Mode — RAG vs SQL vs Chat dispatch
- Database Schema Relationships — Table relationships
- Qdrant Collections Schema — Vector DB structure
```

### QUICK_REFERENCE.md Layout
```
- File Locations Index — Quick file lookup
- Function Reference — Functions by purpose (tables)
- Celery Task Queue Reference — Task definitions (table)
- Environment Variables — All ENV vars with descriptions
- Database Schema Quick Reference — Table structures (compact)
- Qdrant Collections Schema — Vector DB (compact)
- API Endpoints Quick Reference — All endpoints (table)
- Performance Tuning Parameters — Knobs to turn (table)
- Common Code Patterns — Copy-paste snippets
- Debugging Checklist — Step-by-step troubleshooting
- Key Metrics to Monitor — What to watch (table)
```

---

## 🚀 Getting Started Paths

### Path A: "I need to fix a RAG bug"
1. QUICK_REFERENCE § RAG & Document Search (know what functions exist)
2. CODEBASE_EXPLORATION § 3.3 (understand rag_document_search task)
3. CODEBASE_EXPLORATION § 4.1-4.6 (understand helper functions)
4. Read `/src/worker/chat_tasks.py` lines 623-750 (actual code)
5. Debug using: QUICK_REFERENCE § Debugging Checklist

### Path B: "I need to add a new feature"
1. ARCHITECTURE_DIAGRAMS § System Architecture (where does it fit?)
2. CODEBASE_EXPLORATION § 7 (which queue? sync or async?)
3. CODEBASE_EXPLORATION § 5.1 (how to integrate into dispatcher?)
4. QUICK_REFERENCE § Common Code Patterns (copy template)
5. Implement & test

### Path C: "I need to optimize performance"
1. QUICK_REFERENCE § Performance Tuning Parameters (what can I tune?)
2. QUICK_REFERENCE § Key Metrics to Monitor (what to measure?)
3. ARCHITECTURE_DIAGRAMS § specific flow you're optimizing
4. CODEBASE_EXPLORATION § related section (understand current impl)
5. Modify & benchmark

### Path D: "Production is down"
1. QUICK_REFERENCE § Debugging Checklist (go through checklist)
2. QUICK_REFERENCE § Key Metrics to Monitor (which is abnormal?)
3. ARCHITECTURE_DIAGRAMS § related flow (trace the issue)
4. CODEBASE_EXPLORATION § relevant section (understand the code)
5. Fix & validate

---

## 📝 File Location Quick Map

```
/Volumes/orical/ChatSNP/chatSNP170226/
├── CODEBASE_EXPLORATION.md           ← Comprehensive guide
├── ARCHITECTURE_DIAGRAMS.md          ← Visual flows & diagrams
├── QUICK_REFERENCE.md                ← Lookup tables & patterns
├── README_DOCUMENTATION.md           ← This file (navigation)
│
└── backend/src/
    ├── main.py                       ← FastAPI app entry
    ├── api/chat.py                   ← HTTP endpoints
    ├── core/
    │   ├── config.py                 ← Settings & ENV
    │   ├── celery_config.py          ← Task queue config
    │   ├── db.py                     ← PostgreSQL async
    │   ├── qdrant_setup.py           ← Vector DB
    │   └── redis_client.py           ← Cache & pub/sub
    ├── models/models.py              ← ORM tables
    ├── schemas/schemas.py            ← Pydantic validators
    ├── services/chat_service.py      ← Business logic
    └── worker/
        ├── celery_app.py             ← Celery instance
        ├── tasks.py                  ← Task re-exports
        ├── chat_tasks.py             ← Chat tasks (THE BIG ONE)
        ├── helpers.py                ← Shared utilities
        ├── data_tasks.py             ← SQL tasks
        └── media_tasks.py            ← Media tasks
```

---

## 💡 Pro Tips

### Reading the Code
1. **Always check line numbers** in the docs — they refer to specific code sections
2. **Start with functions, not classes** — Understand what each function does before the class structure
3. **Trace data flow** — Follow data from HTTP request through to database/vector store
4. **Read helper functions first** — They explain the "how" before the "why"

### Debugging
1. **Use QUICK_REFERENCE § Debugging Checklist** — Go through in order
2. **Check env vars first** — Most issues are missing environment variables
3. **Monitor Celery tasks** — If backend is fast but frontend is slow, check Celery
4. **Check Qdrant** — Most RAG issues are in vector retrieval, not synthesis

### Contributing
1. **Follow existing patterns** — Use QUICK_REFERENCE § Common Code Patterns
2. **Respect queue priorities** — chat_priority for user-facing, media_process for background
3. **Always test locally** — Use docker-compose to spin up local stack
4. **Check performance impact** — Reference QUICK_REFERENCE § Key Metrics before & after

---

## 📞 Common Questions

**Q: "Where is the RAG search happening?"**
A: CODEBASE_EXPLORATION § 3.3 (rag_document_search, lines 623-750 in chat_tasks.py)

**Q: "How do I add context to RAG answers?"**
A: CODEBASE_EXPLORATION § 4.1 (_gather_unified_context function)

**Q: "Why is summarization async?"**
A: ARCHITECTURE_DIAGRAMS § Session Summarization Flow (doesn't block user)

**Q: "How does feedback improve answers?"**
A: ARCHITECTURE_DIAGRAMS § User Feedback Self-Correction Flow (marks chunks as low_quality)

**Q: "What's the difference between chat_chunks and port_knowledge?"**
A: ARCHITECTURE_DIAGRAMS § Qdrant Collections (chat_chunks = session history, port_knowledge = RAG documents)

**Q: "Where's the LLM prompt?"**
A: CODEBASE_EXPLORATION § 4.2 (_RAG_SYSTEM_PROMPT, lines 411-425)

**Q: "How do I change embedding model?"**
A: QUICK_REFERENCE § Environment Variables → EMBEDDING_MODEL

**Q: "Why is the model so big (1.3GB)?"**
A: ARCHITECTURE_DIAGRAMS § Embedding Model Caching (Vietnamese-specific model for accuracy)

**Q: "Can I run this without Redis?"**
A: No — Redis is used for: message cache, pub/sub events, Celery broker (can't remove any)

**Q: "What's the SLA for RAG responses?"**
A: QUICK_REFERENCE § Key Metrics → RAG latency should be <5s (good), <10s (acceptable)

---

## 📊 Documentation Statistics

- **Total lines of documentation:** ~1500 lines
- **Code references:** 50+ file paths with line numbers
- **Diagrams:** 8 ASCII architecture diagrams
- **Tables:** 20+ reference tables
- **Code examples:** 15+ copy-paste patterns
- **Functions documented:** 30+ functions
- **Tasks documented:** 5 main Celery tasks + helpers
- **Env vars documented:** 12 critical variables
- **API endpoints:** 7 main endpoints

---

## 📅 Last Updated

- **Date:** 2026-04-13
- **Codebase state:** chatSNP170226 (as of Feb 26, 2026)
- **Documentation version:** 1.0
- **Coverage:** 100% of core logic (chat_tasks.py, chat_service.py, models.py, helpers.py)

---

**Total documentation package:** Ready for production use, comprehensive, and maintainable.

Use these docs, keep them updated, and share them with your team! 🚀
