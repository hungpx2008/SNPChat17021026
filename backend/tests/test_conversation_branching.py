import pytest

from src.schemas.schemas import MessageCreate
from src.services.chat_service import ChatService


@pytest.mark.asyncio
async def test_edit_message_creates_new_active_branch(db_session):
    service = ChatService(db_session)
    chat_session = await service.create_session(
        user_id="user-branch",
        department="IT",
        title="Branch test",
        external_id=None,
    )
    await db_session.commit()

    original_user = await service.add_message(
        chat_session.id,
        MessageCreate(role="user", content="Cau hoi ban dau"),
        user_id=chat_session.user_id,
        department=chat_session.department,
    )
    original_assistant = await service.add_message(
        chat_session.id,
        MessageCreate(role="assistant", content="Tra loi ban dau"),
        user_id=chat_session.user_id,
        department=chat_session.department,
    )
    await db_session.commit()

    edited_message = await service.edit_message(original_user.id, "Cau hoi da sua")
    await db_session.commit()

    assert edited_message.content == "Cau hoi da sua"
    assert edited_message.parent_message_id is None
    assert edited_message.branch_index == 1
    assert edited_message.is_active_branch is True

    active_messages = await service.get_session_with_messages(chat_session.id)
    assert [message["content"] for message in active_messages] == ["Cau hoi da sua"]

    branch_info = await service.get_branch_info(edited_message.id)
    assert branch_info.current_index == 2
    assert branch_info.total_branches == 2
    assert len(branch_info.sibling_ids) == 2
    assert branch_info.fork_point_id is None

    full_tree = await service.get_conversation_tree(chat_session.id)
    assert len(full_tree["roots"]) == 2
    assert full_tree["roots"][0]["children"][0]["id"] == str(original_assistant.id)


@pytest.mark.asyncio
async def test_navigate_branch_switches_active_path(db_session):
    service = ChatService(db_session)
    chat_session = await service.create_session(
        user_id="user-nav",
        department="IT",
        title="Navigation test",
        external_id=None,
    )
    await db_session.commit()

    original_user = await service.add_message(
        chat_session.id,
        MessageCreate(role="user", content="Ban goc"),
        user_id=chat_session.user_id,
        department=chat_session.department,
    )
    await service.add_message(
        chat_session.id,
        MessageCreate(role="assistant", content="Tra loi goc"),
        user_id=chat_session.user_id,
        department=chat_session.department,
    )
    await db_session.commit()

    edited_message = await service.edit_message(original_user.id, "Ban nhanh moi")
    await db_session.commit()

    active_messages = await service.navigate_branch(edited_message.id, -1)
    await db_session.commit()

    assert [message.content for message in active_messages] == ["Ban goc", "Tra loi goc"]

    branch_info = await service.get_branch_info(original_user.id)
    assert branch_info.current_index == 1
    assert branch_info.total_branches == 2
