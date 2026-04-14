# ChatSNP Pruning Cleanup Scan Report
**Scan Date:** April 14, 2026  
**Project Path:** /Volumes/orical/ChatSNP/chatSNP170226/

---

## EXECUTIVE SUMMARY

Scan of the ChatSNP project after three pruning tasks reveals:
- ✅ **Genkit pruning**: CLEAN (no source code references found)
- ⚠️  **LlamaIndex pruning**: MOSTLY CLEAN with 1 stale reference
- ⚠️  **Mem0 HTTP pruning**: MOSTLY CLEAN with stale config reference
- ⚠️  **Dead code & Docker**: MOSTLY CLEAN with unused volume reference

---

## 1. GENKIT LEFTOVERS

### Status: ✅ CLEAN (No issues found)

#### Frontend Source Code
- **Result**: No `genkit` or `@genkit-ai` imports in `/frontend/src/**`
- **npm Modules**: Genkit packages exist in `node_modules/` and `package-lock.json` (expected from old deps, not actively imported)
- **dev.ts File**: ✅ Does NOT exist at `/frontend/src/ai/dev.ts` (successfully removed)

#### Verification
```
✓ frontend/src/ — no genkit imports found
✓ package.json — NO genkit dependencies listed (only in package-lock.json from npm install history)
✓ dev.ts successfully deleted
```

---

## 2. LLAMAINDEX LEFTOVERS

### Status: ⚠️  MINOR ISSUE FOUND (1 stale reference in docstring)

#### Backend Python Files
**Files with LlamaIndex references:**
- `backend/src/worker/chat_tasks.py` (line 39)
- `backend/src/services/search/hybrid_search.py` (line 262)

#### Issue #1: Stale LlamaIndex Docstring Comment (FINDINGS)
**File:** `backend/src/worker/chat_tasks.py` (lines 36-40)

```python
def _get_hf_embed_model():
    """Return a cached SentenceTransformer instance (loaded once per Celery worker).

    Replaces the previous LlamaIndex HuggingFaceEmbedding wrapper.  # ← STALE COMMENT
    Uses sentence-transformers directly for lower overhead and fewer dependencies.
    """
```

**Status**: Stale reference in docstring. The function **works correctly** (uses `SentenceTransformer`), but the docstring mentions the old LlamaIndex wrapper being replaced.

**Recommendation**: Update docstring to remove LlamaIndex reference (cosmetic/cleanup only, no functional impact).

---

#### Issue #2: Valid Reference to embed_query() (NO ISSUE)
**File:** `backend/src/services/search/hybrid_search.py` (lines 265, 267)

```python
from src.worker.chat_tasks import _build_qdrant_filter, embed_query

query_vector = embed_query(query)  # ✓ This function exists and works
```

**Status**: ✅ VALID - The `embed_query()` function is defined in `chat_tasks.py` (line 53) and works correctly using `SentenceTransformer`.

---

#### Verification
```
✓ pyproject.toml — NO llama-index dependencies (all removed)
✓ VectorStoreIndex, StorageContext, NodeWithScore — NO references found
✓ HuggingFaceEmbedding — only in docstring comment (stale but not functional)
✓ embed_query() function — exists at line 53, used correctly in hybrid_search.py
```

---

## 3. MEM0 HTTP LEFTOVERS

### Status: ⚠️  STALE CONFIG REFERENCE (No actual HTTP calls found)

#### Backend Changes
**Files with Mem0 references:**
- ✅ `backend/src/core/mem0_local.py` — Local in-process integration (correct)
- ✅ `backend/src/api/memories.py` — Backend API proxy (correct)
- ✅ `backend/src/worker/chat_tasks.py` — Uses local mem0 via `add_memory()` and `search_memories()`

**Code samples verified:**
- Line 22: `# Mem0 is now local (no HTTP) — see src.core.mem0_local` ✅ Correct comment
- Line 139: `from src.core.mem0_local import add_memory` ✅ Uses local integration
- Line 235-240: `search_memories()` calls `src.core.mem0_local` ✅ No HTTP calls

**No HTTP POST calls found** to `mem0:8000` or `MEM0_URL` in backend source code.

---

#### Frontend Changes
**File:** `frontend/src/lib/memory.ts`

**Current State** (CORRECT):
```typescript
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function backendPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  // Routes through backend API (/memories/search, /memories/add)
}
```

**Status**: ✅ Frontend correctly proxies through backend (no direct HTTP to mem0)

---

#### ⚠️  STALE CONFIG REFERENCE
**File:** `frontend/.env.local.example` (line 11)

