# LLM Configuration Documentation Index

## 📋 Overview

This directory contains three comprehensive reference documents detailing **ALL places where LLM configuration is set** in the ChatSNP project.

**Created:** April 15, 2026  
**Project:** ChatSNP170226 (Vietnamese AI Chatbot for Tân Cảng Sài Gòn)

---

## 📚 Documentation Files

### 1. **LLM_CONFIG_INVENTORY.md** (20 KB)
**Comprehensive line-by-line reference**

- ✅ Every Docker Compose file (4 files)
- ✅ Every .env file (9 files)
- ✅ Backend source code (5 files)
- ✅ Frontend source code (1 file)
- ✅ Standalone Mem0 service (2 files)
- ✅ Summary table with ALL configuration locations
- ✅ Key observations and mismatches

**Use this when:** You need to find an exact line number, current value, or understand the complete picture of LLM configuration.

---

### 2. **LLM_CONFIG_QUICK_REF.txt** (11 KB)
**Visual summary with architecture diagram**

- 🎯 Configuration by layer (Orchestration → Environment → Source Code)
- 🚨 Critical mismatches detected (5 inconsistencies identified)
- 💡 Recommended fixes with code examples
- 📊 Configuration flow diagram
- 🔐 Secrets management status
- 📋 Files to update priority list

**Use this when:** You want a quick overview, need to understand mismatches, or planning fixes.

---

### 3. **LLM_CONFIG_EDIT_GUIDE.md** (15 KB)
**Step-by-step editing instructions**

- 📍 Exact file paths and line numbers
- 📋 Current values and what to change them to
- 🔧 Code snippets for each change
- ✅ Verification checklist
- 🛠️ Edit workflow with 4 steps
- 📝 Notes on environment variable precedence

**Use this when:** You're actually making changes and need surgical precision.

---

## 🎯 Quick Start by Use Case

### "I need to change the LLM model globally"
1. **Start:** `LLM_CONFIG_QUICK_REF.txt` (understand current state)
2. **Plan:** `LLM_CONFIG_EDIT_GUIDE.md` (decide strategy)
3. **Execute:** `LLM_CONFIG_EDIT_GUIDE.md` (follow step 2)
4. **Verify:** Use the checklist at the end

### "I need to find where a variable is set"
→ Search in `LLM_CONFIG_INVENTORY.md` (comprehensive table)

### "I need to understand configuration flow"
→ Read `LLM_CONFIG_QUICK_REF.txt` section "Configuration Flow"

### "I found an inconsistency - what do I do?"
→ Read `LLM_CONFIG_QUICK_REF.txt` section "Critical Mismatches"

### "I'm editing a specific file"
→ Look up the file in `LLM_CONFIG_EDIT_GUIDE.md` for exact lines

---

## 🔍 Key Findings

### ⚠️ Critical Mismatches Detected

| Component | LLM_MODEL Default | Status |
|-----------|-------------------|--------|
| `.env` (ACTIVE) | `openai/gpt-4o-mini` | ✅ |
| `.env.example` | `openai/gpt-5-nano` | ❌ Mismatch |
| `backend/src/core/config.py` | `openai/gpt-5-nano` | ❌ Mismatch |
| `backend/src/worker/data_tasks.py` | `openai/gpt-5-nano` | ❌ Mismatch |
| `mem0-service/main.py` | `openai/gpt-5-nano` | ❌ Mismatch |
| `frontend/src/ai/localClient.ts` | `gpt-oss-120b` | ❌ Not valid OpenRouter model |

**Impact:** If `.env` is not explicitly set, different services may use different models.

---

## 🏗️ Configuration Architecture

```
┌─────────────────────────┐
│  .env (Primary Source)  │
│  - OPENAI_API_KEY       │
│  - OPENAI_BASE_URL      │
│  - LLM_MODEL            │
│  - LOCAL_LLM_MODEL      │
└────────────┬────────────┘
             │
             ├─→ docker-compose.yml (reads via $var interpolation)
             │   ├─ backend container
             │   ├─ worker_chat
             │   ├─ worker_data
             │   ├─ worker_media
             │   └─ frontend
             │
             └─→ Direct application loading
                 ├─ backend/src/core/config.py (Pydantic)
                 ├─ backend/src/core/mem0_local.py
                 ├─ backend/src/worker/*.py (os.getenv)
                 ├─ mem0-service/main.py
                 └─ frontend/src/ai/localClient.ts (process.env)
```

---

## 📊 Statistics

| Category | Count |
|----------|-------|
| Docker Compose files scanned | 4 |
| .env files found | 9 |
| Backend source files | 5 |
| Frontend source files | 1 |
| Total LLM config locations | 40+ |
| Critical mismatches | 5 |
| Base URL is consistent | ✅ Yes (OpenRouter) |
| API keys properly git-ignored | ✅ Yes |

---

## ✅ Recommendations

### Immediate Action (High Priority)
1. **Standardize LLM_MODEL** to one value across all files
   - Option A: Use `openai/gpt-4o-mini` (faster, cheaper) — **RECOMMENDED**
   - Option B: Use `openai/gpt-5-nano` (consistency with placeholder)

2. **Fix frontend fallback** in `frontend/src/ai/localClient.ts`
   - Change line 11 from `'gpt-oss-120b'` to `'openai/gpt-4o-mini'`

### Medium Priority
3. Update `.env.example` to match actual .env
4. Ensure `.env` is in `.gitignore` (for security)

### Low Priority
5. Document env var setup in main README.md

---

## 🔐 Security Status

✅ **Good:**
- `.env` is git-ignored (no secrets in repo)
- `.env.production` has NO API keys (uses GitHub Secrets)
- API key strategy is sound

⚠️ **To Improve:**
- Document CI/CD secret injection process
- Add audit trail for secret changes

---

## 🛠️ How to Use These Documents

### For Developers
1. **First time?** Start with `LLM_CONFIG_QUICK_REF.txt`
2. **Making changes?** Follow `LLM_CONFIG_EDIT_GUIDE.md` step-by-step
3. **Debugging?** Use `LLM_CONFIG_INVENTORY.md` to find exact lines

### For DevOps/Infra
1. Review `LLM_CONFIG_QUICK_REF.txt` for configuration flow
2. Check `LLM_CONFIG_EDIT_GUIDE.md` for secure secret management section
3. Reference `.env.example` comments for setup instructions

### For Code Review
1. Use `LLM_CONFIG_INVENTORY.md` to verify all locations are covered
2. Check `LLM_CONFIG_QUICK_REF.txt` for consistency
3. Verify fixes in `LLM_CONFIG_EDIT_GUIDE.md` checklist

---

## 📝 Notes

- **All line numbers** are current as of the read date
- **All paths** are relative to project root (`chatSNP170226/`)
- **All defaults** are actual hardcoded values in source code
- **All files** have been examined (except `.venv` and `node_modules`)

---

## 🔗 Related Documentation

- **PROJECT_CONTEXT.md** — Full project overview
- **ARCHITECTURE.md** — System architecture
- **STACK.md** — Technology stack details
- **INTEGRATIONS.md** — API & service integrations

---

## 📞 Questions?

If you need to:
- **Find a specific configuration** → Use `LLM_CONFIG_INVENTORY.md`
- **Understand the current state** → Use `LLM_CONFIG_QUICK_REF.txt`
- **Make changes** → Use `LLM_CONFIG_EDIT_GUIDE.md`

All three documents are cross-referenced for easy navigation.

---

**Status:** ✅ Complete  
**Coverage:** 100% (all LLM configuration locations found)  
**Accuracy:** Verified against actual source code  
**Last Updated:** 2026-04-15
