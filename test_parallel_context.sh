#!/bin/bash
# Test script for Parallel Context Fix
# Usage: ./test_parallel_context.sh

set -e

BASE_URL="http://localhost:8001"
SESSION_ID=""

echo "=========================================="
echo "🧪 TEST PARALLEL CONTEXT FIX"
echo "=========================================="
echo ""

# Function to create session
create_session() {
    echo "📝 Creating new chat session..."
    RESPONSE=$(curl -s -X POST "$BASE_URL/chat/sessions" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "test_user_parallel",
            "department": "IT",
            "title": "Test Parallel Context"
        }')

    SESSION_ID=$(echo $RESPONSE | jq -r '.id')
    echo "✅ Session created: $SESSION_ID"
    echo ""
}

# Function to send message
send_message() {
    local content=$1
    local mode=${2:-"rag"}

    echo "💬 Sending message (mode=$mode): $content"
    START_TIME=$(date +%s%3N)

    RESPONSE=$(curl -s -X POST "$BASE_URL/chat/sessions/$SESSION_ID/messages" \
        -H "Content-Type: application/json" \
        -d "{
            \"role\": \"user\",
            \"content\": \"$content\",
            \"mode\": \"$mode\"
        }")

    END_TIME=$(date +%s%3N)
    DURATION=$((END_TIME - START_TIME))

    echo "⏱️  Response time: ${DURATION}ms"
    echo "📨 Response: $(echo $RESPONSE | jq -r '.content' | head -c 100)..."
    echo ""
}

# Function to check logs
check_logs() {
    echo "📊 Checking worker logs for parallel execution..."
    echo ""
    docker compose logs --tail=50 worker_chat | grep -E "RAG Context|Mem0|Qdrant|DB" | tail -20
    echo ""
}

# Main test flow
main() {
    echo "⏳ Waiting for services to be ready..."
    sleep 10

    # Test 1: Create session
    create_session

    # Test 2: Send RAG query (should trigger parallel fetch)
    echo "=========================================="
    echo "TEST 1: RAG Query (Parallel Context)"
    echo "=========================================="
    send_message "Giá cước container 20 feet là bao nhiêu?" "rag"
    sleep 5

    # Test 3: Send chat query
    echo "=========================================="
    echo "TEST 2: Chat Query"
    echo "=========================================="
    send_message "Cảm ơn bạn đã trả lời" "chat"
    sleep 3

    # Test 4: Another RAG query
    echo "=========================================="
    echo "TEST 3: Another RAG Query"
    echo "=========================================="
    send_message "Thủ tục hải quan như thế nào?" "rag"
    sleep 5

    # Check logs
    echo "=========================================="
    echo "📋 LOGS CHECK"
    echo "=========================================="
    check_logs

    echo "=========================================="
    echo "✅ TEST COMPLETED"
    echo "=========================================="
    echo ""
    echo "📌 Things to verify in logs:"
    echo "   1. '[RAG Context] Fetching Mem0 + DB + Qdrant in parallel...'"
    echo "   2. '[RAG Context] Fetched: Mem0=X, Messages=Y, Qdrant=Z'"
    echo "   3. No timeout errors"
    echo "   4. Response time < 3s for RAG queries"
    echo ""
}

# Run tests
main
