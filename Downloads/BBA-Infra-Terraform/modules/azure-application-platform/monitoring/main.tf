# Azure Monitor and Alerting Module
# This module creates comprehensive monitoring, alerting, and diagnostic settings

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.create_monitoring ? 1 : 0
  name                = local.resource_names.log_analytics
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  sku                 = var.log_analytics_sku
  retention_in_days   = var.log_analytics_retention_days

  tags = local.resource_specific_tags.log_analytics

  lifecycle {
    prevent_destroy = true
  }
}

# Action Group for Alerts
resource "azurerm_monitor_action_group" "main" {
  count               = var.create_monitoring ? 1 : 0
  name                = "ag-${local.resource_names.function_app}"
  resource_group_name = local.resource_group_name
  short_name          = "loanapp"

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

  tags = local.resource_specific_tags.monitoring
}

# Function App Availability Alert
resource "azurerm_monitor_metric_alert" "function_app_availability" {
  count               = var.create_monitoring && var.create_function_app ? 1 : 0
  name                = "alert-${local.resource_names.function_app}-availability"
  resource_group_name = local.resource_group_name
  scopes              = [var.function_app_id]
  description         = "Function App availability is below threshold"
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "Availability"
    aggregation      = "Average"
    operator         = "LessThan"
    threshold        = 95
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.resource_specific_tags.monitoring
}

# Function App Response Time Alert
resource "azurerm_monitor_metric_alert" "function_app_response_time" {
  count               = var.create_monitoring && var.create_function_app ? 1 : 0
  name                = "alert-${local.resource_names.function_app}-response-time"
  resource_group_name = local.resource_group_name
  scopes              = [var.function_app_id]
  description         = "Function App response time is above threshold"
  severity            = 2
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "AverageResponseTime"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 5000
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.resource_specific_tags.monitoring
}

# Function App Error Rate Alert
resource "azurerm_monitor_metric_alert" "function_app_error_rate" {
  count               = var.create_monitoring && var.create_function_app ? 1 : 0
  name                = "alert-${local.resource_names.function_app}-error-rate"
  resource_group_name = local.resource_group_name
  scopes              = [var.function_app_id]
  description         = "Function App error rate is above threshold"
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "Http5xx"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = 10
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.resource_specific_tags.monitoring
}

# Storage Account Capacity Alert
resource "azurerm_monitor_metric_alert" "storage_capacity" {
  count               = var.create_monitoring && var.create_storage_account ? 1 : 0
  name                = "alert-${local.resource_names.storage_account}-capacity"
  resource_group_name = local.resource_group_name
  scopes              = [var.storage_account_id]
  description         = "Storage account capacity is above threshold"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"

  criteria {
    metric_namespace = "Microsoft.Storage/storageAccounts"
    metric_name      = "UsedCapacity"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.resource_specific_tags.monitoring
}

# Key Vault Access Alert
resource "azurerm_monitor_metric_alert" "key_vault_access" {
  count               = var.create_monitoring && var.create_key_vault ? 1 : 0
  name                = "alert-${local.resource_names.key_vault}-access"
  resource_group_name = local.resource_group_name
  scopes              = [var.key_vault_id]
  description         = "Key Vault access attempts are above threshold"
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"

  criteria {
    metric_namespace = "Microsoft.KeyVault/vaults"
    metric_name      = "ServiceApiHit"
    aggregation      = "Count"
    operator         = "GreaterThan"
    threshold        = 100
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.resource_specific_tags.monitoring
}

# Diagnostic Settings for Function App
resource "azurerm_monitor_diagnostic_setting" "function_app" {
  count                      = var.create_monitoring && var.create_function_app ? 1 : 0
  name                       = "diag-${local.resource_names.function_app}"
  target_resource_id         = var.function_app_id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main[0].id

  enabled_log {
    category = "FunctionAppLogs"
  }

  enabled_log {
    category = "AppServiceHTTPLogs"
  }

  enabled_log {
    category = "AppServiceConsoleLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# Diagnostic Settings for Storage Account
resource "azurerm_monitor_diagnostic_setting" "storage_account" {
  count                      = var.create_monitoring && var.create_storage_account ? 1 : 0
  name                       = "diag-${local.resource_names.storage_account}"
  target_resource_id         = var.storage_account_id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main[0].id

  enabled_log {
    category = "StorageRead"
  }

  enabled_log {
    category = "StorageWrite"
  }

  enabled_log {
    category = "StorageDelete"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# Diagnostic Settings for Key Vault
resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  count                      = var.create_monitoring && var.create_key_vault ? 1 : 0
  name                       = "diag-${local.resource_names.key_vault}"
  target_resource_id         = var.key_vault_id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main[0].id

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# Application Insights Dashboard
resource "azurerm_portal_dashboard" "main" {
  count               = var.create_monitoring && var.create_dashboard ? 1 : 0
  name                = var.monitor_dashboard_name != null ? var.monitor_dashboard_name : "dashboard-${local.resource_names.function_app}"
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  tags                = local.resource_specific_tags.monitoring

  dashboard_properties = templatefile("${path.module}/dashboard.tpl", {
    function_app_name    = local.resource_names.function_app
    storage_account_name = local.resource_names.storage_account
    key_vault_name       = local.resource_names.key_vault
    app_insights_name    = local.resource_names.app_insights
    resource_group_name  = local.resource_group_name
  })
}
