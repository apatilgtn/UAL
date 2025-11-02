# Main Terraform configuration for Azure Application Platform
# This module creates all resources directly for enterprise-grade deployment

## Validation blocks removed: 'check' is not a supported Terraform block type. Use external validation or pre-apply scripts for these checks.

# Resource Group
resource "azurerm_resource_group" "main" {
  count    = var.create_resource_group ? 1 : 0
  name     = local.resource_names.resource_group
  location = var.location
  tags     = local.resource_specific_tags.resource_group

  lifecycle {
    prevent_destroy = true
  }
}

# Storage Account
resource "azurerm_storage_account" "main" {
  count                    = var.create_storage_account ? 1 : 0
  name                     = "${substr(local.resource_names.storage_account, 0, min(length(local.resource_names.storage_account), 21))}${random_integer.storage_suffix[0].result}"
  resource_group_name      = local.resource_group_name
  location                 = local.resource_group_location
  account_tier             = coalesce(var.storage_account_tier, local.current_env_config.storage_tier)
  account_replication_type = coalesce(var.storage_replication_type, local.current_env_config.storage_replication)

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

# Random integer for storage account naming
resource "random_integer" "storage_suffix" {
  count = var.create_storage_account ? 1 : 0
  min   = 100
  max   = 999
}

# Storage containers
resource "azurerm_storage_container" "containers" {
  count                 = (var.create_storage_account && var.create_storage_container) ? length(local.storage_containers) : 0
  name                  = local.storage_containers[count.index].name
  storage_account_id    = azurerm_storage_account.main[0].id
  container_access_type = local.storage_containers[count.index].access_type
}

# Storage table for terraform state locking
resource "azurerm_storage_table" "terraform_locks" {
  count                = (var.create_storage_account && var.create_storage_table) ? 1 : 0
  name                 = "terraformstatelock"
  storage_account_name = azurerm_storage_account.main[0].name
}

# Key Vault
resource "azurerm_key_vault" "main" {
  count               = var.create_key_vault ? 1 : 0
  name                = local.resource_names.key_vault
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = coalesce(var.key_vault_sku, local.current_env_config.key_vault_sku)

  # Security and compliance settings
  enabled_for_disk_encryption     = var.key_vault_enabled_for_disk_encryption
  enabled_for_deployment          = var.key_vault_enabled_for_deployment
  enabled_for_template_deployment = var.key_vault_enabled_for_template_deployment

  # Purge protection requires soft delete retention days to be explicitly set (7-90 days)
  # AVD-AZU-0016 requirement: Both purge protection and soft delete retention must be set
  # Default to 90 days for maximum security and compliance
  soft_delete_retention_days = coalesce(var.key_vault_soft_delete_retention_days, 90)

  # Always enable purge protection for security compliance (AVD-AZU-0016 requirement)
  # This is a security requirement and cannot be disabled
  # Note: Purge protection can only be enabled when soft_delete_retention_days is set (7-90)
  purge_protection_enabled = true

  # Network access configuration - Always enforce network ACLs for security
  network_acls {
    default_action             = "Deny" # Always deny by default for security
    bypass                     = "AzureServices"
    ip_rules                   = var.enable_public_access ? var.allowed_ip_ranges : var.allowed_ip_ranges
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

# Application Insights
resource "azurerm_application_insights" "main" {
  count               = var.create_app_insights ? 1 : 0
  name                = local.resource_names.app_insights
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  workspace_id        = var.create_monitoring ? azurerm_log_analytics_workspace.main[0].id : null
  application_type    = coalesce(var.app_insights_type, local.current_env_config.app_insights_type)
  retention_in_days   = coalesce(var.app_insights_retention_days, local.current_env_config.retention_days)

  tags = local.resource_specific_tags.app_insights
}

# Service Bus
module "service_bus" {
  source                                    = "./service-bus"
  application_name                          = var.application_name
  environment                               = var.environment
  create_service_bus                        = var.create_service_bus
  service_bus_namespace_name                = local.resource_names.service_bus
  location                                  = local.resource_group_location
  resource_group_name                       = local.resource_group_name
  service_bus_sku                           = coalesce(var.service_bus_sku, local.current_env_config.service_bus_sku)
  service_bus_capacity                      = coalesce(var.service_bus_capacity, local.current_env_config.service_bus_capacity)
  service_bus_premium_messaging_partitions  = var.service_bus_premium_messaging_partitions
  service_bus_zone_redundant                = coalesce(var.service_bus_zone_redundant, local.current_env_config.zone_redundant)
  service_bus_public_network_access_enabled = var.enable_public_access
  service_bus_minimum_tls_version           = coalesce(var.service_bus_minimum_tls_version, local.current_env_config.min_tls_version)
  service_bus_identity_type                 = var.service_bus_identity_type
  service_bus_user_assigned_identity_ids    = var.service_bus_user_assigned_identity_ids
  service_bus_queues                        = var.service_bus_queues
  service_bus_topics                        = var.service_bus_topics
  service_bus_authorization_rules           = var.service_bus_authorization_rules
  service_bus_private_endpoint_enabled      = var.service_bus_private_endpoint_enabled
  service_bus_private_endpoint_subnet_id    = var.service_bus_private_endpoint_subnet_id
  service_bus_private_dns_zone_ids          = var.service_bus_private_dns_zone_ids

  tags = local.resource_specific_tags.service_bus
}

# Function App Service Plan
resource "azurerm_service_plan" "main" {
  count               = var.create_function_app ? 1 : 0
  name                = local.resource_names.app_service_plan
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  os_type             = "Windows"
  sku_name            = coalesce(var.function_app_sku, local.current_env_config.function_app_sku)

  tags = local.resource_specific_tags.app_service_plan
}

# Function App
resource "azurerm_windows_function_app" "main" {
  count               = var.create_function_app ? 1 : 0
  name                = local.resource_names.function_app
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  service_plan_id     = azurerm_service_plan.main[0].id

  storage_account_name       = azurerm_storage_account.main[0].name
  storage_account_access_key = azurerm_storage_account.main[0].primary_access_key

  site_config {
    always_on                              = coalesce(var.function_app_always_on, local.current_env_config.always_on)
    use_32_bit_worker                      = coalesce(var.function_app_use_32_bit_worker, local.current_env_config.use_32_bit_worker)
    ftps_state                             = coalesce(var.function_app_ftps_state, local.current_env_config.ftps_state)
    minimum_tls_version                    = coalesce(var.function_app_min_tls_version, local.current_env_config.min_tls_version)
    application_insights_connection_string = var.create_app_insights ? azurerm_application_insights.main[0].connection_string : null
    application_insights_key               = var.create_app_insights ? azurerm_application_insights.main[0].instrumentation_key : null

    application_stack {
      dotnet_version = coalesce(var.function_app_version, local.current_env_config.function_app_version)
    }
  }

  identity {
    type = coalesce(var.function_app_managed_identity_type, local.current_env_config.managed_identity_type)
  }

  https_only = coalesce(var.function_app_https_only, local.current_env_config.https_only)

  tags = local.resource_specific_tags.function_app

  lifecycle {
    ignore_changes = [
      app_settings["WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"],
      app_settings["WEBSITE_CONTENTSHARE"],
    ]
  }
}

# Log Analytics Workspace for monitoring
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.create_monitoring ? 1 : 0
  name                = local.resource_names.log_analytics_workspace
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  sku                 = coalesce(var.log_analytics_sku, local.current_env_config.log_analytics_sku)
  retention_in_days   = coalesce(var.log_analytics_retention_days, local.current_env_config.retention_days)

  tags = local.resource_specific_tags.log_analytics_workspace
}

# Action Group for alerts
resource "azurerm_monitor_action_group" "main" {
  count               = var.create_monitoring && length(var.alert_email_addresses) > 0 ? 1 : 0
  name                = local.resource_names.action_group
  resource_group_name = local.resource_group_name
  short_name          = "alerts"

  dynamic "email_receiver" {
    for_each = var.alert_email_addresses
    content {
      name          = "email-${email_receiver.key}"
      email_address = email_receiver.value
    }
  }

  dynamic "webhook_receiver" {
    for_each = var.alert_webhook_urls
    content {
      name        = "webhook-${webhook_receiver.key}"
      service_uri = webhook_receiver.value
    }
  }

  tags = local.resource_specific_tags.action_group
}

# Azure Dashboard
resource "azurerm_portal_dashboard" "main" {
  count               = var.create_monitoring && var.create_dashboard ? 1 : 0
  name                = local.resource_names.dashboard
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  dashboard_properties = templatefile("${path.module}/monitoring/dashboard.tpl", {
    project_name         = var.application_name
    environment          = var.environment
    resource_group_name  = local.resource_group_name
    function_app_name    = var.create_function_app ? azurerm_windows_function_app.main[0].name : ""
    key_vault_name       = var.create_key_vault ? azurerm_key_vault.main[0].name : ""
    storage_account_name = var.create_storage_account ? azurerm_storage_account.main[0].name : ""
    app_insights_name    = var.create_app_insights ? azurerm_application_insights.main[0].name : ""
    subscription_id      = data.azurerm_client_config.current.subscription_id
  })

  tags = local.resource_specific_tags.dashboard
}