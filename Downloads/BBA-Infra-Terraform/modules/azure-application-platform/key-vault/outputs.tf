output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = var.create_key_vault ? azurerm_key_vault.main[0].name : null
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = var.create_key_vault ? azurerm_key_vault.main[0].id : null
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = var.create_key_vault ? azurerm_key_vault.main[0].vault_uri : null
}

output "key_vault_tenant_id" {
  description = "Tenant ID of the Key Vault"
  value       = var.create_key_vault ? azurerm_key_vault.main[0].tenant_id : null
}