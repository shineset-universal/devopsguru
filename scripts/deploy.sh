#!/bin/bash
# DevOpsGuru — VPS deploy script
# Run on the VPS: bash scripts/deploy.sh

set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE="docker compose -f $APP_DIR/docker-compose.prod.yml"

echo "==> Pulling latest code..."
git -C "$APP_DIR" pull origin main

echo "==> Building and starting containers..."
$COMPOSE up -d --build --remove-orphans

echo "==> Waiting for health checks..."
sleep 10

echo "==> Container status:"
$COMPOSE ps

echo "==> Checking app is reachable..."
curl -sf http://localhost:3000 > /dev/null && echo "App OK" || echo "WARN: app not yet ready (may still be starting)"
curl -sf http://localhost:3001 > /dev/null && echo "Admin OK" || echo "WARN: admin not yet ready"

echo ""
echo "Deploy complete."
echo "If nginx config was updated, run: docker exec <your-nginx-container> nginx -s reload"
