# Azure Key Vault
resource "azurerm_key_vault" "main" {
  count               = var.create_key_vault ? 1 : 0
  name                = var.key_vault_name != null ? var.key_vault_name : local.resource_names.key_vault
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = coalesce(var.key_vault_sku, local.current_env_config.key_vault_sku)

  # Security and compliance settings
  enabled_for_disk_encryption     = var.key_vault_enabled_for_disk_encryption
  enabled_for_deployment          = var.key_vault_enabled_for_deployment
  enabled_for_template_deployment = var.key_vault_enabled_for_template_deployment
  purge_protection_enabled        = coalesce(var.key_vault_purge_protection_enabled, local.current_env_config.purge_protection)
  soft_delete_retention_days      = var.key_vault_soft_delete_retention_days

  # Network access configuration - Always enforce network ACLs for security
  network_acls {
    default_action             = "Deny" # Always deny by default for security
    bypass                     = "AzureServices"
    ip_rules                   = var.allowed_ip_ranges
    virtual_network_subnet_ids = var.key_vault_subnet_ids
  }

  tags = local.resource_specific_tags.key_vault

  lifecycle {
    prevent_destroy = true
  }
}

# Access policy for the current user/service principal running Terraform
resource "azurerm_key_vault_access_policy" "terraform" {
  count        = var.create_key_vault ? 1 : 0
  key_vault_id = azurerm_key_vault.main[0].id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  key_permissions = [
    "Get", "List", "Update", "Create", "Import", "Delete", "Recover",
    "Backup", "Restore", "Decrypt", "Encrypt", "UnwrapKey", "WrapKey",
    "Verify", "Sign", "Purge"
  ]

  secret_permissions = [
    "Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"
  ]

  certificate_permissions = [
    "Get", "List", "Update", "Create", "Import", "Delete", "Recover",
    "Backup", "Restore", "ManageContacts", "ManageIssuers", "GetIssuers",
    "ListIssuers", "SetIssuers", "DeleteIssuers", "Purge"
  ]
}

# Access policies for additional users/service principals
resource "azurerm_key_vault_access_policy" "additional" {
  count        = var.create_key_vault ? length(local.all_access_policies) : 0
  key_vault_id = azurerm_key_vault.main[0].id
  tenant_id    = local.all_access_policies[count.index].tenant_id
  object_id    = local.all_access_policies[count.index].object_id

  key_permissions         = local.all_access_policies[count.index].key_permissions
  secret_permissions      = local.all_access_policies[count.index].secret_permissions
  certificate_permissions = local.all_access_policies[count.index].certificate_permissions
}

# Diagnostic settings for Key Vault (optional)
resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  count              = var.create_key_vault && var.create_storage_account ? 1 : 0
  name               = "diag-${local.resource_names.key_vault}"
  target_resource_id = azurerm_key_vault.main[0].id
  storage_account_id = var.create_storage_account ? azurerm_storage_account.main[0].id : null

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}