#!/bin/bash
# Quick manual test for parallel context

echo "🔍 Checking build status..."
docker compose ps | grep -E "backend|worker"

echo ""
echo "📋 Recent worker logs (last 30 lines):"
docker compose logs --tail=30 worker_chat 2>/dev/null || echo "Worker not running yet"

echo ""
echo "✅ Manual test steps:"
echo "1. Wait for containers to be 'running (healthy)'"
echo "2. Open http://localhost:3000 in browser"
echo "3. Create new chat session"
echo "4. Switch to RAG mode"
echo "5. Ask: 'Giá cước container 20 feet?'"
echo "6. Watch response time (should be < 3s)"
echo ""
echo "📊 Check logs with:"
echo "   docker compose logs -f worker_chat | grep 'RAG Context'"
echo ""
echo "Expected log output:"
echo "   [RAG Context] Fetching Mem0 + DB + Qdrant in parallel..."
echo "   [RAG Context] Fetched: Mem0=X, Messages=Y, Qdrant=Z"
