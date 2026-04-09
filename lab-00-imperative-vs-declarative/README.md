# Lab 00: Imperative vs Declarative -- Why Declarative Wins

## Learning Objective

By the end of this lab you will understand the difference between **imperative** and **declarative** infrastructure management, and you will experience first-hand why **idempotency** is the property that makes declarative tools like Terraform indispensable.

---

## The Analogy: Taxi vs Turn-by-Turn Directions

Imagine you need to get across town.

| Approach | What You Say | Infrastructure Equivalent |
|---|---|---|
| **Imperative** (turn-by-turn directions) | "Turn left on Main St, go two blocks, turn right on Oak Ave, merge onto the highway at exit 12..." | A bash script that issues every AWS CLI command in order. **You** are responsible for every step, every edge case, and every error. |
| **Declarative** (tell the driver the destination) | "Take me to 42 Oak Avenue." | A Terraform config that describes the desired end state. **Terraform** figures out the steps. |

The taxi driver (Terraform) already knows how to handle one-way streets, traffic, and road closures. You just declare *where* you want to be.

---

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity` should return your account)
- Terraform >= 1.0 installed (`terraform -version`)

---

## Exercises

### Exercise 1 -- Run the Imperative Script (First Run)

1. Open `imperative/create-table.sh` and set the `TABLE_NAME` variable to a unique name, for example `shopsmart-products-lab00-<your-initials>-<random>`.
2. Make the script executable and run it:

   ```bash
   chmod +x imperative/create-table.sh
   ./imperative/create-table.sh
   ```

3. Observe the output -- the DynamoDB table is created successfully.

### Exercise 2 -- Run the Imperative Script Again (Second Run)

1. Run the exact same script a second time:

   ```bash
   ./imperative/create-table.sh
   ```

2. Observe the **error** (`ResourceInUseException`): the table already exists. The script has no idea what state the world is in; it blindly tries to create the table again and fails.

   > This is the fundamental problem with imperative scripts -- they do not track state.

### Exercise 3 -- Run the Declarative Terraform Config (First Run)

1. Open `declarative/variables.tf` and change the default for `table_name` to the **same** table name you used above (or a new unique one).
2. Initialize and apply:

   ```bash
   cd declarative
   terraform init
   terraform apply
   ```

3. Type `yes` when prompted. Observe the output -- Terraform creates the table.

### Exercise 4 -- Run Terraform Apply Again (Second Run)

1. Without changing anything, run apply a second time:

   ```bash
   terraform apply
   ```

2. Observe the output:

   ```
   No changes. Your infrastructure matches the configuration.
   ```

   **This is idempotency.** Terraform compared the desired state (your `.tf` files) with the actual state (the real table in AWS tracked in `terraform.tfstate`) and determined that nothing needs to change. No error, no duplicate, no problem.

### Exercise 5 -- Break It: Scale to 5 Tables

**Imperative attempt:**

1. Edit `imperative/create-table.sh` to create 5 tables in a loop:

   ```bash
   for i in 1 2 3 4 5; do
     aws dynamodb create-table \
       --table-name "${TABLE_NAME}-${i}" \
       --attribute-definitions AttributeName=ProductId,AttributeType=S \
       --key-schema AttributeName=ProductId,KeyType=HASH \
       --billing-mode PAY_PER_REQUEST
   done
   ```

2. Run it once -- 5 tables are created (5 API calls).
3. Run it again -- 5 API calls are made, and all 5 **fail** with `ResourceInUseException` because the tables already exist. That is 10 total API calls for 5 tables, with errors on half of them.

**Declarative attempt:**

1. Edit `declarative/main.tf` and add `count = 5` to the resource, updating the table name to include the index:

   ```hcl
   resource "aws_dynamodb_table" "shopsmart_products" {
     count        = 5
     name         = "${var.table_name}-${count.index}"
     billing_mode = "PAY_PER_REQUEST"
     hash_key     = "ProductId"

     attribute {
       name = "ProductId"
       type = "S"
     }
   }
   ```

2. Run `terraform apply` -- Terraform creates 5 tables.
3. Run `terraform apply` again -- output says **"No changes."** Terraform only does work when reality differs from your declared intent.

---

## Key Takeaway

> **Imperative** = "Here are the exact steps to execute."
> Fragile, not idempotent, and increasingly complex as infrastructure grows.
>
> **Declarative** = "Here is what I want the end state to look like."
> Idempotent, self-healing, and scales gracefully.
>
> Terraform is declarative. That is why we use it.

---

## Cleanup

Remove everything you created so you are not charged for leftover resources.

**Terraform resources:**

```bash
cd declarative
terraform destroy
```

Type `yes` when prompted.

**Imperative resources (if any tables remain):**

```bash
# Delete a single table created by the bash script
aws dynamodb delete-table --table-name YOUR-TABLE-NAME

# Or if you created the 5 tables in Exercise 5
for i in 1 2 3 4 5; do
  aws dynamodb delete-table --table-name "YOUR-TABLE-NAME-${i}"
done
```

---

Next up: [Lab 01 -- Your First Terraform Config](../lab-01-first-config/)
