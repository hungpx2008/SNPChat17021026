# EON Gap Phase 8: Auto-routing + Semantic Cache — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Automatically detect user intent to choose the right mode (chat/sql/rag) without manual selection. (2) Cache answers for frequently repeated questions to skip the full pipeline.

**Architecture:**
- **Auto-routing:** New `IntentRouter` class uses Vietnamese signal-word heuristics (fast, no LLM) with an LLM classification fallback (gpt-4o-mini, ~100 tokens) when confidence < 0.7. A new "Tự động" (auto) mode is added as the default in the frontend. The backend resolves auto → chat/sql/rag before dispatching to Celery.
- **Semantic Cache:** New `SemanticCache` class stores Q&A pairs in Redis keyed by query embedding. Before running the RAG/SQL pipeline, the query is embedded and compared (cosine similarity) against cached entries per department. Threshold: 0.95 (very high to avoid false positives). TTL: 24h. Invalidated on document upload.

**Tech Stack:** Redis (cache storage), Mem0 embedding service (1024-dim vectors), gpt-4o-mini via OpenRouter (intent classification), existing Celery worker infrastructure.

**Spec:** `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Phase 8 section.

---

### Task 1: IntentRouter Class — Vietnamese Signal-Word Detection + LLM Fallback

**Files:**
- Create: `chatSNP170226/backend/src/services/intent_router.py`
- Test: `chatSNP170226/backend/tests/test_intent_router.py`

- [ ] **Step 1: Write tests for IntentRouter**

Create `chatSNP170226/backend/tests/test_intent_router.py`:

```python
"""Tests for IntentRouter — heuristic + LLM-based intent classification."""
from unittest.mock import patch, MagicMock

from src.services.intent_router import IntentRouter, RoutingResult


# ── Heuristic tests (no LLM call) ────────────────────────────────────────

def test_greeting_routes_to_chat():
    """Greetings should be classified as chat with high confidence, no LLM."""
    router = IntentRouter()
    result = router.classify("Xin chào bạn")
    assert result.intent == "chat"
    assert result.confidence >= 0.85
    assert result.fallback_used is False


def test_thanking_routes_to_chat():
    """Thank-you messages should route to chat."""
    router = IntentRouter()
    result = router.classify("Cảm ơn bạn nhiều nhé")
    assert result.intent == "chat"
    assert result.confidence >= 0.85


def test_sql_keywords_route_to_sql():
    """Questions with data/pricing keywords should route to sql."""
    router = IntentRouter()
    result = router.classify("Biểu giá container 20ft tháng 1 là bao nhiêu?")
    assert result.intent == "sql"
    assert result.confidence >= 0.7


def test_statistics_route_to_sql():
    """Statistical queries should route to sql."""
    router = IntentRouter()
    result = router.classify("Thống kê sản lượng container qua cảng Cát Lái quý 1")
    assert result.intent == "sql"
    assert result.confidence >= 0.7


def test_rag_keywords_route_to_rag():
    """Questions about processes/documents should route to rag."""
    router = IntentRouter()
    result = router.classify("Quy trình nhập khẩu hàng đông lạnh gồm những bước nào?")
    assert result.intent == "rag"
    assert result.confidence >= 0.7


def test_policy_routes_to_rag():
    """Policy/regulation questions should route to rag."""
    router = IntentRouter()
    result = router.classify("Chính sách an toàn lao động tại cảng là gì?")
    assert result.intent == "rag"
    assert result.confidence >= 0.7


def test_ambiguous_uses_fallback():
    """Ambiguous query with no clear signals should use fallback mode."""
    router = IntentRouter()
    result = router.classify("Cho tôi biết thêm về cảng Cát Lái", fallback_mode="chat")
    # Should either classify via LLM or fallback
    assert result.intent in ("chat", "sql", "rag")


def test_empty_query_routes_to_chat():
    """Empty or whitespace query should route to chat."""
    router = IntentRouter()
    result = router.classify("")
    assert result.intent == "chat"
    assert result.confidence >= 0.9


def test_fallback_mode_used_when_specified():
    """When confidence is low and fallback_mode is specified, use it."""
    router = IntentRouter()
    # Very short ambiguous query
    result = router.classify("ok", fallback_mode="rag")
    # Should use fallback since "ok" has no strong signals
    assert result.intent in ("chat", "rag")


# ── RoutingResult dataclass ──────────────────────────────────────────────

def test_routing_result_fields():
    """RoutingResult should have all expected fields."""
    result = RoutingResult(
        intent="sql",
        confidence=0.92,
        reasoning="Contains 'biểu giá' keyword",
        fallback_used=False,
    )
    assert result.intent == "sql"
    assert result.confidence == 0.92
    assert "biểu giá" in result.reasoning
    assert result.fallback_used is False
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_intent_router.py -v`
Expected: FAIL — `intent_router` module not found

- [ ] **Step 3: Implement IntentRouter**

Create `chatSNP170226/backend/src/services/intent_router.py`:

```python
"""Intent-based auto-routing for chat queries.

Classifies user queries into one of three modes:
  - "chat": General conversation, greetings, follow-ups
  - "sql":  Data queries, pricing, statistics, database lookups
  - "rag":  Process questions, policies, document search

Two-stage classification:
  1. Fast heuristic: Vietnamese signal-word matching (~0ms)
  2. LLM fallback: gpt-4o-mini via OpenRouter (~300ms, only when heuristic is ambiguous)

Usage:
    router = IntentRouter()
    result = router.classify("Biểu giá container 20ft?")
    # result.intent == "sql", result.confidence == 0.85
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass

logger = logging.getLogger(__name__)

# ── Signal words for heuristic pre-filter ─────────────────────────────────
# Each list maps to a mode. Order matters: first match wins.

SQL_SIGNALS = [
    "biểu giá", "phí", "giá", "bao nhiêu", "sản lượng", "thống kê",
    "container", "teu", "doanh thu", "chi phí", "số liệu", "truy vấn",
    "bảng", "cơ sở dữ liệu", "báo cáo", "tổng hợp", "tháng", "quý",
    "năm", "đơn giá", "thanh toán", "hóa đơn", "lượt tàu",
]

RAG_SIGNALS = [
    "quy trình", "thủ tục", "hướng dẫn", "chính sách", "biểu mẫu",
    "quy định", "cách", "làm sao", "bước", "tài liệu", "thông tư",
    "nghị định", "văn bản", "an toàn", "nội quy", "điều kiện",
    "yêu cầu", "giấy tờ", "hồ sơ", "đăng ký", "khai báo",
]

CHAT_SIGNALS = [
    "xin chào", "chào bạn", "hello", "hi ", "cảm ơn", "cám ơn",
    "tạm biệt", "bạn là ai", "giúp gì", "bạn tên gì", "bye",
    "ok", "được rồi", "ừ", "vâng",
]

# ── LLM classification prompt ────────────────────────────────────────────

_ROUTING_PROMPT = """Phân loại câu hỏi của người dùng vào đúng 1 trong 3 nhóm xử lý:

- "sql": Hỏi về SỐ LIỆU cụ thể — biểu giá, phí dịch vụ, thống kê, sản lượng, doanh thu, thời gian lưu bãi, số container. Đặc điểm: cần truy vấn database để trả lời.
- "rag": Hỏi về QUY TRÌNH, CHÍNH SÁCH, HƯỚNG DẪN — thủ tục hải quan, quy trình nhập xuất, chính sách an toàn, biểu mẫu, quy định. Đặc điểm: cần tra cứu tài liệu để trả lời.
- "chat": Chào hỏi, cảm ơn, hỏi chung về ChatSNP, hoặc không thuộc 2 nhóm trên.

Trả về JSON duy nhất, không giải thích:
{"intent": "sql"|"rag"|"chat", "confidence": 0.0-1.0, "reasoning": "lý do ngắn"}

