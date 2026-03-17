#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node is not installed (or not on PATH)."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm is not installed (or not on PATH)."
  exit 1
fi

PROJECTS=(
  "$SCRIPT_DIR/../shopsmart/server"
  "$SCRIPT_DIR/../shopsmart/client"
)

for dir in "${PROJECTS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "[ERROR] Expected folder not found: $dir"
    exit 1
  fi

  echo "[INFO] Checking dependencies in $dir"
  if [ -d "$dir/node_modules" ]; then
    echo "[INFO] Skipping install (node_modules already exists)."
  else
    echo "[INFO] Installing dependencies..."
    (cd "$dir" && npm install)
  fi
done

echo "[INFO] dev-setup complete."
