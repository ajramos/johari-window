#!/bin/bash

# Script para correr servidor local

PORT=8000

echo "🚀 Iniciando servidor local en puerto $PORT..."
echo "📱 Accede a: http://localhost:$PORT"
echo "⏹️  Presiona Ctrl+C para detener"
echo ""

# Verificar si Python 3 está disponible
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Error: Python no está instalado"
    echo "Instala Python o usa otro servidor HTTP"
    exit 1
fi
