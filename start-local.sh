#!/bin/bash

# Script to run local server

PORT=8000

echo "🚀 Starting local server on port $PORT..."
echo "📱 Access: http://localhost:$PORT"
echo "⏹️  Press Ctrl+C to stop"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Error: Python is not installed"
    echo "Install Python or use another HTTP server"
    exit 1
fi
