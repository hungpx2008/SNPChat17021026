# ChatSNP Project Analysis - Complete Index

**Date**: April 13, 2026  
**Project**: ChatSNP - Vietnamese Port Authority Intelligent Chatbot  
**Focus**: Memory System, Chat Pipeline, RAG, Context Management, System Prompts

---

## 📚 Documentation Files

### 🟢 **PRIMARY DOCUMENTS** (Created Today)

#### 1. **ARCHITECTURE_ANALYSIS.md** (29 KB, 952 lines)
**The definitive technical reference**
- Complete architecture breakdown
- Detailed code walkthroughs with examples
- All system prompts documented
- Performance patterns explained
- Security model detailed

**Key Sections:**
- 🧠 Memory System (Mem0 integration, storage, retrieval, consolidation)
- 💬 Chat Processing Pipeline (flow, chunking, caching, SSE streaming)
- 🔍 RAG Pipeline (search, context assembly, LLM synthesis, citations)
- 📊 Context Management (caching strategy, metadata, feedback loop)
- 🎯 System Prompts & Templates (all 6 prompts with usage context)
- 📈 Performance Patterns (parallelization, singleton loading, indexing)
- 🔐 Security & Data Handling (access control, SQL safety, error handling)
- 💡 Key Design Patterns (10 core patterns explained)

**Use When:** You need deep understanding of how systems work together

---

#### 2. **QUICK_REFERENCE.md** (18 KB, 475 lines)
**Fast lookup guide with visual diagrams**
- ASCII architecture diagrams
- Flow diagrams for each pipeline
- Configuration quick reference
- Helper function summaries
- Security checklist
- File navigation table

**Key Sections:**
- 🎯 Core Architecture at a Glance (full system diagram)
- 📋 Message Processing Flow (user → task dispatch → response)
- 🧠 Dual Memory Model (triggering conditions + retrieval)
- 🔄 Chat to Qdrant Pipeline (chunking, embedding, storage)
- 🔍 RAG Pipeline (step-by-step detailed flow)
- 📊 System Prompts Summary (table of all prompts)
- 🔧 Key Helper Functions (quick code reference)
- 📈 Performance Wins (optimization techniques at a glance)

**Use When:** You need to quickly find how something works, or copy a pattern

---

### 🟡 **EXISTING DOCUMENTS** (In Repository)

#### 3. **PROJECT_CONTEXT.md** (18 KB)
Overview of project goals and existing implementation

#### 4. **architecture_overview.md** (8.7 KB)
High-level architecture description

#### 5. **PERFORMANCE_FIX_PLAN.md** (7.5 KB)
Performance optimization roadmap

#### 6. **README.md** (7.5 KB)
Project setup and installation guide

---

## 🗺️ Navigation Guide

### By Topic

| Topic | Location | Best Resource |
|-------|----------|---|
| **Mem0 Integration** | `src/core/mem0_config.py` | ARCHITECTURE_ANALYSIS.md § 1-4 |
| **Memory Storage** | `src/worker/chat_tasks.py::store_memory()` | ARCHITECTURE_ANALYSIS.md § 1.3 |
| **Memory Retrieval** | `src/services/chat_service.py::semantic_search()` | ARCHITECTURE_ANALYSIS.md § 1 |
| **Memory Consolidation** | `src/worker/gardener_tasks.py` | ARCHITECTURE_ANALYSIS.md § 1.4 |
| **Chat Message Processing** | `src/worker/chat_tasks.py::process_chat_response()` | ARCHITECTURE_ANALYSIS.md § 2.2 |
| **Smart Chunking** | `src/worker/helpers.py::_smart_chunk()` | QUICK_REFERENCE.md § Chunking |
| **RAG Search** | `src/worker/chat_tasks.py::rag_document_search()` | ARCHITECTURE_ANALYSIS.md § 3 |
| **LLM Synthesis** | `src/worker/chat_tasks.py::_synthesize_with_llm()` | ARCHITECTURE_ANALYSIS.md § 3.5-6 |
| **Citations** | `src/worker/chat_tasks.py::_build_context_and_citations()` | ARCHITECTURE_ANALYSIS.md § 3.3 |
| **Caching** | `src/services/chat_service.py` | ARCHITECTURE_ANALYSIS.md § 4.1 |
| **SSE Streaming** | `src/api/chat.py::stream_session()` | ARCHITECTURE_ANALYSIS.md § 2.4 |
| **Feedback Loop** | `src/worker/chat_tasks.py::process_feedback()` | ARCHITECTURE_ANALYSIS.md § 4.4 |
| **System Prompts** | `src/worker/chat_tasks.py` (line ~411+) | ARCHITECTURE_ANALYSIS.md § 5 |
| **SQL Agent** | `src/worker/data_tasks.py` | ARCHITECTURE_ANALYSIS.md § 5.4 |

