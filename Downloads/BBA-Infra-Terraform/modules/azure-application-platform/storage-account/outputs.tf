output "storage_account_name" {
  description = "Name of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].name : null
}

output "storage_account_id" {
  description = "ID of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].id : null
}

output "primary_blob_endpoint" {
  description = "Primary blob endpoint of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].primary_blob_endpoint : null
}

output "primary_connection_string" {
  description = "Primary connection string of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].primary_connection_string : null
  sensitive   = true
}

output "primary_access_key" {
  description = "Primary access key of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].primary_access_key : null
  sensitive   = true
}

output "containers" {
  description = "List of created storage containers"
  value = var.create_storage_account ? {
    for container in azurerm_storage_container.containers :
    container.name => {
      name        = container.name
      access_type = container.container_access_type
    }
  } : {}
}

output "terraform_state_container_name" {
  description = "Name of the terraform state container"
  value       = var.create_storage_account ? "terraform-state" : null
}

output "terraform_state_key" {
  description = "Recommended key for terraform state file"
  value       = "${var.application_name}/${var.environment}/terraform.tfstate"
}