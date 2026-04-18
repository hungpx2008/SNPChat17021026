# LLM Defaults Audit - Document Index & Navigation

## 📚 Complete Audit Package

This package contains a comprehensive audit of all **15 locations** where LLM model names are hardcoded as defaults in the ChatSNP project.

**Created:** April 15, 2026  
**Scope:** chatSNP170226/ source code  
**Files Audited:** 11 Python + TypeScript files  
**Total Locations:** 15 unique LLM default configurations  

---

## 📋 Documents in This Package

### 1. **LLM_DEFAULTS_QUICK_VIEW.txt** ⭐ START HERE
**Best for:** Quick lookups and overview  
**Contains:**
- All 15 locations in hierarchical format
- Statistics by model and base URL
- Key things to remember
- Quick update workflow
- FAQ section

**Use this when:** You need a fast reference or want to understand the scope

---

### 2. **LLM_DEFAULTS_CHECKLIST.md** ⭐ FOR MAKING UPDATES
**Best for:** Executing the actual updates  
**Contains:**
- Step-by-step checklist for each file
- Line numbers and current values
- Quick reference tables
- Verification steps
- Environment variables guide

**Use this when:** You're ready to update the defaults

---

### 3. **LLM_DEFAULTS_REFERENCE.md** ⭐ FOR DETAILED CONTEXT
**Best for:** Understanding code context around each change  
**Contains:**
- Full code snippets for each location
- Before/after context (5-10 lines)
- Variable types and service descriptions
- Complete summary table with all metadata

**Use this when:** You need to understand the surrounding code or why a default is there

---

### 4. **LLM_DEFAULTS_SUMMARY.txt** 
**Best for:** High-level overview and critical observations  
**Contains:**
- Audit findings summary
- Model breakdown and distribution
- Critical observations and warnings
- Environment variable reference
- Implementation phases and checklist

**Use this when:** You need to understand the bigger picture or brief someone else

---

### 5. **LLM_DEFAULTS_AUDIT.md**
**Best for:** Comprehensive analysis and detailed audit report  
**Contains:**
- Full detailed audit with all findings
- Each location with full context
- Configuration matrix
- Key findings and inconsistencies
- Distribution analysis

**Use this when:** You need complete analysis or documenting changes

---

## 🎯 Quick Navigation by Task

### I need to update all the defaults
1. Open **LLM_DEFAULTS_CHECKLIST.md**
2. Use it as your working document
3. Reference **LLM_DEFAULTS_REFERENCE.md** when you need code context
4. Run verification commands in the checklist

### I need to understand what needs to change
1. Start with **LLM_DEFAULTS_QUICK_VIEW.txt**
2. Review the "Key Things to Remember" section
3. Look at "Critical Observations" in **LLM_DEFAULTS_SUMMARY.txt**

### I need to find a specific location
1. Use Ctrl+F in **LLM_DEFAULTS_QUICK_VIEW.txt** to search for file name
2. Or search **LLM_DEFAULTS_CHECKLIST.md** by file name
3. Get full context from **LLM_DEFAULTS_REFERENCE.md**

### I need to brief someone on what was found
1. Share **LLM_DEFAULTS_SUMMARY.txt** (high-level overview)
2. Or share **LLM_DEFAULTS_QUICK_VIEW.txt** (visual format)
3. For deep dive, share **LLM_DEFAULTS_AUDIT.md**

### I'm verifying that all updates are complete
1. Use the verification grep command in **LLM_DEFAULTS_CHECKLIST.md**
2. Cross-check completed items in the checklist
3. Ensure all 15 locations were updated

---

## 🔍 Key Findings Summary

### Models Found (15 locations)
- **openai/gpt-5-nano** → 5 locations (reasoning model)
- **openai/gpt-4o-mini** → 5 locations (chat fallback)  
- **gpt-4o-mini** → 4 locations (direct OpenAI)
- **gpt-oss-120b** → 1 location (frontend)

### Base URLs Found
- **openrouter.ai/api/v1** → 9 locations (primary)
- **api.openai.com/v1** → 4 locations (VLM services)

### Critical Observations
⚠️ Dual provider setup (OpenRouter vs OpenAI)  
⚠️ Reasoning model fallback behavior  
⚠️ Frontend uses different model than backend  
⚠️ Inconsistent model naming (with/without prefix)  

See **LLM_DEFAULTS_SUMMARY.txt** for details.

---

## 📍 All 15 Locations

