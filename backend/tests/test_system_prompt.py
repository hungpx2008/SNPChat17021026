"""Tests for SystemPromptBuilder (Phase 3: Dynamic System Prompt)."""

import pytest


class TestSystemPromptBuilder:
    def _make_builder(self):
        from src.services.context_builder import SystemPromptBuilder
        return SystemPromptBuilder()

    def test_basic_rag_prompt(self):
        builder = self._make_builder()
        prompt = builder.build(mode="rag")
        assert "Vai trò" in prompt
        assert "Tân Cảng Sài Gòn" in prompt
        assert "tài liệu" in prompt  # RAG tool description
        assert "Quy tắc Trả lời" in prompt

    def test_chat_mode(self):
        builder = self._make_builder()
        prompt = builder.build(mode="chat")
        assert "kiến thức chung" in prompt
        assert "RAG" in prompt  # suggests switching to RAG

    def test_sql_mode(self):
        builder = self._make_builder()
        prompt = builder.build(mode="sql")
        assert "SELECT" in prompt
        assert "DROP" in prompt  # mentions forbidden operations

    def test_unknown_mode_defaults_to_chat(self):
        builder = self._make_builder()
        prompt = builder.build(mode="unknown_mode")
        assert "kiến thức chung" in prompt  # chat fallback

    def test_with_memories(self):
        builder = self._make_builder()
        prompt = builder.build(
            mode="rag",
            memories=["User works in logistics", "Prefers Vietnamese"],
        )
        assert "User works in logistics" in prompt
        assert "Prefers Vietnamese" in prompt
        assert "Thông tin đã biết" in prompt

    def test_with_department(self):
        builder = self._make_builder()
        prompt = builder.build(mode="rag", department="Phòng Kế hoạch")
        assert "Phòng Kế hoạch" in prompt
        assert "Phòng ban" in prompt

    def test_with_session_summary(self):
        builder = self._make_builder()
        prompt = builder.build(
            mode="rag",
            session_summary="Discussed container pricing for 20ft units",
        )
        assert "container pricing" in prompt
        assert "Tóm tắt hội thoại" in prompt

    def test_no_context(self):
        builder = self._make_builder()
        prompt = builder.build(mode="rag")
        assert "Không có ngữ cảnh bổ sung" in prompt

    def test_full_context(self):
        builder = self._make_builder()
        prompt = builder.build(
            mode="rag",
            memories=["Khách hàng VIP", "Thường hỏi về giá"],
            session_summary="Hỏi về phí container 40ft",
            department="Kinh doanh",
        )
        assert "Khách hàng VIP" in prompt
        assert "Kinh doanh" in prompt
        assert "container 40ft" in prompt
        # Should have all 4 sections
        assert "Vai trò" in prompt
        assert "Ngữ cảnh Người dùng" in prompt
        assert "Công cụ Khả dụng" in prompt
        assert "Quy tắc Trả lời" in prompt


class TestResponseRules:
    def test_rules_contain_key_elements(self):
        from src.services.context_builder import _RESPONSE_RULES_VI
        assert "bullet points" in _RESPONSE_RULES_VI
        assert "Markdown" in _RESPONSE_RULES_VI
        assert "VNĐ" in _RESPONSE_RULES_VI
        assert "hotline 1800 1188" in _RESPONSE_RULES_VI
        assert "bịa số liệu" in _RESPONSE_RULES_VI


class TestModeTools:
    def test_all_modes_defined(self):
        from src.services.context_builder import _MODE_TOOLS
        assert "rag" in _MODE_TOOLS
        assert "chat" in _MODE_TOOLS
        assert "sql" in _MODE_TOOLS

    def test_modes_not_empty(self):
        from src.services.context_builder import _MODE_TOOLS
        for mode, desc in _MODE_TOOLS.items():
            assert len(desc) > 20, f"Mode '{mode}' description too short"


class TestBuildUserContext:
    def test_empty(self):
        from src.services.context_builder import SystemPromptBuilder
        result = SystemPromptBuilder._build_user_context(None, "", None)
        assert "Không có ngữ cảnh bổ sung" in result

    def test_department_only(self):
        from src.services.context_builder import SystemPromptBuilder
        result = SystemPromptBuilder._build_user_context(None, "", "IT")
        assert "IT" in result
        assert "Phòng ban" in result

    def test_all_fields(self):
        from src.services.context_builder import SystemPromptBuilder
        result = SystemPromptBuilder._build_user_context(
            memories=["mem1", "mem2"],
            session_summary="summary text",
            department="Sales",
        )
        assert "Sales" in result
        assert "mem1" in result
        assert "summary text" in result

    def test_empty_memories_filtered(self):
        from src.services.context_builder import SystemPromptBuilder
        result = SystemPromptBuilder._build_user_context(
            memories=["", None, "real memory"],
            session_summary="",
            department=None,
        )
        assert "real memory" in result
