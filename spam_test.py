import asyncio
import httpx
import time
from uuid import uuid4

async def send_message(session_id, i):
    async with httpx.AsyncClient() as client:
        start = time.time()
        try:
            # Create session first if not exists (mocking logic, usually we use one session)
            # We will use one session for all 10 messages
            payload = {
                "role": "user",
                "content": f"Spam message {i} - checking concurrency"
            }
            res = await client.post(
                f"http://localhost:8000/sessions/{session_id}/messages", 
                json=payload,
                timeout=10
            )
            print(f"Msg {i}: Status {res.status_code} (Time: {time.time() - start:.2f}s)")
        except Exception as e:
            print(f"Msg {i}: Error {e}")

async def spam():
    # Create a session
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(
                "http://localhost:8000/sessions",
                json={"user_id": "spammer", "title": "Load Test", "department": "QA"}
            )
            if res.status_code != 201:
                print("Failed to create session")
                return
            session_id = res.json()["id"]
            print(f"Created Session: {session_id}")
            
            tasks = [send_message(session_id, i) for i in range(1, 11)]
            await asyncio.gather(*tasks)
            print("Finished sending 10 messages. Check Flower!")
        except Exception as e:
            print(f"Setup Error: {e}")

if __name__ == "__main__":
    asyncio.run(spam())