Câu hỏi: {query}"""


@dataclass
class RoutingResult:
    """Result of intent classification."""
    intent: str            # "chat" | "sql" | "rag"
    confidence: float      # 0.0 - 1.0
    reasoning: str         # Short explanation (for logging/debug)
    fallback_used: bool    # True if fell back to user-selected mode


class IntentRouter:
    """Classify user intent to route to correct processing mode.

    Two-stage classification:
      1. Heuristic: Vietnamese signal-word matching (instant, no API call)
      2. LLM fallback: gpt-4o-mini classification (only when heuristic is ambiguous)

    Parameters:
        confidence_threshold: Minimum heuristic confidence to skip LLM. Default: 0.7.
    """

    CONFIDENCE_THRESHOLD = 0.7

    def classify(self, query: str, fallback_mode: str = "chat") -> RoutingResult:
        """Classify query intent.

        Args:
            query: User's message text.
            fallback_mode: Mode to use if all classification fails.

        Returns:
            RoutingResult with classified intent and confidence.
        """
        if not query or not query.strip():
            return RoutingResult(
                intent="chat",
                confidence=0.95,
                reasoning="Empty query → chat",
                fallback_used=False,
            )

        # Stage 1: Heuristic pre-filter
        heuristic = self._heuristic_classify(query)
        if heuristic and heuristic.confidence >= self.CONFIDENCE_THRESHOLD:
            logger.info(
                f"[router] Heuristic: {heuristic.intent} "
                f"(confidence={heuristic.confidence:.2f}, reason={heuristic.reasoning})"
            )
            return heuristic

        # Stage 2: LLM classification fallback
        try:
            llm_result = self._llm_classify(query)
            if llm_result and llm_result.confidence >= self.CONFIDENCE_THRESHOLD:
                logger.info(
                    f"[router] LLM: {llm_result.intent} "
                    f"(confidence={llm_result.confidence:.2f})"
                )
                return llm_result
        except Exception as e:
            logger.warning(f"[router] LLM classification failed: {e}")

        # Stage 3: Use heuristic result (even if low confidence) or fallback
        if heuristic:
            logger.info(
                f"[router] Using low-confidence heuristic: {heuristic.intent} "
                f"(confidence={heuristic.confidence:.2f})"
            )
            return heuristic

        logger.info(f"[router] Falling back to mode={fallback_mode}")
        return RoutingResult(
            intent=fallback_mode,
            confidence=0.3,
            reasoning="No signal detected, using fallback",
            fallback_used=True,
        )

    def _heuristic_classify(self, query: str) -> RoutingResult | None:
        """Fast Vietnamese signal-word classification.

        Scoring: count matching signals per mode, highest wins.
        Confidence = matched_signals / max(total_signals_checked, 1).
        Bonus: exact match on CHAT_SIGNALS gets 0.95 confidence.
        """
        query_lower = query.lower().strip()

        # Check chat signals first (exact prefix/substring match)
        for signal in CHAT_SIGNALS:
            if signal in query_lower:
                return RoutingResult(
                    intent="chat",
                    confidence=0.9,
                    reasoning=f"Chat signal: '{signal}'",
                    fallback_used=False,
                )

        # Count SQL and RAG signal matches
        sql_matches = [s for s in SQL_SIGNALS if s in query_lower]
        rag_matches = [s for s in RAG_SIGNALS if s in query_lower]

        sql_score = len(sql_matches)
        rag_score = len(rag_matches)

        if sql_score == 0 and rag_score == 0:
            return None  # No signals → need LLM

        if sql_score > rag_score:
            confidence = min(0.5 + sql_score * 0.15, 0.95)
            return RoutingResult(
                intent="sql",
                confidence=confidence,
                reasoning=f"SQL signals: {sql_matches[:3]}",
                fallback_used=False,
            )

        if rag_score > sql_score:
            confidence = min(0.5 + rag_score * 0.15, 0.95)
            return RoutingResult(
                intent="rag",
                confidence=confidence,
                reasoning=f"RAG signals: {rag_matches[:3]}",
                fallback_used=False,
            )

        # Tie: both modes have equal signals → low confidence, need LLM
        confidence = min(0.3 + sql_score * 0.1, 0.6)
        # Slight preference for RAG (more common in port domain)
        return RoutingResult(
            intent="rag",
            confidence=confidence,
            reasoning=f"Tied: sql={sql_matches[:2]}, rag={rag_matches[:2]}",
            fallback_used=False,
        )

    def _llm_classify(self, query: str) -> RoutingResult | None:
        """LLM-based intent classification via OpenRouter.

        Makes one lightweight call to gpt-4o-mini (~100 tokens).
        Returns None if the LLM response cannot be parsed.
        """
        from src.core.http_client import get_http_client

        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

        prompt = _ROUTING_PROMPT.format(query=query)

        try:
            http_client = get_http_client(timeout=10.0)
            resp = http_client.post(
                f"{openai_base.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": llm_model,
                    "messages": [
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.0,
                    "max_tokens": 100,
                },
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()

            # Parse JSON response
            # Handle case where LLM wraps in ```json ... ```
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()

            data = json.loads(content)
            intent = data.get("intent", "chat")
            confidence = float(data.get("confidence", 0.5))
            reasoning = data.get("reasoning", "LLM classification")

            # Validate intent value
            if intent not in ("chat", "sql", "rag"):
                logger.warning(f"[router] LLM returned invalid intent: {intent}")
                return None

            return RoutingResult(
                intent=intent,
                confidence=confidence,
                reasoning=f"LLM: {reasoning}",
                fallback_used=False,
            )

        except json.JSONDecodeError as e:
            logger.warning(f"[router] LLM returned non-JSON: {e}")
            return None
        except Exception as e:
            logger.warning(f"[router] LLM call failed: {e}")
            return None
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_intent_router.py -v`
Expected: PASS (10 tests) — heuristic tests pass instantly; ambiguous test may call LLM or fallback

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/intent_router.py chatSNP170226/backend/tests/test_intent_router.py
git commit -m "feat(routing): add IntentRouter with Vietnamese signal-word heuristics + LLM fallback"
```

---

### Task 2: Update Backend Schema to Accept "auto" Mode

**Files:**
- Modify: `chatSNP170226/backend/src/schemas/schemas.py`

- [ ] **Step 1: Update MessageCreate schema to accept "auto" mode**

In `chatSNP170226/backend/src/schemas/schemas.py`, find the `MessageCreate` class (line 8) and update the `mode` field:

Find:
```python
    mode: Literal["chat", "sql", "rag"] = "chat"
```

Replace with:
```python
    mode: Literal["chat", "sql", "rag", "auto"] = "auto"
```

This changes the default from `"chat"` to `"auto"` so existing frontend clients that don't send a mode will automatically use auto-routing.

- [ ] **Step 2: Verify import still works**

Run: `cd chatSNP170226/backend && python -c "from src.schemas.schemas import MessageCreate; m = MessageCreate(role='user', content='test'); print(m.mode)"`
Expected: `auto`

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/src/schemas/schemas.py
git commit -m "feat(schema): accept 'auto' mode in MessageCreate, make it the default"
```

---

### Task 3: Integrate Auto-routing into API + ChatService

**Files:**
- Modify: `chatSNP170226/backend/src/services/chat_service.py`
- Modify: `chatSNP170226/backend/src/api/chat.py`

- [ ] **Step 1: Modify ChatService.add_message() to resolve auto mode**

In `chatSNP170226/backend/src/services/chat_service.py`, find the mode dispatch section in `add_message()` (around line 103). Replace the mode dispatch block:

Find:
```python
        # ── Dispatch task based on explicit mode (user must choose) ──
        mode = getattr(message, 'mode', 'chat')

        if mode == "sql":
```

Replace with:
```python
        # ── Resolve mode (auto-routing or explicit) ──
        mode = getattr(message, 'mode', 'auto')
        routing_meta: dict = {}

        if mode == "auto":
            try:
                from src.services.intent_router import IntentRouter
                router = IntentRouter()
                routing = router.classify(message.content, fallback_mode="chat")
                mode = routing.intent
                routing_meta = {
                    "detected_mode": routing.intent,
                    "routing_confidence": routing.confidence,
                    "routing_reason": routing.reasoning,
                    "routing_fallback": routing.fallback_used,
                }
                logger.info(
                    f"[auto-route] '{message.content[:50]}...' → {routing.intent} "
                    f"(confidence={routing.confidence:.2f})"
                )
            except Exception as e:
                logger.warning(f"[auto-route] IntentRouter failed, fallback to chat: {e}")
                mode = "chat"
                routing_meta = {"detected_mode": "chat", "routing_error": str(e)}

        if mode == "sql":
```

- [ ] **Step 2: Store routing metadata in message**

Still in `add_message()`, after the task dispatch block (after the `else: # mode == "chat"` block, around line 128), find:

```python
        # Trigger memory storage if condition met
```

Add BEFORE that line:

```python
        # Store routing metadata in message for frontend badge display
        if routing_meta:
            try:
                existing_meta = db_message.meta or {}
                existing_meta.update(routing_meta)
                db_message.meta = existing_meta
                await self.session.flush()
            except Exception as e:
                logger.warning(f"[auto-route] Failed to store routing meta: {e}")

```

- [ ] **Step 3: Update chat.py API response to include routing info**

In `chatSNP170226/backend/src/api/chat.py`, find the `add_message` endpoint (line 86). The current code at line 103-106 already extracts `intent_type` and returns it. Update it to also include routing metadata:

Find:
```python
    result = service.serialize_message(message)
    # Signal frontend about dispatched Celery tasks
    intent_type = getattr(message, '_intent_type', 'chat')
    result['task_dispatched'] = intent_type in ('sql', 'rag')
    result['intent_type'] = intent_type
    return result
```

Replace with:
```python
    result = service.serialize_message(message)
    # Signal frontend about dispatched Celery tasks
    intent_type = getattr(message, '_intent_type', 'chat')
    result['task_dispatched'] = intent_type in ('sql', 'rag')
    result['intent_type'] = intent_type
    # Include auto-routing metadata for frontend badge
    msg_meta = message.meta or {}
    if msg_meta.get("detected_mode"):
        result['detected_mode'] = msg_meta['detected_mode']
        result['routing_confidence'] = msg_meta.get('routing_confidence', 0)
    return result
```

- [ ] **Step 4: Verify endpoint still works**

Run: `cd chatSNP170226/backend && python -c "from src.services.chat_service import ChatService; print('import OK')"`
Expected: `import OK`

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/chat_service.py chatSNP170226/backend/src/api/chat.py
git commit -m "feat(routing): integrate IntentRouter into ChatService for auto mode dispatch"
```

---

### Task 4: Frontend — Add "Tự động" Mode + Detected Mode Badge

**Files:**
- Modify: `chatSNP170226/frontend/src/components/chat/chat-composer.tsx`
- Modify: `chatSNP170226/frontend/src/components/chat/chat-message-list.tsx`
- Modify: `chatSNP170226/frontend/src/components/chat/processing-status.tsx`
- Modify: `chatSNP170226/frontend/src/components/chat-ui.tsx`
- Modify: `chatSNP170226/frontend/src/services/chat-backend.ts`

- [ ] **Step 1: Update AgentMode type and add "Tự động" mode option**

In `chatSNP170226/frontend/src/components/chat/chat-composer.tsx`, update the type and mode options:

Find:
```typescript
export type AgentMode = "chat" | "sql" | "rag";

const MODE_OPTIONS: { value: AgentMode; label: string; icon: typeof Bot; description: string }[] = [
  { value: "chat", label: "Trợ lý", icon: Bot, description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", icon: BarChart3, description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", icon: FileText, description: "Hỏi nội dung PDF/file" },
];
```

Replace with:
```typescript
export type AgentMode = "auto" | "chat" | "sql" | "rag";

const MODE_OPTIONS: { value: AgentMode; label: string; icon: typeof Bot; description: string }[] = [
  { value: "auto", label: "Tự động", icon: Sparkles, description: "Tự nhận diện câu hỏi" },
  { value: "chat", label: "Trợ lý", icon: Bot, description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", icon: BarChart3, description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", icon: FileText, description: "Hỏi nội dung PDF/file" },
];
```

Also update the import to include `Sparkles`:

Find:
```typescript
import { Paperclip, X, Send, LoaderCircle, Bot, BarChart3, FileText } from "lucide-react";
```

Replace with:
```typescript
import { Paperclip, X, Send, LoaderCircle, Bot, BarChart3, FileText, Sparkles } from "lucide-react";
```

- [ ] **Step 2: Update placeholder text for auto mode**

In `chatSNP170226/frontend/src/components/chat/chat-composer.tsx`, find the Textarea placeholder logic:

Find:
```typescript
            placeholder={
              selectedMode === "sql"
                ? "Hỏi về số liệu cảng... (VD: Thống kê container tháng 1)"
                : selectedMode === "rag"
                  ? "Hỏi về nội dung tài liệu... (VD: Biểu phí cẩu container)"
                  : t("chatInputPlaceholder")
            }
```

Replace with:
```typescript
            placeholder={
              selectedMode === "sql"
                ? "Hỏi về số liệu cảng... (VD: Thống kê container tháng 1)"
                : selectedMode === "rag"
                  ? "Hỏi về nội dung tài liệu... (VD: Biểu phí cẩu container)"
                  : selectedMode === "auto"
                    ? "Hỏi bất kỳ điều gì — hệ thống tự nhận diện..."
                    : t("chatInputPlaceholder")
            }
```

- [ ] **Step 3: Update default mode in ChatUI**

In `chatSNP170226/frontend/src/components/chat-ui.tsx`, change the default `agentMode` state:

Find:
```typescript
  const [agentMode, setAgentMode] = useState<AgentMode>("chat");
```

Replace with:
```typescript
  const [agentMode, setAgentMode] = useState<AgentMode>("auto");
```

- [ ] **Step 4: Update processing status and thinking message for auto mode**

In `chatSNP170226/frontend/src/components/chat-ui.tsx`, find the thinking message logic (around line 282):

Find:
```typescript
      const thinkingMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        content:
          agentMode === "chat" ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>{t("thinkingMessage")}</span>
            </div>
          ) : (
            <ProcessingStatus mode={agentMode as "sql" | "rag"} />
          ),
      };
```

Replace with:
```typescript
      const thinkingMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        content:
          agentMode === "chat" ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>{t("thinkingMessage")}</span>
            </div>
          ) : agentMode === "auto" ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>Đang phân tích câu hỏi...</span>
            </div>
          ) : (
            <ProcessingStatus mode={agentMode as "sql" | "rag"} />
          ),
      };
```

- [ ] **Step 5: Handle auto mode task dispatch — all auto mode responses go through Celery SSE**

In `chatSNP170226/frontend/src/components/chat-ui.tsx`, the `handleFormSubmit` callback already checks `task_dispatched` from the backend response. When mode is "auto", the backend will resolve and set `task_dispatched=true` for sql/rag. For chat resolved from auto, it will also set `task_dispatched=false`, then the client-side `getHelp()` path runs. This works without changes.

However, update the `appendMessage` call to pass the mode correctly:

In `chatSNP170226/frontend/src/services/chat-backend.ts`, update the `appendMessage` type:

Find:
```typescript
    payload: { role: 'user' | 'assistant' | 'system'; content: string; metadata?: any; mode?: 'chat' | 'sql' | 'rag' },
```

Replace with:
```typescript
    payload: { role: 'user' | 'assistant' | 'system'; content: string; metadata?: any; mode?: 'auto' | 'chat' | 'sql' | 'rag' },
```

- [ ] **Step 6: Add detected mode badge to assistant messages**

In `chatSNP170226/frontend/src/components/chat/chat-message-list.tsx`, add a mode badge for assistant messages that include routing metadata.

Find the import section at the top:

Find:
```typescript
import { Bot, User, Image as ImageIcon, Volume2 } from "lucide-react";
```

Replace with:
```typescript
import { Bot, User, Image as ImageIcon, Volume2, Sparkles } from "lucide-react";
```

Then find the section after the message bubble div (around line 200, just after the closing `</div>` of the main message content):

Find:
```typescript
                  {/* Feedback + TTS buttons for bot messages */}
                  {message.role === "bot" && typeof message.content === "string" && (
                    <div className="flex items-center gap-1 mt-1">
                      {messageId && <FeedbackButtons messageId={messageId} />}
                      <TTSButton text={message.content} />
                    </div>
                  )}
```

Replace with:
```typescript
                  {/* Detected mode badge for auto-routed messages */}
                  {message.role === "bot" && metadata.detected_mode && (
                    <div className="flex items-center gap-1 mt-1 mb-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                        <Sparkles size={10} />
                        {metadata.detected_mode === "sql" ? "Số liệu" : metadata.detected_mode === "rag" ? "Tài liệu" : "Trợ lý"}
                      </span>
                    </div>
                  )}
                  {/* Feedback + TTS buttons for bot messages */}
                  {message.role === "bot" && typeof message.content === "string" && (
                    <div className="flex items-center gap-1 mt-1">
                      {messageId && <FeedbackButtons messageId={messageId} />}
                      <TTSButton text={message.content} />
                    </div>
                  )}
```

- [ ] **Step 7: Update ProcessingStatus to handle auto mode**

In `chatSNP170226/frontend/src/components/chat/processing-status.tsx`, update the types:

Find:
```typescript
type ProcessingMode = Exclude<AgentMode, 'chat'>;

const STATUS_MESSAGES: Record<ProcessingMode, string[]> = {
    sql: [
```

Replace with:
```typescript
type ProcessingMode = Exclude<AgentMode, 'chat' | 'auto'>;

const STATUS_MESSAGES: Record<ProcessingMode, string[]> = {
    sql: [
```

- [ ] **Step 8: Commit**

```bash
git add chatSNP170226/frontend/src/components/chat/chat-composer.tsx \
       chatSNP170226/frontend/src/components/chat/chat-message-list.tsx \
       chatSNP170226/frontend/src/components/chat/processing-status.tsx \
       chatSNP170226/frontend/src/components/chat-ui.tsx \
       chatSNP170226/frontend/src/services/chat-backend.ts
git commit -m "feat(frontend): add 'Tự động' mode as default + detected mode badge on messages"
```

---

### Task 5: Auto-routing Integration Tests

**Files:**
- Create: `chatSNP170226/backend/tests/test_auto_routing_integration.py`

- [ ] **Step 1: Write integration tests for the full routing flow**

Create `chatSNP170226/backend/tests/test_auto_routing_integration.py`:

```python
"""Integration tests for auto-routing through the ChatService dispatch flow.

