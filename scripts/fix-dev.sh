#!/bin/zsh
set -e
cd "$(dirname "$0")/.."

echo "→ Eski Next.js süreçleri kapatılıyor..."
lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
lsof -tiTCP:3001 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
lsof -tiTCP:3010 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
sleep 1

echo "→ .next cache temizleniyor..."
rm -rf .next

echo "→ Dev sunucu başlatılıyor (http://127.0.0.1:3000)..."
npm run dev -- -H 127.0.0.1 -p 3000
