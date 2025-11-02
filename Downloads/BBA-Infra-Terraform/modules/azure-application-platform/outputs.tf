# Resource Group Outputs
output "resource_group_name" {
  description = "Name of the resource group"
  value       = var.create_resource_group ? azurerm_resource_group.main[0].name : var.resource_group_name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = var.create_resource_group ? azurerm_resource_group.main[0].location : var.location
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = var.create_resource_group ? azurerm_resource_group.main[0].id : data.azurerm_resource_group.existing[0].id
}

# Storage Account Outputs
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

output "storage_account_primary_connection_string" {
  description = "Primary connection string of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].primary_connection_string : null
  sensitive   = true
}

output "storage_account_primary_access_key" {
  description = "Primary access key of the storage account"
  value       = var.create_storage_account ? azurerm_storage_account.main[0].primary_access_key : null
  sensitive   = true
}

# Key Vault Outputs
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

# Function App Outputs
output "function_app_name" {
  description = "Name of the Function App"
  value       = var.create_function_app ? azurerm_windows_function_app.main[0].name : null
}

output "function_app_id" {
  description = "ID of the Function App"
  value       = var.create_function_app ? azurerm_windows_function_app.main[0].id : null
}

output "function_app_default_hostname" {
  description = "Default hostname of the Function App"
  value       = var.create_function_app ? azurerm_windows_function_app.main[0].default_hostname : null
}

output "function_app_principal_id" {
  description = "Principal ID of the Function App's managed identity"
  value       = var.create_function_app ? azurerm_windows_function_app.main[0].identity[0].principal_id : null
}

output "app_service_plan_id" {
  description = "ID of the App Service Plan"
  value       = var.create_function_app ? azurerm_service_plan.main[0].id : null
}

output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = var.create_function_app ? azurerm_service_plan.main[0].name : null
}

# Application Insights Outputs
output "app_insights_name" {
  description = "Name of the Application Insights"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].name : null
}

output "app_insights_id" {
  description = "ID of the Application Insights"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].id : null
}

output "app_insights_instrumentation_key" {
  description = "Instrumentation key of the Application Insights"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].instrumentation_key : null
  sensitive   = true
}

output "app_insights_connection_string" {
  description = "Connection string of the Application Insights"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].connection_string : null
  sensitive   = true
}

# Monitoring Outputs
output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = var.create_monitoring ? azurerm_log_analytics_workspace.main[0].id : null
}

output "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  value       = var.create_monitoring ? azurerm_log_analytics_workspace.main[0].name : null
}

output "action_group_id" {
  description = "ID of the Action Group"
  value       = var.create_monitoring && length(var.alert_email_addresses) > 0 ? azurerm_monitor_action_group.main[0].id : null
}

output "dashboard_id" {
  description = "ID of the Azure Dashboard"
  value       = var.create_monitoring && var.create_dashboard ? azurerm_portal_dashboard.main[0].id : null
}

# Terraform Backend Configuration
output "terraform_backend_config" {
  description = "Terraform backend configuration for state management"
  value = var.create_storage_account ? {
    storage_account_name = azurerm_storage_account.main[0].name
    container_name       = "terraform-state"
    key                  = "${var.application_name}-${var.environment}.tfstate"
    resource_group_name  = var.create_resource_group ? azurerm_resource_group.main[0].name : var.resource_group_name
  } : null
}

# Service Bus Outputs
output "service_bus_namespace_id" {
  description = "ID of the Service Bus namespace"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_id : null
}

output "service_bus_namespace_name" {
  description = "Name of the Service Bus namespace"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_name : null
}

output "service_bus_namespace_endpoint" {
  description = "Endpoint of the Service Bus namespace"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_endpoint : null
}

output "service_bus_namespace_primary_connection_string" {
  description = "Primary connection string for the Service Bus namespace"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_primary_connection_string : null
  sensitive   = true
}

output "service_bus_namespace_secondary_connection_string" {
  description = "Secondary connection string for the Service Bus namespace"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_secondary_connection_string : null
  sensitive   = true
}

output "service_bus_queues" {
  description = "Map of Service Bus queues"
  value       = var.create_service_bus ? module.service_bus.service_bus_queues : {}
}

output "service_bus_topics" {
  description = "Map of Service Bus topics"
  value       = var.create_service_bus ? module.service_bus.service_bus_topics : {}
}

output "service_bus_subscriptions" {
  description = "Map of Service Bus topic subscriptions"
  value       = var.create_service_bus ? module.service_bus.service_bus_subscriptions : {}
}

output "service_bus_namespace_authorization_rules" {
  description = "Map of Service Bus namespace authorization rules"
  value       = var.create_service_bus ? module.service_bus.service_bus_namespace_authorization_rules : {}
  sensitive   = true
}

output "service_bus_queue_authorization_rules" {
  description = "Map of Service Bus queue authorization rules"
  value       = var.create_service_bus ? module.service_bus.service_bus_queue_authorization_rules : {}
  sensitive   = true
}

output "service_bus_topic_authorization_rules" {
  description = "Map of Service Bus topic authorization rules"
  value       = var.create_service_bus ? module.service_bus.service_bus_topic_authorization_rules : {}
  sensitive   = true
}