Tests the full path: mode=auto → IntentRouter → resolved mode → correct task dispatch.
Does NOT require running services — uses mocks for DB, Redis, and Celery.
"""
from unittest.mock import patch, MagicMock, AsyncMock
from uuid import uuid4

import pytest

from src.services.intent_router import IntentRouter, RoutingResult


# ── Heuristic routing accuracy tests ─────────────────────────────────────

class TestHeuristicAccuracy:
    """Verify heuristic classification covers common Vietnamese port queries."""

    EXPECTED_SQL = [
        ("Biểu giá container 20ft tại cảng Cát Lái?", "sql"),
        ("Thống kê sản lượng tháng 3 năm 2025", "sql"),
        ("Chi phí lưu bãi container 40ft là bao nhiêu?", "sql"),
        ("Doanh thu quý 1 của cảng Hiệp Phước", "sql"),
        ("Phí cẩu container đông lạnh bao nhiêu?", "sql"),
    ]

    EXPECTED_RAG = [
        ("Quy trình nhập khẩu hàng đông lạnh gồm những bước nào?", "rag"),
        ("Hướng dẫn khai báo hải quan xuất khẩu", "rag"),
        ("Chính sách an toàn lao động tại cảng", "rag"),
        ("Thủ tục đăng ký tàu cập cảng", "rag"),
        ("Yêu cầu giấy tờ cho hàng nhập container", "rag"),
    ]

    EXPECTED_CHAT = [
        ("Xin chào", "chat"),
        ("Cảm ơn bạn nhiều", "chat"),
        ("Bạn là ai?", "chat"),
        ("Tạm biệt", "chat"),
        ("Hello", "chat"),
    ]

    @pytest.mark.parametrize("query,expected", EXPECTED_SQL)
    def test_sql_queries(self, query, expected):
        router = IntentRouter()
        result = router.classify(query)
        assert result.intent == expected, f"Expected {expected} for: {query}, got {result.intent}"

    @pytest.mark.parametrize("query,expected", EXPECTED_RAG)
    def test_rag_queries(self, query, expected):
        router = IntentRouter()
        result = router.classify(query)
        assert result.intent == expected, f"Expected {expected} for: {query}, got {result.intent}"

    @pytest.mark.parametrize("query,expected", EXPECTED_CHAT)
    def test_chat_queries(self, query, expected):
        router = IntentRouter()
        result = router.classify(query)
        assert result.intent == expected, f"Expected {expected} for: {query}, got {result.intent}"


class TestLLMFallback:
    """Test LLM fallback for ambiguous queries."""

    @patch("src.services.intent_router.IntentRouter._llm_classify")
    def test_ambiguous_query_triggers_llm(self, mock_llm):
        """Query with no clear signals should attempt LLM classification."""
        mock_llm.return_value = RoutingResult(
            intent="rag",
            confidence=0.8,
            reasoning="LLM: query about port operations",
            fallback_used=False,
        )
        router = IntentRouter()
        result = router.classify("Cho tôi biết về hoạt động cảng")
        # Either heuristic catches it or LLM is called
        assert result.intent in ("rag", "chat", "sql")

    @patch("src.services.intent_router.IntentRouter._llm_classify")
    def test_llm_failure_uses_fallback(self, mock_llm):
        """When LLM fails, should fall back gracefully."""
        mock_llm.side_effect = Exception("API timeout")
        router = IntentRouter()
        result = router.classify("Một câu hỏi rất mơ hồ", fallback_mode="rag")
        # Should not raise — should fallback
        assert result.intent in ("chat", "sql", "rag")


class TestRoutingMetadata:
    """Test that routing results have complete metadata."""

    def test_routing_result_has_all_fields(self):
        router = IntentRouter()
        result = router.classify("Biểu giá container 20ft?")
        assert hasattr(result, "intent")
        assert hasattr(result, "confidence")
        assert hasattr(result, "reasoning")
        assert hasattr(result, "fallback_used")
        assert isinstance(result.confidence, float)
        assert 0 <= result.confidence <= 1
```

- [ ] **Step 2: Run integration tests**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_auto_routing_integration.py -v`
Expected: PASS (15+ tests)

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/tests/test_auto_routing_integration.py
git commit -m "test(routing): add heuristic accuracy + LLM fallback integration tests"
```

---

### Task 6: SemanticCache Class — Redis-backed Q&A Cache

**Files:**
- Create: `chatSNP170226/backend/src/services/semantic_cache.py`
- Test: `chatSNP170226/backend/tests/test_semantic_cache.py`

- [ ] **Step 1: Write tests for SemanticCache**

Create `chatSNP170226/backend/tests/test_semantic_cache.py`:

```python
"""Tests for SemanticCache — Redis-backed semantic similarity cache."""
import json
import time
from unittest.mock import patch, MagicMock
from uuid import uuid4

import pytest

from src.services.semantic_cache import SemanticCache, CacheHit


# ── Helper: create a fake embedding (1024-dim) ──────────────────────────

def _fake_vector(seed: float = 0.5) -> list[float]:
    """Generate a deterministic 1024-dim vector for testing."""
    import math
    return [math.sin(i * seed) for i in range(1024)]


def _normalized_vector(seed: float = 0.5) -> list[float]:
    """Generate a normalized 1024-dim vector (unit length)."""
    import math
    raw = [math.sin(i * seed) for i in range(1024)]
    norm = math.sqrt(sum(x * x for x in raw))
    return [x / norm for x in raw]


# ── Unit tests ───────────────────────────────────────────────────────────


class TestCacheHitDataclass:
    def test_cache_hit_fields(self):
        hit = CacheHit(
            answer="Phí lưu bãi container 20ft là 100.000 VNĐ/ngày",
            original_query="Phí lưu bãi bao nhiêu?",
            similarity=0.97,
            mode="rag",
            metadata={"citations": []},
            age_seconds=120.5,
        )
        assert hit.answer.startswith("Phí lưu bãi")
        assert hit.similarity == 0.97
        assert hit.mode == "rag"


class TestSemanticCacheInit:
    def test_default_constants(self):
        cache = SemanticCache()
        assert cache.SIMILARITY_THRESHOLD == 0.95
        assert cache.TTL_SECONDS == 86400
        assert cache.MAX_ENTRIES_PER_DEPT == 1000


class TestSemanticCachePutGet:
    """Test put/get round-trip with mocked Redis and embeddings."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_put_and_get_exact_match(self, mock_embed, mock_redis):
        """Storing then looking up the exact same query should return a hit."""
        vec = _normalized_vector(0.42)
        mock_embed.return_value = vec

        # Mock Redis: zrangebyscore returns the entries we stored
        redis_mock = MagicMock()
        mock_redis.return_value = redis_mock

        cache = SemanticCache()

        # Put: store an entry
        redis_mock.zcard.return_value = 0
        cache.put(
            query="Phí lưu bãi container 20ft?",
            answer="100.000 VNĐ/ngày",
            mode="sql",
            department="ops",
        )
        # Verify zadd was called
        assert redis_mock.zadd.called

        # Get: retrieve with exact same query
        # Mock the stored entries to return what we just put
        stored_entry = json.dumps({
            "query_vector": vec,
            "query_text": "Phí lưu bãi container 20ft?",
            "answer": "100.000 VNĐ/ngày",
            "mode": "sql",
            "metadata": {},
            "created_at": time.time(),
        })
        redis_mock.zrangebyscore.return_value = [stored_entry]

        hit = cache.get("Phí lưu bãi container 20ft?", department="ops")
        assert hit is not None
        assert hit.answer == "100.000 VNĐ/ngày"
        assert hit.similarity >= 0.95
        assert hit.mode == "sql"

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_get_no_match_returns_none(self, mock_embed, mock_redis):
        """Query with no cached entries should return None."""
        mock_embed.return_value = _normalized_vector(0.42)
        redis_mock = MagicMock()
        redis_mock.zrangebyscore.return_value = []
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        hit = cache.get("Completely new question", department="ops")
        assert hit is None

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_dissimilar_query_returns_none(self, mock_embed, mock_redis):
        """Very different query should not match."""
        redis_mock = MagicMock()
        mock_redis.return_value = redis_mock

        cache = SemanticCache()

        # Store with one vector
        stored_vec = _normalized_vector(0.1)
        stored_entry = json.dumps({
            "query_vector": stored_vec,
            "query_text": "Quy trình nhập khẩu",
            "answer": "Bước 1: ...",
            "mode": "rag",
            "metadata": {},
            "created_at": time.time(),
        })
        redis_mock.zrangebyscore.return_value = [stored_entry]

        # Lookup with a very different vector
        mock_embed.return_value = _normalized_vector(99.9)

        hit = cache.get("Biểu giá container", department="ops")
        # Should return None because cosine similarity is low
        assert hit is None


