output "app_insights_name" {
  description = "Name of the Application Insights instance"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].name : null
}

output "app_insights_id" {
  description = "ID of the Application Insights instance"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].id : null
}

output "instrumentation_key" {
  description = "Instrumentation key of the Application Insights instance"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].instrumentation_key : null
  sensitive   = true
}

output "connection_string" {
  description = "Connection string of the Application Insights instance"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].connection_string : null
  sensitive   = true
}

output "app_id" {
  description = "App ID of the Application Insights instance"
  value       = var.create_app_insights ? azurerm_application_insights.main[0].app_id : null
}