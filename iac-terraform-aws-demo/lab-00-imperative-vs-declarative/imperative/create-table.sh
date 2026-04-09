#!/usr/bin/env bash
# =============================================================================
# IMPERATIVE DynamoDB Table Creation Script
#
# This script is IMPERATIVE -- we are giving the computer step-by-step orders:
#   1. Set a table name
#   2. Call the AWS API to create it
#
# Notice: there is NO state tracking. If the table already exists this script
# will fail on the second run. That is intentional -- it demonstrates why
# imperative infrastructure management breaks down at scale.
# =============================================================================

# ---------------------------------------------------------------------------
# Step 1: Define the table name.
# STUDENTS: Replace the value below with a unique table name.
# Example: shopsmart-products-lab00-jd-8294
# ---------------------------------------------------------------------------
TABLE_NAME="shopsmart-products-lab00-monapril6-2026"

# ---------------------------------------------------------------------------
# Step 2: Set the AWS region.
# ---------------------------------------------------------------------------
REGION="us-east-1"

# ---------------------------------------------------------------------------
# Step 3: Create the DynamoDB table.
# This is a direct, imperative command: "AWS, create this table NOW."
# It does not check whether the table already exists.
# Run it once  -> SUCCESS
# Run it twice -> FAILS with ResourceInUseException
# ---------------------------------------------------------------------------
echo "Creating DynamoDB table: ${TABLE_NAME} in region ${REGION}..."

aws dynamodb create-table \
  --table-name "${TABLE_NAME}" \
  --attribute-definitions AttributeName=ProductId,AttributeType=S \
  --key-schema AttributeName=ProductId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${REGION}"

# ---------------------------------------------------------------------------
# Step 4: Print the result.
# ---------------------------------------------------------------------------
if [ $? -eq 0 ]; then
  echo "SUCCESS: Table '${TABLE_NAME}' created."
else
  echo "ERROR: Failed to create table '${TABLE_NAME}'."
  echo "If the table already exists, this script has no way to handle that."
  echo "This is the problem with imperative scripts -- no idempotency."
  exit 1
fi