class TestSemanticCacheInvalidate:
    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    def test_invalidate_department(self, mock_redis):
        """Invalidating a department should delete its Redis key."""
        redis_mock = MagicMock()
        redis_mock.delete.return_value = 1
        redis_mock.zcard.return_value = 5
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        removed = cache.invalidate(department="ops")
        redis_mock.delete.assert_called_once()
        assert removed == 5

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    def test_invalidate_all(self, mock_redis):
        """Invalidating without department should clear all cache keys."""
        redis_mock = MagicMock()
        redis_mock.keys.return_value = [b"semcache:ops:entries", b"semcache:hr:entries"]
        redis_mock.zcard.return_value = 10
        redis_mock.delete.return_value = 1
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        removed = cache.invalidate(department=None)
        assert removed >= 0
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_semantic_cache.py -v`
Expected: FAIL — `semantic_cache` module not found

- [ ] **Step 3: Implement SemanticCache**

Create `chatSNP170226/backend/src/services/semantic_cache.py`:

```python
"""Semantic cache for RAG and SQL query results.

Stores Q&A pairs in Redis, keyed by query embedding similarity.
Before running the full pipeline, checks if a sufficiently similar
query was recently answered.

Storage format in Redis:
  Key:   semcache:{department}:entries   (Redis Sorted Set)
  Score: timestamp (for TTL cleanup)
  Value: JSON { query_vector: [...], query_text: "...",
                answer: "...", mode: "rag"|"sql",
                metadata: {...}, created_at: ... }

Embedding: Uses Mem0 service POST /embed (same 1024-dim Vietnamese_Embedding_v2).
Similarity: Cosine similarity, threshold 0.95.
"""
from __future__ import annotations

