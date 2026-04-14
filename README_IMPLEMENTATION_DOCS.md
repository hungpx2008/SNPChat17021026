# ChatSNP Implementation Documentation

**Generated:** April 13, 2026  
**Location:** `/Volumes/orical/ChatSNP/chatSNP170226/`

---

## 📚 DOCUMENTATION OVERVIEW

This package contains three comprehensive analysis documents for the ChatSNP RAG system:

### 1. **IMPLEMENTATION_REPORT.md** (46 KB) — COMPLETE REFERENCE
**Best for:** Developers, architects, deep technical understanding

**Contains:**
- ✅ Complete file paths with exact line numbers
- ✅ Full function signatures and docstrings
- ✅ Complete data structures (ChunkData, Qdrant payloads, etc.)
- ✅ All environment configuration variables
- ✅ Database schema overview
- ✅ End-to-end flowcharts with ASCII diagrams
- ✅ 6 major sections with detailed subsections
- ✅ Key insights & design patterns

**Table of Contents:**
1. Document Ingestion Pipeline (Docling) — Lines 607, 336, 181, 243, 643
2. RAG Search Flow — Lines 623, 636-660, 171, 283, 344, 428
3. Mode Selection & Dispatch — Lines 13-96, 64-139, 78-98
4. Redis Usage & Caching — Cache keys, TTL, Pub/Sub implementation
5. Qdrant Setup & Collections — Schema, payload structure, indexes
6. End-to-End Data Flow — Upload-to-RAG complete pipeline

---

### 2. **QUICK_REFERENCE.md** (7.3 KB) — AT-A-GLANCE GUIDE
**Best for:** Quick lookups, debugging, during development

**Contains:**
- ✅ Key entry points with flow diagrams
- ✅ File locations with primary functions
- ✅ Critical configuration (19 key env vars)
- ✅ Queue & task names (6 Celery tasks)
- ✅ Collections in Qdrant (3 collections)
- ✅ Critical functions & line numbers (15 key functions)
- ✅ Debugging checklist (5 common issues)
- ✅ Example JSON payloads

**Perfect for:**
- Finding the right file fast
- Understanding which task handles what
- Debugging document ingestion
- Checking configuration defaults
- Copy-paste JSON examples

---

### 3. **IMPLEMENTATION_SUMMARY.md** (22 KB) — EXECUTIVE OVERVIEW
**Best for:** Managers, onboarding, quick briefings

**Contains:**
- ✅ Executive summary (2 paragraphs)
- ✅ Critical files table (exact line ranges)
- ✅ Visual dataflow diagrams (2 complete flows)
- ✅ Data structure definitions (4 main types)
- ✅ Complete environment config (organized by category)
- ✅ Mode dispatch logic with code examples
- ✅ Collections overview table
- ✅ Key design patterns (5 critical patterns)
- ✅ Complete file paths summary
- ✅ Quick debugging commands

**Perfect for:**
- Understanding the architecture at a glance
- Onboarding new team members
- Architecture reviews
- Status reports
- Presentations

---

## 🎯 HOW TO USE THESE DOCS

### **Use Case: "I need to understand the document ingestion pipeline"**
→ Read: **IMPLEMENTATION_REPORT.md** → Section 1 (Document Ingestion Pipeline)
→ Also: **QUICK_REFERENCE.md** → Table: "Critical Functions & Line Numbers"

### **Use Case: "Document is not appearing in RAG searches"**
→ Read: **QUICK_REFERENCE.md** → Section: "Debugging Checklist" → Item 1
→ Alternatively: **IMPLEMENTATION_REPORT.md** → Section 2.2 (Retrieval Pipeline)

### **Use Case: "I need to add a new mode besides Chat/SQL/RAG"**
→ Read: **IMPLEMENTATION_SUMMARY.md** → Section: "Mode Dispatch Logic"
→ Also: **IMPLEMENTATION_REPORT.md** → Section 3 (Mode Selection & Dispatch)
→ Key files: `chat_service.py:64`, `chat.py:78`, `chat-composer.tsx:38`

### **Use Case: "Briefing a stakeholder on RAG architecture"**
→ Use: **IMPLEMENTATION_SUMMARY.md** → Sections 1-3 (Executive + Diagrams)

### **Use Case: "Need to debug slow RAG responses"**
→ Read: **QUICK_REFERENCE.md** → Section: "Debugging Checklist" → Item 5
→ Check: **IMPLEMENTATION_REPORT.md** → Section 2.5 (LLM Synthesis)

