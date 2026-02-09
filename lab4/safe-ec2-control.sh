#!/bin/bash

INSTANCE_ID="i-06b43824c754cfe4d"
ACTION=$1

CURRENT_STATE=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[].Instances[].State.Name" \
  --output text)

echo "[INFO] Current State: $CURRENT_STATE"

if [[ "$ACTION" == "start" ]]; then
  if [[ "$CURRENT_STATE" == "running" ]]; then
    echo "[SKIP] Instance is already running."
  else
    echo "[INFO] Starting instance $INSTANCE_ID..."
    aws ec2 start-instances --instance-ids "$INSTANCE_ID"
  fi

elif [[ "$ACTION" == "stop" ]]; then
  if [[ "$CURRENT_STATE" == "stopped" ]]; then
    echo "[SKIP] Instance is already stopped."
  else
    echo "[INFO] Stopping instance $INSTANCE_ID..."
    aws ec2 stop-instances --instance-ids "$INSTANCE_ID"
  fi

else
  echo "[ERROR] Invalid action. Use: start | stop"
  exit 1
fi