### By Goal

**Understanding the overall flow?**
1. Start: QUICK_REFERENCE.md § "Core Architecture at a Glance"
2. Then: QUICK_REFERENCE.md § "Message Processing Flow"
3. Deep dive: ARCHITECTURE_ANALYSIS.md § 2 (Chat Processing)

**Implementing a new feature?**
1. Check: QUICK_REFERENCE.md § "Quick Navigation" for file locations
2. Reference: ARCHITECTURE_ANALYSIS.md § "Key Design Patterns"
3. Copy pattern from similar task (chat_tasks.py, data_tasks.py, gardener_tasks.py)

**Debugging a problem?**
1. Identify pipeline: Chat vs RAG vs SQL vs Memory
2. Check corresponding section in ARCHITECTURE_ANALYSIS.md
3. Find helper functions in QUICK_REFERENCE.md § "Key Helper Functions"
4. Search source code with file locations from navigation table

**Performance optimization?**
1. Review: ARCHITECTURE_ANALYSIS.md § "Performance Patterns"
2. Check: QUICK_REFERENCE.md § "Performance Wins"
3. Verify: Already implemented patterns match the codebase

**Security audit?**
1. Review: ARCHITECTURE_ANALYSIS.md § "Security & Data Handling"
2. Check: QUICK_REFERENCE.md § "Security Checklist"
3. Verify access controls, SQL safety, error handling

---

## 🔑 Key Takeaways

### Memory System
- **Dual-memory**: Long-term (Mem0) + Short-term (Qdrant)
- **Automatic storage**: Messages > 10 chars → stored in Mem0
- **Nightly gardener**: Daily consolidation (dedup, importance scoring)
- **Unified retrieval**: Both sources searched in parallel

### Chat Processing
- **Async-first**: All intensive operations as Celery tasks
- **Three task queues**: chat_priority, data_batch, media_process
- **Real-time updates**: SSE streaming (no polling)
- **Mode-based dispatch**: User specifies "chat", "rag", or "sql"

### RAG Pipeline
- **Unified context**: Memories + summary + recent history + documents
- **Access control**: User/department-based filtering
- **Citation tracking**: Dedup + store chunk IDs for feedback
- **Self-correction**: User feedback marks chunks as low-quality

### Context Management
- **Redis caching**: 1-hour TTL, append-only updates
- **Metadata storage**: Session summary, message attachments, chunk IDs
- **Feedback loop**: Dislikes mark chunks for exclusion in future searches

### System Prompts
- **6 distinct prompts**: RAG, Summary, Gardener, SQL, Table Enrichment, Image
- **Vietnamese-first**: All responses in Vietnamese with culturally-aware tone
- **Safety-conscious**: Currency preservation, honest uncertainty, honest error messages
- **Structured output**: JSON where needed, Markdown for tables

### Performance
- **Parallel embedding**: 8 threads × 8x speedup
- **Model caching**: Loaded once per Celery worker (~1.3 GB)
- **Query optimization**: Single JOIN instead of 2 separate queries
- **Vector indexes**: Fast filtered search on user_id, department, quality

