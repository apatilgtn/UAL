output "function_app_name" {
  description = "Name of the Function App"
  value       = var.create_function_app ? local.resource_names.function_app : null
}

output "function_app_id" {
  description = "ID of the Function App"
  value = var.create_function_app ? (
    var.function_app_os_type == "Linux" ?
    azurerm_linux_function_app.main[0].id :
    azurerm_windows_function_app.main[0].id
  ) : null
}

output "function_app_default_hostname" {
  description = "Default hostname of the Function App"
  value = var.create_function_app ? (
    var.function_app_os_type == "Linux" ?
    azurerm_linux_function_app.main[0].default_hostname :
    azurerm_windows_function_app.main[0].default_hostname
  ) : null
}

output "function_app_principal_id" {
  description = "Principal ID of the Function App managed identity"
  value = var.create_function_app ? (
    var.function_app_os_type == "Linux" ?
    azurerm_linux_function_app.main[0].identity[0].principal_id :
    azurerm_windows_function_app.main[0].identity[0].principal_id
  ) : null
}

output "app_service_plan_id" {
  description = "ID of the App Service Plan"
  value       = var.create_function_app ? azurerm_service_plan.main[0].id : null
}

output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = var.create_function_app ? azurerm_service_plan.main[0].name : null
}