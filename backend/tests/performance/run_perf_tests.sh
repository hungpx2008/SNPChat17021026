#!/bin/bash
# Script chạy performance tests cho document upload

set -e

cd "$(dirname "$0")/../.."

echo "🚀 Starting ChatSNP Upload Performance Tests"
echo "=============================================="
echo ""

# Kiểm tra server đang chạy
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ Backend server not running at http://localhost:8000"
    echo "   Start it with: cd chatSNP170226 && docker compose up -d"
    exit 1
fi

echo "✅ Backend server is running"
echo ""

# Cài đặt dependencies nếu cần
pip install -q reportlab pytest pytest-asyncio httpx

# Chạy tests
echo "Running performance tests..."
echo ""

python tests/performance/test_upload_performance.py run

echo ""
echo "✅ Performance tests completed"