| # | File | Line | Current Value | Type |
|---|------|------|---------------|------|
| 1 | config.py | 22 | `https://openrouter.ai/api/v1` | Pydantic |
| 2 | config.py | 24 | `openai/gpt-5-nano` | Pydantic |
| 3 | lida_service.py | 35 | `https://openrouter.ai/api/v1` | os.getenv |
| 4 | lida_service.py | 36 | `openai/gpt-5-nano` | os.getenv |
| 5 | query_enhancer.py | 125 | `openai/gpt-4o-mini` | os.getenv |
| 6 | query_enhancer.py | 127 | `https://openrouter.ai/api/v1` | os.getenv |
| 7 | docling_service.py | 649 | `https://api.openai.com/v1` ⚠️ | os.getenv |
| 8 | docling_service.py | 650 | `gpt-4o-mini` | os.getenv |
| 9 | data_tasks.py | 23 | `https://openrouter.ai/api/v1` | os.getenv |
| 10 | data_tasks.py | 24 | `openai/gpt-5-nano` | os.getenv |
| 11 | chat_tasks.py | 289 | `openai/gpt-4o-mini` | os.getenv |
| 12 | chat_tasks.py | 394 | `https://openrouter.ai/api/v1` | os.getenv |
| 13 | chat_tasks.py | 396 | `openai/gpt-4o-mini` | os.getenv |
| 14 | chat_tasks.py | 1085 | `openai/gpt-5-nano` | os.getenv |
| 15 | gardener_tasks.py | 39 | `https://openrouter.ai/api/v1` | os.getenv |
| 16 | gardener_tasks.py | 40 | `openai/gpt-5-nano` | os.getenv |
| 17 | helpers.py | 24 | `https://api.openai.com/v1` ⚠️ | os.getenv |
| 18 | helpers.py | 25 | `gpt-4o-mini` | os.getenv |
| 19 | helpers.py | 80 | `https://api.openai.com/v1` ⚠️ | os.getenv |
| 20 | helpers.py | 81 | `gpt-4o-mini` | os.getenv |
| 21 | mem0_local.py | 32 | `openai/gpt-4o-mini` | os.environ.get |
| 22 | media_tasks.py | 71 | `gpt-4o-mini` | os.getenv |
| 23 | chat_service.py | 186 | `openai/gpt-4o-mini` | getattr |
| 24 | localClient.ts | 6 | `https://openrouter.ai/api/v1` | process.env |
| 25 | localClient.ts | 11 | `gpt-oss-120b` | process.env |

---

## 💾 Environment Variables That Override These Defaults

### Backend (Python)
- `LLM_MODEL` - Override any model name
- `OPENAI_BASE_URL` - Override base URL
- `OPENAI_API_KEY` - API key for provider
- `OPENROUTER_API_KEY` - Alternative OpenRouter key

### Frontend (TypeScript)
- `LOCAL_LLM_MODEL` - Override frontend model
- `NEXT_PUBLIC_LOCAL_LLM_MODEL` - Public next.js override
- `OPENROUTER_BASE_URL` - Frontend base URL

These will continue to work after you update the hardcoded defaults.

---

## ✅ Implementation Checklist

### Phase 1: Review & Plan (Current)
- ✓ Identify all locations
- ✓ Analyze current configuration
- ✓ Document critical observations
- [ ] **Review findings with team**
- [ ] **Decide on new model names and URLs**

### Phase 2: Update Code (When Ready)
- [ ] Update all 15 locations
- [ ] Update .env.example
- [ ] Update docker-compose files
- [ ] Update documentation
- [ ] Run full test suite

### Phase 3: Verify
- [ ] Grep to confirm no old values
- [ ] Test with env vars set
- [ ] Test with env vars unset
- [ ] Run backend tests
- [ ] Run frontend tests

---

## 🚀 Getting Started

**For first-time users:**
1. Read **LLM_DEFAULTS_QUICK_VIEW.txt** (5 min overview)
2. Review critical observations in **LLM_DEFAULTS_SUMMARY.txt** (5 min)
3. Discuss findings with your team

**When ready to implement:**
1. Use **LLM_DEFAULTS_CHECKLIST.md** (10-20 min to execute)
2. Reference **LLM_DEFAULTS_REFERENCE.md** (as needed for context)
3. Run verification commands

**For future reference:**
- Bookmark **LLM_DEFAULTS_QUICK_VIEW.txt** for quick lookups
- Keep **LLM_DEFAULTS_REFERENCE.md** handy during implementation

---

## 📖 Reading Order Recommendations

**For a quick overview (15 minutes):**
1. This file (LLM_DEFAULTS_INDEX.md)
2. **LLM_DEFAULTS_QUICK_VIEW.txt**

**For understanding before updating (30 minutes):**
1. **LLM_DEFAULTS_SUMMARY.txt** - Overview & observations
2. **LLM_DEFAULTS_QUICK_VIEW.txt** - All locations
3. Key sections of **LLM_DEFAULTS_REFERENCE.md**

**For detailed implementation (1-2 hours):**
1. **LLM_DEFAULTS_CHECKLIST.md** - As working document
2. **LLM_DEFAULTS_REFERENCE.md** - For code context
3. **LLM_DEFAULTS_AUDIT.md** - If deeper analysis needed

---

## ❓ FAQ

**Q: Can I update these defaults gradually?**  
A: Technically yes, but recommended to update all at once for consistency.

**Q: Will environment variables stop working?**  
A: No - `LLM_MODEL` and `OPENAI_BASE_URL` will still override new defaults.

**Q: What if I only want to change some defaults?**  
A: The checklist is flexible - you can update specific locations.

**Q: Do I need to rebuild Docker containers?**  
A: Yes, after code changes. Update docker-compose files first.

**Q: Are there tests I should run?**  
A: Yes - see verification steps in LLM_DEFAULTS_CHECKLIST.md

See **LLM_DEFAULTS_SUMMARY.txt** for more FAQ.

---

## 📞 Support

If you have questions about:
- **Specific locations** → Check LLM_DEFAULTS_REFERENCE.md
- **How to update** → Check LLM_DEFAULTS_CHECKLIST.md  
- **Why something matters** → Check LLM_DEFAULTS_SUMMARY.txt
- **All the details** → Check LLM_DEFAULTS_AUDIT.md

---

**Generated:** 2026-04-15 (ChatSNP LLM Defaults Audit)  
**Status:** ✅ Complete - Ready for Review and Implementation  
**Next Step:** Team review and decision on new defaults