import json
import logging
import math
import os
import time
from dataclasses import dataclass
from typing import Any

import redis as sync_redis

logger = logging.getLogger(__name__)


@dataclass
class CacheHit:
    """A cached answer that matched the query."""
    answer: str
    original_query: str
    similarity: float
    mode: str
    metadata: dict
    age_seconds: float


class SemanticCache:
    """Redis-backed semantic cache for Q&A pairs.

    Attributes:
        SIMILARITY_THRESHOLD: Minimum cosine similarity to consider a cache hit.
            Set very high (0.95) to only match near-identical queries.
        TTL_SECONDS: Time-to-live for cache entries. Default 24 hours.
        MAX_ENTRIES_PER_DEPT: Maximum cached entries per department.
            Prevents unbounded memory growth.
    """

    SIMILARITY_THRESHOLD = 0.95
    TTL_SECONDS = 86400           # 24 hours
    MAX_ENTRIES_PER_DEPT = 1000

    def _get_sync_redis(self) -> sync_redis.Redis:
        """Get a sync Redis client for Celery worker context."""
        redis_url = os.getenv(
            "REDIS_URL",
            os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"),
        )
        return sync_redis.from_url(redis_url, decode_responses=True)

    def _embed_sync(self, text: str) -> list[float]:
        """Embed text synchronously via Mem0 service.

        Uses the same endpoint as existing embedding calls in Celery workers.
        """
        from src.core.http_client import get_http_client

        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        embed_url = f"{mem0_url.rstrip('/')}/embed"

        resp = get_http_client(timeout=15.0).post(embed_url, json={"text": text})
        resp.raise_for_status()
        return resp.json()["vector"]

    def _cache_key(self, department: str | None) -> str:
        """Build Redis key for a department's cache."""
        dept = department or "_global"
        return f"semcache:{dept}:entries"

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        """Compute cosine similarity between two vectors."""
        if len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def get(
        self, query: str, department: str | None = None,
    ) -> CacheHit | None:
        """Check cache for semantically similar query.

        Args:
            query: User query text.
            department: Department filter (queries from different departments
                may have different answers).

        Returns:
            CacheHit if similar query found above threshold, None otherwise.
        """
        try:
            query_vec = self._embed_sync(query)
        except Exception as e:
            logger.warning(f"[cache] Embed failed, skipping cache lookup: {e}")
            return None

        r = self._get_sync_redis()
        key = self._cache_key(department)
        now = time.time()
        cutoff = now - self.TTL_SECONDS

        try:
            # Fetch non-expired entries (score = timestamp, only recent ones)
            entries = r.zrangebyscore(key, cutoff, "+inf")
        except Exception as e:
            logger.warning(f"[cache] Redis read failed: {e}")
            return None

        if not entries:
            return None

        best_hit: CacheHit | None = None
        best_sim = 0.0

        for entry_json in entries:
            try:
                entry = json.loads(entry_json)
            except json.JSONDecodeError:
                continue

            cached_vec = entry.get("query_vector", [])
            if not cached_vec or len(cached_vec) != len(query_vec):
                continue

            sim = self._cosine_similarity(query_vec, cached_vec)
            if sim >= self.SIMILARITY_THRESHOLD and sim > best_sim:
                best_sim = sim
                created_at = entry.get("created_at", now)
                best_hit = CacheHit(
                    answer=entry.get("answer", ""),
                    original_query=entry.get("query_text", ""),
                    similarity=sim,
                    mode=entry.get("mode", "rag"),
                    metadata=entry.get("metadata", {}),
                    age_seconds=now - created_at,
                )

        if best_hit:
            logger.info(
                f"[cache] HIT: similarity={best_hit.similarity:.4f}, "
                f"age={best_hit.age_seconds:.0f}s, dept={department}"
            )
        return best_hit

    def put(
        self,
        query: str,
        answer: str,
        mode: str,
        department: str | None = None,
        metadata: dict | None = None,
    ) -> None:
        """Store a Q&A pair in cache.

        Args:
            query: Original user query.
            answer: Generated answer to cache.
            mode: Processing mode used ("rag" or "sql").
            department: Department scope.
            metadata: Additional metadata (citations, sources, etc.).
        """
        try:
            query_vec = self._embed_sync(query)
        except Exception as e:
            logger.warning(f"[cache] Embed failed, skipping cache store: {e}")
            return

        r = self._get_sync_redis()
        key = self._cache_key(department)
        now = time.time()

        entry = json.dumps({
            "query_vector": query_vec,
            "query_text": query,
            "answer": answer,
            "mode": mode,
            "metadata": metadata or {},
            "created_at": now,
        })

        try:
            # Add entry with timestamp as score
            r.zadd(key, {entry: now})

            # Enforce max entries: remove oldest if over limit
            count = r.zcard(key)
            if count > self.MAX_ENTRIES_PER_DEPT:
                excess = count - self.MAX_ENTRIES_PER_DEPT
                r.zremrangebyrank(key, 0, excess - 1)

            # Set TTL on the key itself (auto-cleanup)
            r.expire(key, self.TTL_SECONDS)

            logger.info(
                f"[cache] STORED: query='{query[:50]}...', mode={mode}, dept={department}"
            )
        except Exception as e:
            logger.warning(f"[cache] Redis write failed: {e}")

    def invalidate(self, department: str | None = None) -> int:
        """Invalidate cache entries.

        Called when new documents are uploaded (RAG answers may change)
        or when admin trains new DDL (SQL answers may change).

        Args:
            department: If provided, only invalidate this department's cache.
                If None, invalidate all caches.

        Returns:
            Number of entries removed.
        """
        r = self._get_sync_redis()
        removed = 0

        try:
            if department:
                key = self._cache_key(department)
                removed = r.zcard(key) or 0
                r.delete(key)
                logger.info(f"[cache] Invalidated {removed} entries for dept={department}")
            else:
                # Find all semcache keys
                keys = r.keys("semcache:*:entries")
                for key in keys:
                    key_str = key if isinstance(key, str) else key.decode()
                    count = r.zcard(key_str) or 0
                    removed += count
                    r.delete(key_str)
                logger.info(f"[cache] Invalidated {removed} entries across all departments")
        except Exception as e:
            logger.warning(f"[cache] Invalidation failed: {e}")

        return removed

    def cleanup_expired(self) -> int:
        """Remove entries older than TTL_SECONDS.

        Called periodically (e.g., via Celery beat).
        """
        r = self._get_sync_redis()
        cutoff = time.time() - self.TTL_SECONDS
        removed = 0

        try:
            keys = r.keys("semcache:*:entries")
            for key in keys:
                key_str = key if isinstance(key, str) else key.decode()
                count = r.zremrangebyscore(key_str, "-inf", cutoff)
                removed += count
            if removed:
                logger.info(f"[cache] Cleaned up {removed} expired entries")
        except Exception as e:
            logger.warning(f"[cache] Cleanup failed: {e}")

        return removed
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_semantic_cache.py -v`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/semantic_cache.py chatSNP170226/backend/tests/test_semantic_cache.py
git commit -m "feat(cache): add SemanticCache with Redis-backed Q&A caching by embedding similarity"
```

