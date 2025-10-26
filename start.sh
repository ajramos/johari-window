#!/bin/sh

echo "Starting Johari Window Backend + Frontend..."

# Start backend in background
echo "Starting backend API on port 3000..."
cd /app/backend
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la
echo "Running server..."
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
    echo "Backend logs:"
    cat /tmp/backend.log
    echo "Starting nginx on port 8080..."
    exec nginx -g "daemon off;"
else
    echo "❌ Error: Backend failed to start"
    echo "Backend logs:"
    cat /tmp/backend.log
    echo "Process list:"
    ps aux
    exit 1
fi