### **Use Case: "Configure new embedding model"**
→ Read: **QUICK_REFERENCE.md** → Section: "Critical Configuration" → Embedding
→ Details: **IMPLEMENTATION_REPORT.md** → Section 5 (Qdrant Setup)

---

## 🗺️ KEY ENTRY POINTS

### Document Ingestion
```
File: backend/src/worker/media_tasks.py
Function: process_document (Line 26)
→ Calls: DoclingProcessor.process() [docling_service.py:607]
→ Then: upsert_vectors() [qdrant_setup.py:71]
```

### RAG Search
```
File: backend/src/worker/chat_tasks.py
Function: rag_document_search (Line 623)
→ Calls: VectorStoreIndex.retrieve() [LlamaIndex]
→ Then: _synthesize_with_llm() [chat_tasks.py:428]
→ Then: publish_task_complete() [helpers.py:118]
```

### Mode Dispatch
```
File: backend/src/services/chat_service.py
Function: add_message (Line 64)
→ Reads: message.mode (from MessageCreate schema)
→ Dispatches: rag_document_search.delay() or run_sql_query.delay() or process_chat_response.delay()
```

---

## 📊 DOCUMENT CROSS-REFERENCES

| Topic | IMPL_REPORT | QUICK_REF | SUMMARY |
|-------|---|---|---|
| Docling Chunking | Sect. 1.3 | "Critical Functions" | "Design Patterns" |
| Qdrant Collections | Sect. 5.2 | Table "Collections" | Table "Collections" |
| Configuration | Sect. 6.2 | "Critical Config" | "Env Configuration" |
| Mode Selection | Sect. 3 | "Mode Dispatch" | "Mode Dispatch Logic" |
| Redis Caching | Sect. 4 | "Redis Keys" | "Caching & Real-time" |
| LLM Synthesis | Sect. 2.5 | "Critical Functions" | "Design Patterns" |
| Debugging | Multiple | "Debugging Checklist" | "Quick Debugging" |
| Data Structures | Sect. 6.2 | "Data Structures" | "Data Structures" |

---

## 🔍 FINDING SPECIFIC INFORMATION

### **What file handles X?**
→ See: **IMPLEMENTATION_SUMMARY.md** → Critical Files table
→ Or: **QUICK_REFERENCE.md** → File Locations table

### **What is the function signature for Y?**
→ See: **IMPLEMENTATION_REPORT.md** → Look for function name
→ Or: **QUICK_REFERENCE.md** → Critical Functions table

### **What is line X in file Y?**
→ See: **IMPLEMENTATION_SUMMARY.md** → Critical Files table with line ranges
→ Or: Open the file directly (all paths are absolute)

### **How does the data flow from A to B?**
→ See: **IMPLEMENTATION_REPORT.md** → Section 6 (End-to-End Dataflow)
→ Or: **IMPLEMENTATION_SUMMARY.md** → Dataflow Diagrams

### **What environment variables affect X?**
→ See: **QUICK_REFERENCE.md** → Critical Configuration section
→ Or: **IMPLEMENTATION_REPORT.md** → Section 6.2 (Configuration Summary)

### **How do I debug X?**
→ See: **QUICK_REFERENCE.md** → Debugging Checklist
→ Or: **IMPLEMENTATION_SUMMARY.md** → Quick Start Debugging

---

## 📋 SECTION QUICK-FIND

### IMPLEMENTATION_REPORT.md
- **1. Document Ingestion Pipeline (Docling)** — Lines 1-250
  - 1.1 Entry Point: process_document task
  - 1.2 File Type Branches (Image vs Document)
  - 1.3 Docling Deep Processing (HybridChunker, VLM, Group Lock)
  - 1.4 Chunk Creation & Storage

- **2. RAG Search Flow** — Lines 250-520
  - 2.1 RAG Task Entry Point
  - 2.2 Retrieval Pipeline (LlamaIndex + Qdrant)
  - 2.3 Access Control & Quality Filter
  - 2.4 Context Assembly (Unified + Mem0)
  - 2.5 LLM Synthesis
  - 2.6 Post-Processing & Storage

- **3. Mode Selection & Dispatch** — Lines 520-650
  - 3.1 Frontend Mode Selection UI
  - 3.2 Backend Mode Dispatch
  - 3.3 API Response Signaling

- **4. Redis Usage & Caching** — Lines 650-850
  - 4.1 Redis Client Setup
  - 4.2 Session Message Cache
  - 4.3 Cache Updates on New Message
  - 4.4 Pub/Sub for Real-Time
  - 4.5 Publishing Task Completion

