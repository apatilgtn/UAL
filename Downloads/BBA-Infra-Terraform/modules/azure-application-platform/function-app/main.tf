# Azure App Service Plan for Function App
resource "azurerm_service_plan" "main" {
  count               = var.create_function_app ? 1 : 0
  name                = local.resource_names.app_service_plan
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  os_type             = var.function_app_os_type
  sku_name            = coalesce(var.function_app_sku_name, local.current_env_config.function_app_sku)

  tags = local.resource_specific_tags.app_service_plan
}

# Azure Function App
resource "azurerm_linux_function_app" "main" {
  count                      = var.create_function_app && var.function_app_os_type == "Linux" ? 1 : 0
  name                       = local.resource_names.function_app
  resource_group_name        = local.resource_group_name
  location                   = local.resource_group_location
  storage_account_name       = var.create_storage_account ? azurerm_storage_account.main[0].name : null
  storage_account_access_key = var.create_storage_account ? azurerm_storage_account.main[0].primary_access_key : null
  service_plan_id            = azurerm_service_plan.main[0].id

  # Security and networking
  https_only                    = true
  public_network_access_enabled = var.enable_public_access

  # Site configuration
  site_config {
    minimum_tls_version = "1.2"

    application_stack {
      dotnet_version          = var.function_app_runtime_stack == "dotnet" ? "6.0" : null
      node_version            = var.function_app_runtime_stack == "node" ? "18" : null
      python_version          = var.function_app_runtime_stack == "python" ? "3.9" : null
      java_version            = var.function_app_runtime_stack == "java" ? "11" : null
      powershell_core_version = var.function_app_runtime_stack == "powershell" ? "7" : null
    }

    # CORS settings
    cors {
      allowed_origins = ["https://portal.azure.com"]
    }

    # Application Insights integration
    dynamic "application_insights" {
      for_each = var.create_app_insights ? [1] : []
      content {
        instrumentation_key = azurerm_application_insights.main[0].instrumentation_key
      }
    }
  }

  # Application settings
  app_settings = merge(
    local.function_app_settings,
    {
      "FUNCTIONS_EXTENSION_VERSION" = var.function_app_runtime_version
      "FUNCTIONS_WORKER_RUNTIME"    = var.function_app_runtime_stack
    }
  )

  # Identity configuration for Key Vault access
  identity {
    type = "SystemAssigned"
  }

  tags = local.resource_specific_tags.function_app

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
      app_settings["AzureWebJobsStorage"],
      app_settings["WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"]
    ]
  }

  depends_on = [
    azurerm_service_plan.main,
    azurerm_storage_account.main,
    azurerm_application_insights.main
  ]
}

# Windows Function App (alternative)
resource "azurerm_windows_function_app" "main" {
  count                      = var.create_function_app && var.function_app_os_type == "Windows" ? 1 : 0
  name                       = var.function_app_name != null ? var.function_app_name : local.resource_names.function_app
  resource_group_name        = local.resource_group_name
  location                   = local.resource_group_location
  storage_account_name       = var.create_storage_account ? azurerm_storage_account.main[0].name : null
  storage_account_access_key = var.create_storage_account ? azurerm_storage_account.main[0].primary_access_key : null
  service_plan_id            = azurerm_service_plan.main[0].id

  # Security and networking
  https_only                    = true
  public_network_access_enabled = var.enable_public_access

  # Site configuration
  site_config {
    minimum_tls_version = "1.2"

    application_stack {
      dotnet_version          = var.function_app_runtime_stack == "dotnet" ? "v6.0" : null
      node_version            = var.function_app_runtime_stack == "node" ? "~18" : null
      java_version            = var.function_app_runtime_stack == "java" ? "11" : null
      powershell_core_version = var.function_app_runtime_stack == "powershell" ? "~7" : null
    }

    # CORS settings
    cors {
      allowed_origins = ["https://portal.azure.com"]
    }

    # Application Insights integration
    dynamic "application_insights" {
      for_each = var.create_app_insights ? [1] : []
      content {
        instrumentation_key = azurerm_application_insights.main[0].instrumentation_key
      }
    }
  }

  # Application settings
  app_settings = merge(
    local.function_app_settings,
    {
      "FUNCTIONS_EXTENSION_VERSION" = var.function_app_runtime_version
      "FUNCTIONS_WORKER_RUNTIME"    = var.function_app_runtime_stack
    }
  )

  # Identity configuration for Key Vault access
  identity {
    type = "SystemAssigned"
  }

  tags = local.resource_specific_tags.function_app

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
      app_settings["AzureWebJobsStorage"],
      app_settings["WEBSITE_CONTENTAZUREFILECONNECTIONSTRING"]
    ]
  }

  depends_on = [
    azurerm_service_plan.main,
    azurerm_storage_account.main,
    azurerm_application_insights.main
  ]
}

# Key Vault access policy for Function App managed identity
resource "azurerm_key_vault_access_policy" "function_app" {
  count        = var.create_function_app && var.create_key_vault ? 1 : 0
  key_vault_id = azurerm_key_vault.main[0].id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = var.function_app_os_type == "Linux" ? azurerm_linux_function_app.main[0].identity[0].principal_id : azurerm_windows_function_app.main[0].identity[0].principal_id

  secret_permissions = [
    "Get", "List"
  ]

  depends_on = [
    azurerm_linux_function_app.main,
    azurerm_windows_function_app.main,
    azurerm_key_vault.main
  ]
}