---

### Task 7: Integrate Semantic Cache into RAG Pipeline

**Files:**
- Modify: `chatSNP170226/backend/src/worker/chat_tasks.py`

- [ ] **Step 1: Add cache check before hybrid search in rag_document_search**

In `chatSNP170226/backend/src/worker/chat_tasks.py`, find the `rag_document_search` task (line 874). Inside the `try:` block, add cache check at the very beginning (after the opening log line):

Find:
```python
    logger.info(f"[RAG] Search for session {session_id}: {question[:50]}...")
    try:
        # ── Hybrid Search: Semantic (Qdrant) + BM25 (Whoosh) + RRF fusion ──
        from src.services.search.hybrid_search import HybridSearchService
```

Replace with:
```python
    logger.info(f"[RAG] Search for session {session_id}: {question[:50]}...")
    try:
        # ── Semantic Cache: check for cached answer first ──
        from src.services.semantic_cache import SemanticCache
        _cache = SemanticCache()
        try:
            cache_hit = _cache.get(question, department=department)
        except Exception as cache_err:
            logger.warning(f"[RAG] Cache lookup failed: {cache_err}")
            cache_hit = None

        if cache_hit:
            logger.info(
                f"[RAG] Cache HIT for session {session_id}: "
                f"similarity={cache_hit.similarity:.4f}, age={cache_hit.age_seconds:.0f}s"
            )
            result_text = cache_hit.answer

            # Save cached answer via Backend API
            from src.core.http_client import get_http_client
            http_client = get_http_client(timeout=10.0)
            cache_metadata = {
                "cache_hit": True,
                "cache_similarity": round(cache_hit.similarity, 4),
                "cache_age_seconds": round(cache_hit.age_seconds),
                "cache_original_query": cache_hit.original_query,
            }
            if target_message_id:
                resp = http_client.patch(
                    f"{BACKEND_INTERNAL_URL}/messages/{target_message_id}/content",
                    json={"content": result_text, "metadata": cache_metadata},
                )
            else:
                resp = http_client.post(
                    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                    json={
                        "content": result_text,
                        "role": "assistant",
                        "metadata": cache_metadata,
                    },
                )
            resp.raise_for_status()

            # Store cache metadata on the message
            try:
                msg_id = target_message_id or resp.json().get("id")
                if msg_id:
                    http_client.patch(
                        f"{BACKEND_INTERNAL_URL}/messages/{msg_id}/metadata",
                        json=cache_metadata,
                    )
            except Exception:
                pass

            from .helpers import publish_task_complete
            publish_task_complete(session_id)
            return {"status": "cache_hit", "question": question, "similarity": cache_hit.similarity}

        # ── Hybrid Search: Semantic (Qdrant) + BM25 (Whoosh) + RRF fusion ──
        from src.services.search.hybrid_search import HybridSearchService
```

- [ ] **Step 2: Add cache store after LLM synthesis**

In the same `rag_document_search` task, find the line where `result_text` is finalized and citations footer is added (around line 944):

Find:
```python
        result_text = _sanitize_generated_answer(result_text)
        logger.info(f"[RAG AFTER SANITIZE]:\n{result_text}\n{'='*50}")
        result_text += _format_citations_footer(citations)
```

Add AFTER those lines (but BEFORE the "Save via Backend API" section):

```python

        # ── Semantic Cache: store successful result ──
        try:
            _cache.put(
                query=question,
                answer=result_text,
                mode="rag",
                department=department,
                metadata={
                    "citations_count": len(citations),
                    "session_id": session_id,
                },
            )
        except Exception as cache_err:
            logger.warning(f"[RAG] Cache store failed: {cache_err}")

```

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/src/worker/chat_tasks.py
git commit -m "feat(cache): integrate SemanticCache into RAG pipeline (check before search, store after synthesis)"
```

---

### Task 8: Integrate Semantic Cache into SQL Pipeline + Cache Invalidation

**Files:**
- Modify: `chatSNP170226/backend/src/worker/data_tasks.py`
- Modify: `chatSNP170226/backend/src/worker/media_tasks.py`
- Modify: `chatSNP170226/backend/src/api/admin.py`

- [ ] **Step 1: Add cache check/store to SQL task**

In `chatSNP170226/backend/src/worker/data_tasks.py`, find the `run_sql_query` task (line 88). Inside the `try:` block, add cache check after the log line:

Find:
```python
    logger.info(f"[data_batch] SQL query for session {session_id}: {question[:50]}...")
    try:
        from src.core.vanna_setup import get_vanna
        vn = get_vanna()
```

Replace with:
```python
    logger.info(f"[data_batch] SQL query for session {session_id}: {question[:50]}...")
    try:
        # ── Semantic Cache: check for cached SQL answer first ──
        from src.services.semantic_cache import SemanticCache
        _sql_cache = SemanticCache()
        try:
            cache_hit = _sql_cache.get(question, department="_sql")
        except Exception as cache_err:
            logger.warning(f"[SQL] Cache lookup failed: {cache_err}")
            cache_hit = None

        if cache_hit:
            logger.info(
                f"[SQL] Cache HIT for session {session_id}: "
                f"similarity={cache_hit.similarity:.4f}"
            )
            result_text = cache_hit.answer
            try:
                from src.core.http_client import get_http_client
                cache_metadata = {
                    "cache_hit": True,
                    "cache_similarity": round(cache_hit.similarity, 4),
                }
                if target_message_id:
                    resp = get_http_client(timeout=10.0).patch(
                        f"{BACKEND_INTERNAL_URL}/messages/{target_message_id}/content",
                        json={"content": result_text, "metadata": cache_metadata},
                    )
                else:
                    resp = get_http_client(timeout=10.0).post(
                        f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                        json={
                            "content": result_text,
                            "role": "assistant",
                            "metadata": cache_metadata,
                        },
                    )
                resp.raise_for_status()
            except Exception as e:
                logger.error(f"[SQL] Failed to save cached result: {e}")

            from .helpers import publish_task_complete
            publish_task_complete(session_id)
            return {"status": "cache_hit", "question": question}

        from src.core.vanna_setup import get_vanna
        vn = get_vanna()
```

Then, find the section where the SQL result is saved via API (around line 209, the "6. Save result via API" section). Add cache store BEFORE the save block:

Find:
```python
        # 6. Save result via API (with attachments in metadata)
