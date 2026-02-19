import requests
import subprocess
import time
import sys
import json
from uuid import uuid4

def print_status(step, status, msg=""):
    symbol = "✅" if status else "❌"
    print(f"{symbol} [{step}] {msg}")

def check_backend_health():
    print("--- 1. Checking Backend Health ---")
    retries = 12
    for i in range(retries):
        try:
            response = requests.get("http://localhost:8000/docs", timeout=5)
            if response.status_code == 200:
                print_status("Backend", True, "Swagger UI is accessible")
                return True
            else:
                print(f"Attempt {i+1}: Status {response.status_code}. Retrying...")
        except Exception as e:
            print(f"Attempt {i+1}: Error {e}. Retrying...")
        time.sleep(5)
    
    print_status("Backend", False, "Backend not responding after 60s")
    return False

def check_flower_workers():
    print("\n--- 2. Checking Workers via Flower ---")
    try:
        # Flower API to get workers
        response = requests.get("http://localhost:5555/api/workers", timeout=5)
        if response.status_code != 200:
            print_status("Flower", False, f"Cannot access Flower API: {response.status_code}")
            return False
        
        workers = response.json()
        worker_names = list(workers.keys())
        print(f"Found {len(workers)} workers: {worker_names}")
        
        required = ["chat", "data", "media"]
        found = 0
        for req in required:
            if any(req in name for name in worker_names):
                print_status(f"Worker {req}", True, "Online")
                found += 1
            else:
                print_status(f"Worker {req}", False, "Offline")
        
        return found >= 3
    except Exception as e:
        print_status("Flower", False, f"Error: {e}")
        return False

def check_libraries():
    print("\n--- 3. Checking Heavy Libraries in Backend Container ---")
    cmd = [
        "docker", "exec", "chatsnp-backend", 
        "python", "-c", 
        "import vanna; import lida; import docling; print('Libraries Import Success')"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if "Libraries Import Success" in result.stdout:
            print_status("Libraries", True, "Vanna, Lida, Docling imported successfully")
            return True
        else:
            print_status("Libraries", False, f"Import failed. Stderr: {result.stderr}")
            return False
    except Exception as e:
        print_status("Libraries", False, str(e))
        return False

def check_end_to_end():
    print("\n--- 4. End-to-End Chat Test ---")
    session_id = str(uuid4())
    user_id = "test_user_01"
    
    # Create session
    try:
        sess_resp = requests.post(
            "http://localhost:8000/sessions",
            json={"user_id": user_id, "title": "Test Session", "department": "IT"}
        )
        if sess_resp.status_code != 201:
            print_status("Create Session", False, f"Failed: {sess_resp.text}")
            return False
        
        real_session_id = sess_resp.json()["id"]
        print_status("Create Session", True, f"Session ID: {real_session_id}")
        
        # Send message
        msg_resp = requests.post(
            f"http://localhost:8000/sessions/{real_session_id}/messages",
            json={"role": "user", "content": "Hello world check celery"}
        )
        if msg_resp.status_code != 201:
            print_status("Send Message", False, f"Failed: {msg_resp.text}")
            return False
        
        print_status("Send Message", True, "Message accepted")
        
        print("Checking worker logs for task execution...")
        time.sleep(2) # Wait for Celery
        
        # Check logs of worker_chat
        log_cmd = ["docker", "logs", "chatsnp-worker-chat", "--tail", "100"]
        log_res = subprocess.run(log_cmd, capture_output=True, text=True)
        
        if "process_chat_response" in log_res.stderr or "process_chat_response" in log_res.stdout:
             print_status("Celery Task", True, "Task 'process_chat_response' found in logs")
             return True
        else:
             print_status("Celery Task", False, "Task not found in logs (might be delayed or consumed silently)")
             print("Recent logs:", log_res.stderr[-200:])
             return False

    except Exception as e:
        print_status("E2E Test", False, str(e))
        return False

if __name__ == "__main__":
    print("=== STARTING VERIFICATION ===")
    checks = [
        check_backend_health(),
        check_libraries(),
        check_flower_workers(),
        check_end_to_end()
    ]
    
    if all(checks):
        print("\n🎉 ALL SYSTEMS GO! Deployment Successful.")
        sys.exit(0)
    else:
        print("\n⚠️ SOME CHECKS FAILED.")
        sys.exit(1)