- **5. Qdrant Setup & Collections** — Lines 850-950
  - 5.1 Client & Configuration
  - 5.2 Collections & Schemas
  - 5.3 Upsert & Search Functions
  - 5.4 Payload Structure

- **6. End-to-End Data Flow** — Lines 950+
  - 6.1 Document Upload → RAG Complete
  - 6.2 Configuration Summary
  - 6.3 Database Schema

### QUICK_REFERENCE.md
- Key Entry Points
- File Locations
- Data Structures
- Configuration (organized by category)
- Queue & Task Names
- Collections in Qdrant
- Mode Dispatch Flow
- Critical Functions & Line Numbers
- Debugging Checklist
- Example Payloads

### IMPLEMENTATION_SUMMARY.md
- Executive Summary
- Critical Files & Line Numbers
- Dataflow Diagrams (2)
- Data Structures
- Environment Configuration
- Mode Dispatch Logic with Code
- Collections Table
- Design Patterns
- Complete File Paths
- Quick Debugging

---

## 🚀 QUICK START

1. **Onboarding?** → Read IMPLEMENTATION_SUMMARY.md (20 min)
2. **Need details?** → Read IMPLEMENTATION_REPORT.md (40 min)
3. **Debugging?** → Use QUICK_REFERENCE.md (5 min + action)
4. **Briefing?** → Show dataflow diagrams from IMPLEMENTATION_SUMMARY.md

---

## 📞 DOCUMENT METADATA

| Document | Size | Sections | Tables | Diagrams | Code Examples |
|----------|------|----------|--------|----------|---|
| IMPLEMENTATION_REPORT.md | 46 KB | 6 major | 25+ | 2 | 100+ |
| QUICK_REFERENCE.md | 7.3 KB | 10 | 8 | 1 | 3 |
| IMPLEMENTATION_SUMMARY.md | 22 KB | 10 | 6 | 2 | 5 |

**Total Coverage:** 75+ KB of documentation  
**Total Code Examples:** 108+  
**Total Tables:** 39+  
**Total Line Numbers Referenced:** 1000+ specific line numbers  
**Total Files Documented:** 9 primary files

---

## ✅ COVERAGE CHECKLIST

- ✅ Document ingestion (end-to-end)
- ✅ Docling HybridChunking with AdaptiveTableSerializer
- ✅ Table group-locking (row_keys merging)
- ✅ VLM image processing (smart filtering)
- ✅ RAG retrieval (top-k + filtering)
- ✅ LlamaIndex integration
- ✅ Qdrant collections & schemas
- ✅ Redis caching (cache keys, TTL, Pub/Sub)
- ✅ Real-time delivery (SSE + heartbeat)
- ✅ Mode selection (Chat/SQL/RAG)
- ✅ Task dispatch (Celery queues)
- ✅ LLM synthesis (OpenAI integration)
- ✅ Citation generation & deduplication
- ✅ Access control & quality filtering
- ✅ Negative feedback mechanism
- ✅ Configuration (all 30+ env vars)
- ✅ Data structures (4+ types)
- ✅ Database schema (3+ tables)
- ✅ Debugging guidance (5+ scenarios)

---

## 📝 NOTES FOR FUTURE UPDATES

If modifying ChatSNP, update these docs:

1. **Adding a new collection to Qdrant?**
   → Update: IMPLEMENTATION_REPORT.md (Sect. 5.2), QUICK_REFERENCE.md (Collections table), IMPLEMENTATION_SUMMARY.md (Collections table)

2. **Changing embedding model?**
   → Update: QUICK_REFERENCE.md (Critical Config), IMPLEMENTATION_REPORT.md (Sect. 6.2)

3. **Adding a new RAG processing step?**
   → Update: IMPLEMENTATION_REPORT.md (Sect. 2), IMPLEMENTATION_SUMMARY.md (Dataflow 2)

4. **Changing Docling chunking logic?**
   → Update: IMPLEMENTATION_REPORT.md (Sect. 1.3), QUICK_REFERENCE.md (Critical Functions)

5. **Adding a new mode?**
   → Update: IMPLEMENTATION_REPORT.md (Sect. 3), IMPLEMENTATION_SUMMARY.md (Mode Dispatch Logic)

---

**All documentation generated April 13, 2026**  
**Project:** ChatSNP (Vietnamese Language RAG System)  
**Contact:** Development Team  

