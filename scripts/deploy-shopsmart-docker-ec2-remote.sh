#!/usr/bin/env bash
# Run on EC2 via: ssh ... 'env exports... bash -s' < this-file
set -euo pipefail

CONTAINER_NAME="shopsmart-api-docker"
IMAGE="${IMAGE:?Set IMAGE (docker image ref)}"
HOST_PORT="${HOST_PORT:?Set HOST_PORT}"

if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y docker.io
  sudo systemctl enable --now docker
fi

if [[ -f /tmp/dhub_pass ]]; then
  chmod 600 /tmp/dhub_pass
  : "${DOCKERHUB_USERNAME:?Set DOCKERHUB_USERNAME when using /tmp/dhub_pass}"
  sudo docker login -u "$DOCKERHUB_USERNAME" --password-stdin < /tmp/dhub_pass
  rm -f /tmp/dhub_pass
fi

sudo install -m 600 /tmp/shopsmart-server.env /opt/shopsmart-server.env

if sudo docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  sudo docker rm -f "$CONTAINER_NAME" || true
fi

if command -v pm2 >/dev/null 2>&1; then
  pm2 stop shopsmart-api 2>/dev/null || true
fi

sudo docker pull "$IMAGE"
sudo docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "${HOST_PORT}:4000" \
  --env-file /opt/shopsmart-server.env \
  "$IMAGE"

echo "[OK] Running ${IMAGE} on host port ${HOST_PORT} -> container 4000"
rm -f /tmp/dhub_pass