### Security
- **Access control**: OR logic (user's chunks OR public+dept) with quality gate
- **SQL safety**: Forbids all mutation operations (SELECT-only)
- **Error hiding**: Never expose SQL/tracebacks, always friendly Vietnamese
- **Feedback accuracy**: Store exact chunk IDs for precise self-correction

---

## 🏗️ File Structure Reference

```
backend/
├── src/
│   ├── core/
│   │   ├── mem0_config.py           ← Mem0 embedding proxy
│   │   ├── qdrant_setup.py          ← Qdrant collections + search
│   │   ├── config.py                ← Settings validation
│   │   ├── db.py                    ← Database connection
│   │   └── redis_client.py          ← Redis caching
│   │
│   ├── services/
│   │   ├── chat_service.py          ← Chat business logic + cache
│   │   ├── docling_service.py       ← Document processing
│   │   └── ...
│   │
│   ├── worker/
│   │   ├── chat_tasks.py            ← Chat, memory, RAG, feedback
│   │   ├── data_tasks.py            ← SQL agent
│   │   ├── gardener_tasks.py        ← Memory consolidation
│   │   ├── helpers.py               ← Chunking, enrichment, utilities
│   │   └── media_tasks.py           ← Document/audio processing
│   │
│   ├── api/
│   │   ├── chat.py                  ← REST endpoints + SSE
│   │   └── ...
│   │
│   ├── models/
│   │   └── models.py                ← SQLAlchemy ORM
│   │
│   └── main.py                      ← FastAPI app
│
├── tests/
│   ├── conftest.py
│   ├── test_chat_flow.py
│   └── test_main.py
│
└── .env                             ← Configuration
```

---

## 🚀 Common Tasks Quick Start

### Add a new memory type
1. See ARCHITECTURE_ANALYSIS.md § 1.3 (Memory Storage Pipeline)
2. Add to Mem0 POST payload in `store_memory()`
3. Update retrieval logic in `semantic_search()`

### Modify RAG system prompt
1. Find in ARCHITECTURE_ANALYSIS.md § 5.1
2. Edit `_RAG_SYSTEM_PROMPT` in `src/worker/chat_tasks.py` (line ~411)
3. Test with various questions to verify tone/accuracy

### Optimize embedding parallelization
1. Check ARCHITECTURE_ANALYSIS.md § 2.2 (Chunking Strategy)
2. Adjust ThreadPoolExecutor `max_workers` in `process_chat_response()`
3. Benchmark with different worker counts

### Add access control rule
1. Review ARCHITECTURE_ANALYSIS.md § 3.2 (Access Control Filter)
2. Modify `_build_qdrant_filter()` logic
3. Ensure backward compatibility with existing filters

### Add new helper function
1. Follow patterns in `src/worker/helpers.py`
2. Document with docstring + examples
3. Reference in QUICK_REFERENCE.md § "Key Helper Functions"

---

## 📞 Quick Fact Reference

| Metric | Value | Location |
|--------|-------|----------|
| Embedding dimension | 1024 | `EMBEDDING_DIMENSION` env var |
| Chat chunk size | 512 | `CHAT_CHUNK_SIZE` env var |
| Chunk overlap | 50 | `_smart_chunk()` hardcoded |
| RAG score threshold | 0.35 | `RAG_SCORE_THRESHOLD` env var |
| Redis cache TTL | 1 hour | `chat_service.py::add_message()` |
| Summary max chars | 500 | `summarize_session_history()` |
| Summary temperature | 0.1 | `summarize_session_history()` |
| RAG temperature | 0.3 | `_synthesize_with_llm()` |
| Table enrichment temp | 0.0 | `_llm_enrich_table()` |
| Image analysis tokens | 1500 | `_extract_text_from_image()` |
| Parallel embed workers | 8 (max) | `process_chat_response()` |
| Mem0 timeout | 300s | `store_memory()` |
| HTTP default timeout | 10-30s | Various `get_http_client()` calls |
| Message count at summary | 10 | `add_message()` check |
| Memory storage trigger | >10 chars | `add_message()` check |
| Gardener schedule | Daily 2:00 AM | Celery Beat config |
| Top-k retrieval | 5 | `as_retriever(similarity_top_k=5)` |
| Importance score range | 1-10 | `consolidate_memories()` |
| Port ops importance | 8-10 | `consolidate_memories()` prompt |
| Personal info importance | 3-5 | `consolidate_memories()` prompt |
| Social importance | 1-2 | `consolidate_memories()` prompt |

---

## 🎓 Learning Path

### Beginner (30 minutes)
1. Read QUICK_REFERENCE.md § "Core Architecture at a Glance"
2. Read QUICK_REFERENCE.md § "Message Processing Flow"
3. Understand: User → API → Task Queue → Workers → Response

### Intermediate (2 hours)
1. Read ARCHITECTURE_ANALYSIS.md § 2 (Chat Processing)
2. Read ARCHITECTURE_ANALYSIS.md § 1 (Memory System)
3. Read QUICK_REFERENCE.md § "Dual Memory Model"
4. Understand: How messages flow, how memory is stored/retrieved

### Advanced (4 hours)
1. Read ARCHITECTURE_ANALYSIS.md § 3 (RAG Pipeline) - full section
2. Read ARCHITECTURE_ANALYSIS.md § 5 (System Prompts) - all prompts
3. Read ARCHITECTURE_ANALYSIS.md § 4 (Context Management)
4. Understand: How RAG search works, how context is assembled, how LLM is prompted

### Expert (8 hours)
1. Read entire ARCHITECTURE_ANALYSIS.md
2. Read all source files referenced in navigation table
3. Study existing tests in `backend/tests/`
4. Experiment: Create a test task that demonstrates a pattern

---

## 🔗 Cross-References

### System Prompts Location Map
- **RAG System**: ARCHITECTURE_ANALYSIS.md § 5.1 & file line ~411
- **Summary**: ARCHITECTURE_ANALYSIS.md § 5.2 & `gardener_tasks.py` line ~899
- **Gardener**: ARCHITECTURE_ANALYSIS.md § 5.3 & `gardener_tasks.py` line ~89
- **SQL Agent**: ARCHITECTURE_ANALYSIS.md § 5.4 & `data_tasks.py` line ~42
- **Table Enrichment**: ARCHITECTURE_ANALYSIS.md § 5.5 & `helpers.py` line ~91
- **Image Analysis**: ARCHITECTURE_ANALYSIS.md § 5.6 & `helpers.py` line ~45

### Key Functions Location Map
- **embed_text**: `src/core/mem0_config.py` (embedding via Mem0)
- **process_chat_response**: `src/worker/chat_tasks.py` (chat processing)
- **rag_document_search**: `src/worker/chat_tasks.py` (RAG search)
- **store_memory**: `src/worker/chat_tasks.py` (memory storage)
- **consolidate_memories**: `src/worker/gardener_tasks.py` (nightly dedup)
- **_smart_chunk**: `src/worker/helpers.py` (semantic chunking)
- **_build_context_and_citations**: `src/worker/chat_tasks.py` (citation building)
- **_synthesize_with_llm**: `src/worker/chat_tasks.py` (LLM call)
- **semantic_search**: `src/services/chat_service.py` (dual search)

---

## ✅ Verification Checklist

Before deploying changes:
- [ ] All timeouts are reasonable (Mem0=300s, HTTP=10-30s)
- [ ] Error messages are in Vietnamese
- [ ] SQL queries use SELECT-only
- [ ] Access control filter is applied in RAG
- [ ] Citation deduplication is working
- [ ] Cache TTL is set appropriately
- [ ] Chunking strategy matches document type
- [ ] System prompt tone matches use case
- [ ] Performance wins (parallelization, caching) are active
- [ ] Feedback loop implementation is tested

---

## 📝 Document Versions

**ARCHITECTURE_ANALYSIS.md**
- Created: 2026-04-13
- Scope: Complete technical reference
- Lines: 952
- Includes: All 6 prompts, all 10 design patterns, performance details

**QUICK_REFERENCE.md**
- Created: 2026-04-13
- Scope: Fast lookup guide
- Lines: 475
- Includes: 8 flow diagrams, navigation table, security checklist

**This Index**
- Created: 2026-04-13
- Scope: Navigation + cross-references
- Purpose: Help users find what they need quickly

---

## 🎯 Next Steps

1. **Review** both new documents to get familiar with the structure
2. **Bookmark** QUICK_REFERENCE.md for quick lookup while coding
3. **Reference** ARCHITECTURE_ANALYSIS.md when understanding complex flows
4. **Use** navigation tables to find specific code locations
5. **Check** system prompts before making LLM-related changes
6. **Verify** security checklist before deployment

---

Generated: 2026-04-13  
Project: ChatSNP (Tân Cảng Sài Gòn - Vietnamese Port Authority Chatbot)  
Analyzer: Claude Code