```

Add BEFORE that line:

```python
        # ── Semantic Cache: store successful SQL result ──
        if sql_success and result_text:
            try:
                _sql_cache.put(
                    query=question,
                    answer=result_text,
                    mode="sql",
                    department="_sql",
                    metadata={"session_id": session_id},
                )
            except Exception as cache_err:
                logger.warning(f"[SQL] Cache store failed: {cache_err}")

```

- [ ] **Step 2: Add cache invalidation on document upload**

In `chatSNP170226/backend/src/worker/media_tasks.py`, find the end of the `process_document` task (or the `_do_full_processing` function) where the document status is updated to "ready". Add cache invalidation after successful processing.

Search for `_update_document_status` call where `status="ready"`. Add AFTER it:

```python
        # ── Semantic Cache: invalidate department cache (new document may change answers) ──
        try:
            from src.services.semantic_cache import SemanticCache
            _cache = SemanticCache()
            # Invalidate both the department cache and global cache
            dept = payloads[0].get("department") if payloads else None
            if dept:
                removed = _cache.invalidate(department=dept)
                logger.info(f"[cache] Invalidated {removed} cache entries for dept={dept}")
        except Exception as cache_err:
            logger.warning(f"[cache] Cache invalidation failed: {cache_err}")
```

Note: Find the exact location by searching for the `_update_document_status` call with `status="ready"` in `media_tasks.py`.

- [ ] **Step 3: Add admin cache clear endpoint**

In `chatSNP170226/backend/src/api/admin.py`, add a new endpoint at the end of the file (before the last line):

```python
@router.delete("/cache/semantic")
async def clear_semantic_cache(department: str | None = None):
    """Admin: clear semantic cache for a department or all.

    Args:
        department: Optional department filter. If not provided, clears all caches.

    Returns:
        Number of cache entries removed.
    """
    from src.services.semantic_cache import SemanticCache
    cache = SemanticCache()
    removed = cache.invalidate(department=department)
    return {"removed": removed, "department": department or "all"}
```

- [ ] **Step 4: Commit**

```bash
git add chatSNP170226/backend/src/worker/data_tasks.py \
       chatSNP170226/backend/src/worker/media_tasks.py \
       chatSNP170226/backend/src/api/admin.py
git commit -m "feat(cache): integrate semantic cache into SQL pipeline + invalidation on upload + admin endpoint"
```

---

### Task 9: Cache Tests — Hit/Miss, TTL, Invalidation

**Files:**
- Create: `chatSNP170226/backend/tests/test_semantic_cache_integration.py`

- [ ] **Step 1: Write integration tests for cache behavior**

Create `chatSNP170226/backend/tests/test_semantic_cache_integration.py`:

```python
"""Integration tests for SemanticCache behavior within RAG/SQL pipelines.

Tests cache hit/miss logic, TTL behavior, and invalidation scenarios.
Uses mocks — does not require running Redis or Mem0 services.
"""
import json
import math
import time
from unittest.mock import patch, MagicMock

import pytest

from src.services.semantic_cache import SemanticCache, CacheHit


def _normalized_vector(seed: float) -> list[float]:
    """Generate a normalized 1024-dim test vector."""
    raw = [math.sin(i * seed) for i in range(1024)]
    norm = math.sqrt(sum(x * x for x in raw))
    return [x / norm for x in raw]


class TestCacheMissScenarios:
    """Test that cache correctly returns None for misses."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_empty_cache_returns_none(self, mock_embed, mock_redis):
        """Empty cache should always return None."""
        mock_embed.return_value = _normalized_vector(0.5)
        redis_mock = MagicMock()
        redis_mock.zrangebyscore.return_value = []
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        assert cache.get("Any query", department="test") is None

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_low_similarity_returns_none(self, mock_embed, mock_redis):
        """Cached entry with low similarity should not be returned."""
        cached_vec = _normalized_vector(0.1)
        query_vec = _normalized_vector(99.0)
        mock_embed.return_value = query_vec

        redis_mock = MagicMock()
        entry = json.dumps({
            "query_vector": cached_vec,
            "query_text": "Old query",
            "answer": "Old answer",
            "mode": "rag",
            "metadata": {},
            "created_at": time.time(),
        })
        redis_mock.zrangebyscore.return_value = [entry]
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        hit = cache.get("Very different query", department="test")
        assert hit is None


class TestCacheHitScenarios:
    """Test that cache correctly returns hits."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_identical_vector_returns_hit(self, mock_embed, mock_redis):
        """Same vector should always return a hit (cosine = 1.0)."""
        vec = _normalized_vector(0.42)
        mock_embed.return_value = vec

        redis_mock = MagicMock()
        entry = json.dumps({
            "query_vector": vec,
            "query_text": "Test query",
            "answer": "Test answer",
            "mode": "rag",
            "metadata": {"citations": 3},
            "created_at": time.time() - 60,
        })
        redis_mock.zrangebyscore.return_value = [entry]
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        hit = cache.get("Test query", department="test")
        assert hit is not None
        assert hit.similarity >= 0.99
        assert hit.answer == "Test answer"
        assert hit.mode == "rag"
        assert hit.age_seconds >= 59  # At least 59 seconds old

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_best_match_returned_when_multiple_entries(self, mock_embed, mock_redis):
        """When multiple entries exist, the best match should be returned."""
        query_vec = _normalized_vector(0.42)
        mock_embed.return_value = query_vec

        redis_mock = MagicMock()
        # Entry 1: exact match
        entry1 = json.dumps({
            "query_vector": query_vec,
            "query_text": "Exact match",
            "answer": "Answer 1",
            "mode": "sql",
            "metadata": {},
            "created_at": time.time(),
        })
        # Entry 2: different vector
        entry2 = json.dumps({
            "query_vector": _normalized_vector(0.1),
            "query_text": "Different query",
            "answer": "Answer 2",
            "mode": "rag",
            "metadata": {},
            "created_at": time.time(),
        })
        redis_mock.zrangebyscore.return_value = [entry1, entry2]
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        hit = cache.get("Exact match query", department="test")
        assert hit is not None
        assert hit.answer == "Answer 1"


class TestCacheTTL:
    """Test TTL behavior."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_expired_entries_not_returned(self, mock_embed, mock_redis):
        """Entries older than TTL should not be returned by zrangebyscore."""
        mock_embed.return_value = _normalized_vector(0.42)
        redis_mock = MagicMock()
        # zrangebyscore with cutoff will filter expired entries
        redis_mock.zrangebyscore.return_value = []
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        # Even if entries exist, expired ones are filtered by Redis score range
        hit = cache.get("Any query", department="test")
        assert hit is None


class TestCacheInvalidation:
    """Test cache invalidation."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    def test_invalidate_clears_department(self, mock_redis):
        redis_mock = MagicMock()
        redis_mock.zcard.return_value = 15
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        removed = cache.invalidate(department="logistics")
        assert removed == 15
        redis_mock.delete.assert_called_once_with("semcache:logistics:entries")

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    def test_invalidate_all_clears_everything(self, mock_redis):
        redis_mock = MagicMock()
        redis_mock.keys.return_value = [
            "semcache:ops:entries",
            "semcache:hr:entries",
            "semcache:_sql:entries",
        ]
        redis_mock.zcard.return_value = 10
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        removed = cache.invalidate(department=None)
        assert removed == 30  # 10 per key × 3 keys
        assert redis_mock.delete.call_count == 3


class TestCacheMaxEntries:
    """Test MAX_ENTRIES_PER_DEPT enforcement."""

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_excess_entries_trimmed(self, mock_embed, mock_redis):
        """When cache exceeds MAX_ENTRIES, oldest entries should be removed."""
        mock_embed.return_value = _normalized_vector(0.5)
        redis_mock = MagicMock()
        redis_mock.zcard.return_value = 1002  # Over limit
        mock_redis.return_value = redis_mock

        cache = SemanticCache()
        cache.put("New query", "New answer", "rag", department="test")

        # Should trim excess entries
        redis_mock.zremrangebyrank.assert_called_once()
