#!/usr/bin/env bash
# Production start script for Render
# Render sets PORT env var automatically

set -e

cd "$(dirname "$0")/.."

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
