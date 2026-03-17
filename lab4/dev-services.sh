#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_DIR="$SCRIPT_DIR/../shopsmart/server"
FRONTEND_DIR="$SCRIPT_DIR/../shopsmart/client"

BACKEND_PID_FILE="$SCRIPT_DIR/backend.pid"
FRONTEND_PID_FILE="$SCRIPT_DIR/frontend.pid"

check_health() {
  for _attempt in {1..5}; do
    if curl -f -s "http://localhost:4000/health" >/dev/null 2>&1; then
      echo "[OK] Backend is Up!"
      return 0
    fi

    # ShopSmart mounts routes under /api, so /api/health is the real endpoint here.
    if curl -f -s "http://localhost:4000/api/health" >/dev/null 2>&1; then
      echo "[OK] Backend is Up!"
      return 0
    fi

    sleep 2
  done

  echo "[FAIL] Backend died"
  return 1
}

is_pid_alive() {
  local pid="$1"
  kill -0 "$pid" >/dev/null 2>&1
}

start_services() {
  if [ -f "$BACKEND_PID_FILE" ] || [ -f "$FRONTEND_PID_FILE" ]; then
    echo "[ERROR] PID file(s) already exist. Run: $0 stop"
    exit 1
  fi

  if [ ! -d "$BACKEND_DIR" ]; then
    echo "[ERROR] Backend folder not found: $BACKEND_DIR"
    exit 1
  fi
  if [ ! -d "$FRONTEND_DIR" ]; then
    echo "[ERROR] Frontend folder not found: $FRONTEND_DIR"
    exit 1
  fi

  echo "[INFO] Starting backend..."
  (cd "$BACKEND_DIR" && npm run dev) &
  BACKEND_PID=$!
  echo "$BACKEND_PID" > "$BACKEND_PID_FILE"

  if ! check_health; then
    "$0" stop || true
    exit 1
  fi

  echo "[INFO] Starting frontend..."
  (cd "$FRONTEND_DIR" && npm run dev) &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > "$FRONTEND_PID_FILE"

  sleep 1
  if ! is_pid_alive "$FRONTEND_PID"; then
    echo "[FAIL] Frontend died"
    "$0" stop || true
    exit 1
  fi

  echo "[INFO] Services started. Backend PID: $BACKEND_PID. Frontend PID: $FRONTEND_PID."
}

stop_services() {
  if [ -f "$BACKEND_PID_FILE" ]; then
    TARGET_PID="$(cat "$BACKEND_PID_FILE")"
    echo "[INFO] Stopping backend (PID $TARGET_PID)..."
    kill "$TARGET_PID" 2>/dev/null || true
    rm -f "$BACKEND_PID_FILE"
  else
    echo "[INFO] backend.pid not found. Skipping backend stop."
  fi

  if [ -f "$FRONTEND_PID_FILE" ]; then
    TARGET_PID="$(cat "$FRONTEND_PID_FILE")"
    echo "[INFO] Stopping frontend (PID $TARGET_PID)..."
    kill "$TARGET_PID" 2>/dev/null || true
    rm -f "$FRONTEND_PID_FILE"
  else
    echo "[INFO] frontend.pid not found. Skipping frontend stop."
  fi

  echo "[INFO] Services stopped."
}

usage() {
  echo "Usage: $0 {start|stop}"
}

case "${1:-}" in
  start) start_services ;;
  stop) stop_services ;;
  *) usage; exit 1 ;;
esac

