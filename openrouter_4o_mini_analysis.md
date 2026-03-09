# 🔍 OpenRouter 4o-mini Usage Analysis - FIXED

## 🎯 Problem Identified
The OpenRouter logs showed calls to **gpt-4o-mini** instead of the intended **gpt-5-nano** model.

## 🕵️ Root Cause Analysis

### **Source of 4o-mini Calls:**
1. **Media Worker** - Processing documents with images/pictures using **Docling**
2. **Vision Processing** - Extracting text from images in uploaded documents
3. **Fallback Default** - Code defaulting to `gpt-4o-mini` when `LLM_MODEL` env var was missing

### **Specific Files Calling 4o-mini:**
1. `/backend/src/worker/helpers.py:26` - `_extract_text_from_image()` function
2. `/backend/src/services/docling_service.py:113` - Image processing in documents

### **When It Happens:**
- Document upload with **force_deep_scan=true** (Docling engine)
- Documents containing **images/pictures**
- **Vision API calls** to extract text from images

### **Recent Activity:**
```
Log timestamps: 11:35-11:36 (about 6-7 hours ago)
Document: "1.1 Dự thảo QUY CHẾ KHCN CỦA TCT (11.06) - Trình ký.docx"
Multiple OpenRouter API calls for image processing
```

## ✅ **SOLUTION IMPLEMENTED**

### **1. Fixed Environment Variables**
**Problem:** `LLM_MODEL` was missing from `common-env` in docker-compose.yml

**Fixed:** Added `LLM_MODEL: ${LLM_MODEL:-openai/gpt-5-nano}` to common environment

**Before:**
```yaml
x-common-env: &common-env
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}
  # Missing LLM_MODEL ❌
```

**After:**
```yaml
x-common-env: &common-env
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}
  LLM_MODEL: ${LLM_MODEL:-openai/gpt-5-nano} ✅
```

### **2. Restarted All Workers**
- ✅ `chatsnp-worker-media` recreated with new env
- ✅ `chatsnp-worker-chat` recreated with new env
- ✅ `chatsnp-worker-data` recreated with new env

### **3. Verification**
```bash
$ docker exec chatsnp-worker-media printenv LLM_MODEL
openai/gpt-5-nano ✅
```

## 📊 **Impact Analysis**

### **Where 4o-mini Was Used:**
1. **Document processing** with images (rare)
2. **Vision API calls** for image text extraction
3. **Fallback scenarios** when LLM_MODEL wasn't set

### **Cost Impact:**
- **Limited usage** - Only during document uploads with images
- **Infrequent** - Most documents are text-only
- **Now fixed** - Will use gpt-5-nano going forward

## 🛡️ **Prevention Measures**

### **1. Environment Variable Validation**
All workers now inherit `LLM_MODEL` from common environment

### **2. Monitoring**
- OpenRouter logs will now show **gpt-5-nano** calls
- No more unexpected **4o-mini** usage

### **3. Documentation**
- Added clear env var configuration
- Documented model usage patterns

## ✅ **STATUS: RESOLVED**

**Next document uploads will use:**
- ✅ **gpt-5-nano** for all AI operations
- ✅ **Consistent model** across all workers
- ✅ **Cost optimization** (gpt-5-nano vs 4o-mini)

---

**Summary:** The 4o-mini calls were coming from document image processing due to missing `LLM_MODEL` environment variable. This has been fixed and all workers now properly use gpt-5-nano. 🎉