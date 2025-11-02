# Generate random suffix for storage account to ensure uniqueness
resource "random_integer" "storage_suffix" {
  count = var.create_storage_account ? 1 : 0
  min   = 100
  max   = 999
}

# Azure Storage Account
resource "azurerm_storage_account" "main" {
  count                    = var.create_storage_account ? 1 : 0
  name                     = var.storage_account_name != null ? var.storage_account_name : "st-${var.application_name}-${var.environment}${random_integer.storage_suffix[0].result}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = coalesce(var.storage_account_tier, "Standard")
  account_replication_type = coalesce(var.storage_replication_type, "LRS")

  # Security settings
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = true

  # Enable versioning and soft delete
  blob_properties {
    versioning_enabled  = true
    change_feed_enabled = true

    delete_retention_policy {
      days = local.current_env_config.retention_days
    }

    container_delete_retention_policy {
      days = local.current_env_config.retention_days
    }
  }

  # Network access rules
  dynamic "network_rules" {
    for_each = var.enable_public_access ? [] : [1]
    content {
      default_action             = "Deny"
      ip_rules                   = var.allowed_ip_ranges
      virtual_network_subnet_ids = []
      bypass                     = ["AzureServices"]
    }
  }

  tags = local.resource_specific_tags.storage_account

  lifecycle {
    prevent_destroy = true
  }
}

# Storage containers for different purposes
resource "azurerm_storage_container" "containers" {
  count                 = var.create_storage_account ? length(local.storage_containers) : 0
  name                  = var.storage_container_name != null ? var.storage_container_name : local.storage_containers[count.index].name
  storage_account_id    = azurerm_storage_account.main[0].id
  container_access_type = local.storage_containers[count.index].access_type
}

# Storage table for terraform state locking (when using Azure backend)
resource "azurerm_storage_table" "terraform_locks" {
  count                = var.create_storage_account ? 1 : 0
  name                 = var.storage_table_name != null ? var.storage_table_name : "terraformstatelock"
  storage_account_name = azurerm_storage_account.main[0].name
}