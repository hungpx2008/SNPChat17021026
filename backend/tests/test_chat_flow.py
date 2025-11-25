from uuid import UUID

import pytest


@pytest.mark.asyncio
async def test_session_lifecycle(client):
    # Create session
    response = await client.post(
        "/sessions",
        json={"user_id": "user-1", "department": "IT", "title": "First session"},
    )
    assert response.status_code == 201
    session_data = response.json()
    session_id = session_data["id"]

    # List sessions
    response = await client.get("/sessions", params={"user_id": "user-1"})
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 1
    assert sessions[0]["id"] == session_id

    # Add messages
    message_payloads = [
        {"role": "user", "content": "Xin chao, toi can thong tin ve GPU."},
        {"role": "assistant", "content": "Day la thong tin GPU ban can."},
    ]
    for payload in message_payloads:
        response = await client.post(f"/sessions/{session_id}/messages", json=payload)
        assert response.status_code == 201
        message = response.json()
        UUID(message["id"])  # Validate UUID format

    # Retrieve session with messages
    response = await client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert len(data["messages"]) == 2

    # Semantic search should surface stored chunks
    response = await client.post(
        "/sessions/search",
        json={"user_id": "user-1", "query": "GPU thong tin", "limit": 3},
    )
    assert response.status_code == 200
    results = response.json()
    assert results, "Expected semantic search to return results"
    assert any("GPU" in result["text"] for result in results)