```
MEM0_URL=http://127.0.0.1:8888
```

**Issue**: This env var is **NOT used** in any source code (verified by grep), but remains in example config.

**Impact**: Low (example file only, not in .env or used in code)

**Recommendation**: Remove `MEM0_URL=` line from `.env.local.example` (cleanup only)

---

#### Docker Compose Verification
**docker-compose.yml:**
```yaml
✓ No mem0 service definition found
✓ No MEM0_URL environment variable in backend/worker services
✓ QDRANT_COLLECTION: mem0_memories ← Used for Mem0 vector storage (correct)
```

---

## 4. DEAD CODE & UNUSED FUNCTIONS

### Status: ✅ CLEAN (Functions removed as expected)

#### Functions NOT Found (Successfully Deleted)
- ❌ `_extract_node_metadata()` — No references (removed)
- ❌ `_extract_snippet()` — No references (removed)
- ❌ `_build_context_and_citations()` (old LlamaIndex version) — No references

**Note**: A NEW `_build_hybrid_context_and_citations()` exists (line 699 in chat_tasks.py) that replaces the old one for hybrid search results (✅ Correct replacement).

---

## 5. DOCKER-COMPOSE.YML ANALYSIS

### Status: ⚠️  UNUSED VOLUME REFERENCE

#### Issue: Orphaned `huggingface-cache` Volume
**File:** `docker-compose.yml` (line 234) and `docker-compose.pro.yml` (line 203)

```yaml
volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  huggingface-cache:     # ← NOT MOUNTED BY ANY SERVICE
  media-data:
  whoosh-index:
  paddle-models:
```

**Finding:**
- Volume is **defined** but **NOT mounted** by any service
- Was originally for `mem0-service` (removed)
- No backend/worker containers reference it

**Impact**: Orphaned volume takes disk space but no functional impact

**Recommendation**: Remove `huggingface-cache:` volume definition (cleanup only)

---

#### Mem0 Service
✅ Confirmed: Mem0 Docker service **completely removed** from docker-compose.yml

---

## 6. DETAILED FINDINGS TABLE

| Item | Location | Status | Notes |
|------|----------|--------|-------|
| Genkit imports | frontend/src/ | ✅ CLEAN | No source code references |
| dev.ts file | frontend/src/ai/ | ✅ REMOVED | File does not exist |
| LlamaIndex docstring | chat_tasks.py:39 | ⚠️  STALE | Comment mentions old wrapper (works correctly) |
| embed_query() usage | hybrid_search.py:265,267 | ✅ VALID | Function exists and works |
| VectorStoreIndex/StorageContext | backend/src/ | ✅ CLEAN | No references |
| mem0 HTTP calls | backend/src/ | ✅ CLEAN | No HTTP to mem0 found |
| MEM0_URL in frontend | .env.local.example | ⚠️  STALE | Not used in code |
| mem0 service | docker-compose.yml | ✅ REMOVED | Service definition deleted |
| huggingface-cache volume | docker-compose.yml | ⚠️  ORPHANED | Defined but not mounted |
| _extract_node_metadata() | backend/src/ | ✅ REMOVED | No references |
| _build_context_and_citations() old | backend/src/ | ✅ REMOVED | Replaced by hybrid version |

---

## 7. SUMMARY OF CLEANUP ACTIONS NEEDED

### High Priority (Functional cleanup):
None identified. Code is functional.

### Medium Priority (Stale references - cosmetic):
1. **chat_tasks.py line 39**: Update docstring to remove LlamaIndex reference
   ```python
   # OLD: "Replaces the previous LlamaIndex HuggingFaceEmbedding wrapper."
   # NEW: "Uses sentence-transformers directly for lower overhead and fewer dependencies."
   ```

### Low Priority (Config cleanup - optional):
1. **frontend/.env.local.example line 11**: Remove unused `MEM0_URL=` line
2. **docker-compose.yml line 234**: Remove `huggingface-cache:` volume definition
3. **docker-compose.pro.yml line 203**: Remove `huggingface-cache:` volume definition

---

## 8. CONCLUSION

✅ **Pruning was SUCCESSFUL** - All three major components (Genkit, LlamaIndex, Mem0 HTTP) have been cleanly removed from the codebase.

**Remaining items are minor:**
- 1 stale docstring comment (functional, not impact)
- 1 unused environment variable in example config (not in active .env)
- 1 orphaned Docker volume definition (not mounted, no impact)

**No broken code or missing dependencies detected.**

