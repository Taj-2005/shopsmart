#!/bin/bash

INSTANCE_ID="i-06b43824c754cfe4d"

SYSTEM_STATUS=$(aws ec2 describe-instance-status \
  --instance-ids "$INSTANCE_ID" \
  --query "InstanceStatuses[].SystemStatus.Status" \
  --output text)

INSTANCE_STATUS=$(aws ec2 describe-instance-status \
  --instance-ids "$INSTANCE_ID" \
  --query "InstanceStatuses[].InstanceStatus.Status" \
  --output text)

SYSTEM_STATUS=${SYSTEM_STATUS:-not-available}
INSTANCE_STATUS=${INSTANCE_STATUS:-not-available}

echo "----------------------------------------"
printf "| %-16s | %-15s |\n" "Check" "Status"
echo "----------------------------------------"
printf "| %-16s | %-15s |\n" "System Status" "$SYSTEM_STATUS"
printf "| %-16s | %-15s |\n" "Instance Status" "$INSTANCE_STATUS"
echo "----------------------------------------"

if [[ "$SYSTEM_STATUS" == "ok" && "$INSTANCE_STATUS" == "ok" ]]; then
  echo "[OK] System Healthy ✅"
else
  echo "[ALERT] Check System! 🚨"
fi

