# Monitoring Module Outputs

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = var.create_monitoring ? azurerm_log_analytics_workspace.main[0].id : null
}

output "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  value       = var.create_monitoring ? azurerm_log_analytics_workspace.main[0].name : null
}

output "action_group_id" {
  description = "ID of the action group"
  value       = var.create_monitoring ? azurerm_monitor_action_group.main[0].id : null
}

output "dashboard_id" {
  description = "ID of the Azure dashboard"
  value       = var.create_monitoring && var.create_dashboard ? azurerm_portal_dashboard.main[0].id : null
}

output "dashboard_url" {
  description = "URL of the Azure dashboard"
  value       = var.create_monitoring && var.create_dashboard ? azurerm_portal_dashboard.main[0].id : null
}
