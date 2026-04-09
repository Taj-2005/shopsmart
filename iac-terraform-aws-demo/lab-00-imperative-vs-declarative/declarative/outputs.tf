output "table_arn" {
  description = "The ARN of the DynamoDB table created by Terraform."
  value       = aws_dynamodb_table.shopsmart_products.arn
}

output "table_name" {
  description = "The name of the DynamoDB table created by Terraform."
  value       = aws_dynamodb_table.shopsmart_products.name
}
