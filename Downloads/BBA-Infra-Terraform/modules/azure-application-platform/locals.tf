# Local values for resource naming and common configurations
locals {
  # Resource naming convention: {resource_type_abbreviation}-{application_name}-{environment}
  resource_names = {
    resource_group          = var.resource_group_name_custom != null ? var.resource_group_name_custom : "rg-${var.application_name}-${var.environment}"
    storage_account         = var.storage_account_name_custom != null ? var.storage_account_name_custom : "st${var.application_name}${var.environment}01" # Storage accounts need to be unique and alphanumeric only
    key_vault               = var.key_vault_name_custom != null ? var.key_vault_name_custom : "kv-${var.application_name}-${var.environment}"
    function_app            = var.function_app_name_custom != null ? var.function_app_name_custom : "fn-${var.application_name}-${var.environment}"
    app_service_plan        = var.app_service_plan_name_custom != null ? var.app_service_plan_name_custom : "asp-${var.application_name}-${var.environment}"
    app_insights            = var.app_insights_name_custom != null ? var.app_insights_name_custom : "appi-${var.application_name}-${var.environment}"
    log_analytics_workspace = var.log_analytics_workspace_name_custom != null ? var.log_analytics_workspace_name_custom : "log-${var.application_name}-${var.environment}"
    action_group            = var.action_group_name_custom != null ? var.action_group_name_custom : "ag-${var.application_name}-${var.environment}"
    dashboard               = var.dashboard_name_custom != null ? var.dashboard_name_custom : "dash-${var.application_name}-${var.environment}"
    service_bus             = var.service_bus_namespace_name_custom != null ? var.service_bus_namespace_name_custom : "sb-${var.application_name}-${var.environment}"
  }

  # Common tags merged with automatic infrastructure tags
  # User-provided tags take precedence over automatic tags
  common_tags = merge(
    {
      # Automatic infrastructure tags (can be overridden by user)
      ManagedBy   = "Terraform"
      Application = title(var.application_name)
      # Removed CreatedDate from here - should only be set on initial resource creation by users

      # Environment normalization (ensure consistent casing)
      Environment = lookup(var.common_tags, "Environment", title(var.environment))
    },
    var.common_tags, # User-provided tags override automatic ones
    var.additional_tags
  )

  # Environment-specific configurations
  environment_config = {
    dev = {
      storage_tier          = "Standard"
      storage_replication   = "LRS"
      key_vault_sku         = "standard"
      function_app_sku      = "Y1" # Consumption plan for dev
      purge_protection      = true # Enable purge protection for security
      retention_days        = 30   # Changed from 7 to 30 (minimum for App Insights)
      app_insights_type     = "web"
      log_analytics_sku     = "PerGB2018"
      always_on             = false
      use_32_bit_worker     = false
      ftps_state            = "Disabled"
      min_tls_version       = "1.2"
      https_only            = true
      managed_identity_type = "SystemAssigned"
      function_app_version  = "v4.0"
      service_bus_sku       = "Standard"
      service_bus_capacity  = 0
      zone_redundant        = false
    }
    test = {
      storage_tier          = "Standard"
      storage_replication   = "LRS"
      key_vault_sku         = "standard"
      function_app_sku      = "Y1" # Consumption plan for test
      purge_protection      = true
      retention_days        = 30
      app_insights_type     = "web"
      log_analytics_sku     = "PerGB2018"
      always_on             = false
      use_32_bit_worker     = false
      ftps_state            = "Disabled"
      min_tls_version       = "1.2"
      https_only            = true
      managed_identity_type = "SystemAssigned"
      function_app_version  = "v4.0"
      service_bus_sku       = "Standard"
      service_bus_capacity  = 0
      zone_redundant        = false
    }
    uat = {
      storage_tier          = "Standard"
      storage_replication   = "GRS"
      key_vault_sku         = "standard"
      function_app_sku      = "EP1" # Elastic Premium for UAT
      purge_protection      = true
      retention_days        = 30
      app_insights_type     = "web"
      log_analytics_sku     = "PerGB2018"
      always_on             = true
      use_32_bit_worker     = false
      ftps_state            = "Disabled"
      min_tls_version       = "1.2"
      https_only            = true
      managed_identity_type = "SystemAssigned"
      function_app_version  = "v4.0"
      service_bus_sku       = "Standard"
      service_bus_capacity  = 0
      zone_redundant        = false
    }
    prod = {
      storage_tier          = "Premium"
      storage_replication   = "GRS"
      key_vault_sku         = "premium"
      function_app_sku      = "EP2" # Elastic Premium for Production
      purge_protection      = true
      retention_days        = 90
      app_insights_type     = "web"
      log_analytics_sku     = "PerGB2018"
      always_on             = true
      use_32_bit_worker     = false
      ftps_state            = "Disabled"
      min_tls_version       = "1.2"
      https_only            = true
      managed_identity_type = "SystemAssigned"
      function_app_version  = "v4.0"
      service_bus_sku       = "Premium"
      service_bus_capacity  = 1
      zone_redundant        = true
    }
  }

  # Get current environment configuration
  current_env_config = local.environment_config[var.environment]

  # Key Vault access policies for service connection
  service_connection_access_policy = var.service_connection_object_id != null ? [
    {
      tenant_id = data.azurerm_client_config.current.tenant_id
      object_id = var.service_connection_object_id
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
  ] : []

  # All access policies combined
  all_access_policies = concat(
    local.service_connection_access_policy,
    var.additional_key_vault_access_policies
  )

  # Resource-specific tags with detailed descriptions
  resource_specific_tags = {
    resource_group = merge(local.common_tags, {
      Description = "Resource group containing all ${lookup(local.common_tags, "Application", var.application_name)} infrastructure for ${lower(lookup(local.common_tags, "Environment", var.environment))} environment"
    })

    storage_account = merge(local.common_tags, {
      Description = "Storage account for ${lookup(local.common_tags, "Application", var.application_name)} application data, function deployments, and document storage"
    })

    key_vault = merge(local.common_tags, {
      Description = "Key vault for ${lookup(local.common_tags, "Application", var.application_name)} secrets, certificates, and sensitive configuration management"
    })

    function_app = merge(local.common_tags, {
      Description = "Function app hosting ${lookup(local.common_tags, "Application", var.application_name)} serverless business logic and API endpoints"
    })

    app_service_plan = merge(local.common_tags, {
      Description = "App service plan providing compute resources for ${lookup(local.common_tags, "Application", var.application_name)} function app"
    })

    app_insights = merge(local.common_tags, {
      Description = "Application insights for ${lookup(local.common_tags, "Application", var.application_name)} performance monitoring, logging, and analytics"
    })

    log_analytics_workspace = merge(local.common_tags, {
      Description = "Log Analytics workspace for ${lookup(local.common_tags, "Application", var.application_name)} centralized logging and monitoring data collection"
    })

    log_analytics = merge(local.common_tags, {
      Description = "Log Analytics resources for ${lookup(local.common_tags, "Application", var.application_name)} centralized logging and monitoring data collection"
    })

    action_group = merge(local.common_tags, {
      Description = "Action group for ${lookup(local.common_tags, "Application", var.application_name)} alert notifications and incident response automation"
    })

    dashboard = merge(local.common_tags, {
      Description = "Azure dashboard providing operational visibility for ${lookup(local.common_tags, "Application", var.application_name)} infrastructure and application metrics"
    })

    service_bus = merge(local.common_tags, {
      Description = "Service Bus namespace for ${lookup(local.common_tags, "Application", var.application_name)} messaging, event-driven architecture, and microservices communication"
    })

    backup = merge(local.common_tags, {
      Description = "Backup services for ${lookup(local.common_tags, "Application", var.application_name)} data protection and disaster recovery"
    })

    monitoring = merge(local.common_tags, {
      Description = "Monitoring and alerting infrastructure for ${lookup(local.common_tags, "Application", var.application_name)} operational health and performance tracking"
    })
  }

  # Storage containers for different purposes
  storage_containers = [
    {
      name        = "terraform-state"
      access_type = "private"
    },
    {
      name        = "function-deployments"
      access_type = "private"
    },
    {
      name        = "application-data"
      access_type = "private"
    }
  ]

  # Function app settings (will be populated in main.tf)
  function_app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE"    = "1"
    "FUNCTIONS_EXTENSION_VERSION" = var.function_app_runtime_version
    "FUNCTIONS_WORKER_RUNTIME"    = var.function_app_runtime_stack
    "WEBSITE_CONTENTSHARE"        = "${local.resource_names.function_app}-content"
  }

  # Resource references that will be used in main.tf
  resource_group_name = var.create_resource_group ? azurerm_resource_group.main[0].name : (
    var.resource_group_name != null ? data.azurerm_resource_group.existing[0].name : var.resource_group_name
  )
  resource_group_location = var.create_resource_group ? azurerm_resource_group.main[0].location : (
    var.resource_group_name != null ? data.azurerm_resource_group.existing[0].location : var.location
  )
}