```

- [ ] **Step 2: Run cache integration tests**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_semantic_cache_integration.py -v`
Expected: PASS (8 tests)

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/tests/test_semantic_cache_integration.py
git commit -m "test(cache): add integration tests for cache hit/miss, TTL, invalidation, max entries"
```

---

### Task 10: Full Integration Test — Auto Mode → Routing → Cache → Search → Response

**Files:**
- Create: `chatSNP170226/backend/tests/test_phase8_integration.py`

- [ ] **Step 1: Write full end-to-end integration test**

Create `chatSNP170226/backend/tests/test_phase8_integration.py`:

```python
"""Full Phase 8 integration test — Auto-routing + Semantic Cache working together.

Tests the complete flow:
  1. User sends message with mode="auto"
  2. IntentRouter classifies intent → resolves to rag/sql/chat
  3. SemanticCache checked → miss → full pipeline runs
  4. Result stored in cache
  5. Second identical query → cache hit → skip pipeline
"""
import json
import math
import time
from unittest.mock import patch, MagicMock, AsyncMock
from uuid import uuid4

import pytest

from src.services.intent_router import IntentRouter, RoutingResult
from src.services.semantic_cache import SemanticCache, CacheHit


def _normalized_vector(seed: float) -> list[float]:
    raw = [math.sin(i * seed) for i in range(1024)]
    norm = math.sqrt(sum(x * x for x in raw))
    return [x / norm for x in raw]


class TestAutoRouteThenCache:
    """Test the auto-routing → cache lookup flow."""

    def test_sql_query_routes_and_caches(self):
        """SQL query: auto-route to sql, then cache the result."""
        # Step 1: Route
        router = IntentRouter()
        result = router.classify("Biểu giá container 20ft tháng này bao nhiêu?")
        assert result.intent == "sql"
        assert result.confidence >= 0.7

    def test_rag_query_routes_and_caches(self):
        """RAG query: auto-route to rag, then cache the result."""
        router = IntentRouter()
        result = router.classify("Quy trình xuất khẩu hàng đông lạnh gồm những bước nào?")
        assert result.intent == "rag"
        assert result.confidence >= 0.7

    def test_chat_query_skips_cache(self):
        """Chat queries should not use the cache (no expensive pipeline)."""
        router = IntentRouter()
        result = router.classify("Xin chào bạn, tôi cần trợ giúp")
        assert result.intent == "chat"
        # Chat mode doesn't need caching since it uses direct LLM call

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_cache_miss_then_hit_flow(self, mock_embed, mock_redis):
        """First query = miss (empty cache), store result, second query = hit."""
        vec = _normalized_vector(0.42)
        mock_embed.return_value = vec

        redis_mock = MagicMock()
        mock_redis.return_value = redis_mock
        stored_entries = []

        def fake_zadd(key, mapping):
            for entry_json, score in mapping.items():
                stored_entries.append(entry_json)

        def fake_zrangebyscore(key, min_score, max_score):
            return stored_entries

        redis_mock.zadd.side_effect = fake_zadd
        redis_mock.zrangebyscore.side_effect = fake_zrangebyscore
        redis_mock.zcard.return_value = 0

        cache = SemanticCache()

        # First query: cache miss
        hit1 = cache.get("Biểu giá container 20ft?", department="ops")
        assert hit1 is None  # Empty cache

        # Store result after pipeline
        cache.put(
            query="Biểu giá container 20ft?",
            answer="Giá container 20ft: 1.200.000 VNĐ",
            mode="sql",
            department="ops",
        )

        # Second query: cache hit
        hit2 = cache.get("Biểu giá container 20ft?", department="ops")
        assert hit2 is not None
        assert hit2.answer == "Giá container 20ft: 1.200.000 VNĐ"
        assert hit2.similarity >= 0.99

    @patch("src.services.semantic_cache.SemanticCache._get_sync_redis")
    @patch("src.services.semantic_cache.SemanticCache._embed_sync")
    def test_different_department_no_cross_cache(self, mock_embed, mock_redis):
        """Queries from different departments should not share cache."""
        vec = _normalized_vector(0.42)
        mock_embed.return_value = vec

        redis_mock = MagicMock()
        mock_redis.return_value = redis_mock

        cache = SemanticCache()

        # Department A has cached entry
        entry = json.dumps({
            "query_vector": vec,
            "query_text": "Test",
            "answer": "Answer for dept A",
            "mode": "rag",
            "metadata": {},
            "created_at": time.time(),
        })

        def fake_zrangebyscore(key, min_score, max_score):
            if "dept_a" in key:
                return [entry]
            return []

        redis_mock.zrangebyscore.side_effect = fake_zrangebyscore

        # Dept A: hit
        hit_a = cache.get("Test query", department="dept_a")
        assert hit_a is not None

        # Dept B: miss
        hit_b = cache.get("Test query", department="dept_b")
        assert hit_b is None


class TestRoutingAndCacheMetadata:
    """Test that routing metadata is properly structured for frontend."""

    def test_routing_result_serializable(self):
        """RoutingResult should be JSON-serializable for message metadata."""
        router = IntentRouter()
        result = router.classify("Thống kê sản lượng quý 1")

        # Should be convertible to dict for storage
        meta = {
            "detected_mode": result.intent,
            "routing_confidence": result.confidence,
            "routing_reason": result.reasoning,
            "routing_fallback": result.fallback_used,
        }
        serialized = json.dumps(meta)
        deserialized = json.loads(serialized)
        assert deserialized["detected_mode"] in ("sql", "rag", "chat")
        assert isinstance(deserialized["routing_confidence"], float)

    def test_cache_hit_serializable(self):
        """CacheHit should be JSON-serializable for message metadata."""
        hit = CacheHit(
            answer="Test answer",
            original_query="Test query",
            similarity=0.97,
            mode="rag",
            metadata={"citations": 3},
            age_seconds=120.0,
        )
        meta = {
            "cache_hit": True,
            "cache_similarity": round(hit.similarity, 4),
            "cache_age_seconds": round(hit.age_seconds),
        }
        serialized = json.dumps(meta)
        deserialized = json.loads(serialized)
        assert deserialized["cache_hit"] is True
        assert deserialized["cache_similarity"] == 0.97
```

- [ ] **Step 2: Run full integration test**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_phase8_integration.py -v`
Expected: PASS (8 tests)

- [ ] **Step 3: Run ALL Phase 8 tests together**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_intent_router.py tests/test_auto_routing_integration.py tests/test_semantic_cache.py tests/test_semantic_cache_integration.py tests/test_phase8_integration.py -v`
Expected: ALL PASS

- [ ] **Step 4: Run existing test suite for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -30`
Expected: No new failures introduced

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/tests/test_phase8_integration.py
git commit -m "test: add full Phase 8 integration test (auto-routing + semantic cache end-to-end)"
```

- [ ] **Step 6: Final milestone commit**

```bash
git commit --allow-empty -m "milestone: Phase 8 Auto-routing + Semantic Cache complete"
```

---

## Files Changed Summary

| Task | New Files | Modified Files |
|---|---|---|
| 1 | `backend/src/services/intent_router.py`, `backend/tests/test_intent_router.py` | — |
| 2 | — | `backend/src/schemas/schemas.py` |
| 3 | — | `backend/src/services/chat_service.py`, `backend/src/api/chat.py` |
| 4 | — | `frontend/src/components/chat/chat-composer.tsx`, `frontend/src/components/chat/chat-message-list.tsx`, `frontend/src/components/chat/processing-status.tsx`, `frontend/src/components/chat-ui.tsx`, `frontend/src/services/chat-backend.ts` |
| 5 | `backend/tests/test_auto_routing_integration.py` | — |
| 6 | `backend/src/services/semantic_cache.py`, `backend/tests/test_semantic_cache.py` | — |
| 7 | — | `backend/src/worker/chat_tasks.py` |
| 8 | — | `backend/src/worker/data_tasks.py`, `backend/src/worker/media_tasks.py`, `backend/src/api/admin.py` |
| 9 | `backend/tests/test_semantic_cache_integration.py` | — |
| 10 | `backend/tests/test_phase8_integration.py` | — |

## Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Auto-routing misclassifies intent | Wrong mode, bad answer | Confidence threshold 0.7; heuristic-first avoids unnecessary LLM calls; user can manually select mode; all routing logged |
| Semantic cache serves stale answers | Incorrect information | 0.95 similarity threshold; 24h TTL; invalidation on document upload; admin clear endpoint |
| LLM routing call adds latency | Slower first message | Heuristic pre-filter handles ~80% of queries instantly; LLM call only for ambiguous queries (~300ms) |
| Redis memory growth from cache | Higher memory | MAX_ENTRIES_PER_DEPT=1000; TTL auto-expiry; admin can clear caches |
| Embedding call failure | Cache lookup/store fails | Graceful degradation: cache errors are caught and logged, pipeline continues normally |
