# Core Configuration Variables
variable "application_name" {
  description = "Name of the application"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9]+$", var.application_name))
    error_message = "Application name must contain only lowercase letters and numbers."
  }
}

variable "environment" {
  description = "Environment name (dev, test, uat, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "test", "uat", "prod"], var.environment)
    error_message = "Environment must be one of: dev, test, uat, prod."
  }
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "Australia East"
}

# Resource Configuration
variable "create_resource_group" {
  description = "Whether to create a new resource group"
  type        = bool
  default     = true
}

variable "resource_group_name" {
  description = "Name of existing resource group (required when create_resource_group is false)"
  type        = string
  default     = null

  validation {
    condition     = var.resource_group_name == null || (var.resource_group_name != null && length(trim(var.resource_group_name, " ")) > 0)
    error_message = "Resource group name cannot be empty. If you're using an existing resource group (create_resource_group = false), provide the name. Example: resource_group_name = \"rg-my-team-dev\""
  }
}

variable "create_storage_account" {
  description = "Whether to create storage account"
  type        = bool
  default     = true
}

variable "create_key_vault" {
  description = "Whether to create key vault"
  type        = bool
  default     = true
}

variable "create_function_app" {
  description = "Whether to create function app"
  type        = bool
  default     = true
}

variable "create_app_insights" {
  description = "Whether to create application insights"
  type        = bool
  default     = true
}

variable "create_service_bus" {
  description = "Whether to create Service Bus resources"
  type        = bool
  default     = false
}

# Storage Account Configuration
variable "storage_account_tier" {
  description = "Storage account performance tier"
  type        = string
  default     = "Standard"
  validation {
    condition     = contains(["Standard", "Premium"], var.storage_account_tier)
    error_message = "Storage account tier must be Standard or Premium."
  }
}

variable "storage_replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "LRS"
  validation {
    condition     = contains(["LRS", "GRS", "RAGRS", "ZRS", "GZRS", "RAGZRS"], var.storage_replication_type)
    error_message = "Invalid storage replication type."
  }
}

# Key Vault Configuration
variable "key_vault_sku" {
  description = "Key Vault SKU"
  type        = string
  default     = "standard"
  validation {
    condition     = contains(["standard", "premium"], var.key_vault_sku)
    error_message = "Key Vault SKU must be standard or premium."
  }
}

variable "key_vault_enabled_for_disk_encryption" {
  description = "Enable Key Vault for disk encryption"
  type        = bool
  default     = true
}

variable "key_vault_enabled_for_deployment" {
  description = "Enable Key Vault for deployment"
  type        = bool
  default     = true
}

variable "key_vault_enabled_for_template_deployment" {
  description = "Enable Key Vault for template deployment"
  type        = bool
  default     = true
}

variable "key_vault_purge_protection_enabled" {
  description = "Enable purge protection for Key Vault"
  type        = bool
  default     = true # Default to true for security best practices
}

variable "key_vault_soft_delete_retention_days" {
  description = "Number of days to retain soft deleted Key Vault"
  type        = number
  default     = 7
}

# Function App Configuration
variable "function_app_os_type" {
  description = "Operating system type for function app"
  type        = string
  default     = "Linux"
  validation {
    condition     = contains(["Linux", "Windows"], var.function_app_os_type)
    error_message = "Function app OS type must be Linux or Windows."
  }
}

variable "function_app_sku_name" {
  description = "SKU name for function app service plan"
  type        = string
  default     = "Y1"
}

variable "function_app_runtime_stack" {
  description = "Runtime stack for function app"
  type        = string
  default     = "dotnet"
}

variable "function_app_runtime_version" {
  description = "Runtime version for function app"
  type        = string
  default     = "~4"
}

# Application Insights Configuration
variable "app_insights_application_type" {
  description = "Application type for Application Insights"
  type        = string
  default     = "web"
}

variable "app_insights_retention_in_days" {
  description = "Retention period in days for Application Insights"
  type        = number
  default     = 90
}

# Tagging Configuration
variable "common_tags" {
  description = "Common tags to apply to all resources based on organizational standards. Users must provide all required organizational tags."
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for required_tag in ["Environment", "Description", "Department", "Owner", "Application", "DataClassification", "Criticality"] :
      lookup(var.common_tags, required_tag, "") != ""
    ])
    error_message = "All required organizational tags must be provided: Environment, Description, Department, Owner, Application, DataClassification, Criticality."
  }

  validation {
    condition     = can(regex("^(Development|Test|UAT|Production)$", lookup(var.common_tags, "Environment", "")))
    error_message = "Environment tag must be one of: Development, Test, UAT, Production."
  }

  validation {
    condition     = can(regex("^(S[1-4]|Public)\\s*-\\s*.+", lookup(var.common_tags, "DataClassification", "")))
    error_message = "DataClassification must follow format: 'S1 - Description', 'S2 - Description', etc., or 'Public - Description'."
  }

  validation {
    condition     = can(regex("^(A[1-3]|Low|Medium|High)\\s*-\\s*.+", lookup(var.common_tags, "Criticality", "")))
    error_message = "Criticality must follow format: 'A1 - Critical', 'A2 - High', 'A3 - Medium', or 'Low/Medium/High - Description'."
  }
}

variable "additional_tags" {
  description = "Additional tags to apply to specific resources"
  type        = map(string)
  default     = {}
}

# Service Principal/Identity Configuration
variable "service_connection_object_id" {
  description = "Object ID of the Azure DevOps service connection"
  type        = string
  default     = null
}

variable "additional_key_vault_access_policies" {
  description = "Additional access policies for Key Vault"
  type = list(object({
    tenant_id = string
    object_id = string
    key_permissions = optional(list(string), [
      "Get", "List", "Update", "Create", "Import", "Delete", "Recover",
      "Backup", "Restore", "Decrypt", "Encrypt", "UnwrapKey", "WrapKey",
      "Verify", "Sign", "Purge"
    ])
    secret_permissions = optional(list(string), [
      "Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"
    ])
    certificate_permissions = optional(list(string), [
      "Get", "List", "Update", "Create", "Import", "Delete", "Recover",
      "Backup", "Restore", "ManageContacts", "ManageIssuers", "GetIssuers",
      "ListIssuers", "SetIssuers", "DeleteIssuers", "Purge"
    ])
  }))
  default = []
}

# Network Configuration
variable "allowed_ip_ranges" {
  description = "List of IP ranges allowed to access resources"
  type        = list(string)
  default     = []
}

variable "enable_public_access" {
  description = "Enable public access to resources"
  type        = bool
  default     = true
}

# Monitoring Configuration
variable "create_monitoring" {
  description = "Whether to create monitoring resources"
  type        = bool
  default     = true
}

variable "create_dashboard" {
  description = "Whether to create Azure dashboard"
  type        = bool
  default     = true
}

variable "log_analytics_sku" {
  description = "SKU for Log Analytics workspace"
  type        = string
  default     = "PerGB2018"
  validation {
    condition     = contains(["Free", "PerNode", "PerGB2018", "Standard", "Premium"], var.log_analytics_sku)
    error_message = "Log Analytics SKU must be one of: Free, PerNode, PerGB2018, Standard, Premium."
  }
}

variable "log_analytics_retention_days" {
  description = "Retention period in days for Log Analytics workspace"
  type        = number
  default     = 90
  validation {
    condition     = var.log_analytics_retention_days >= 30 && var.log_analytics_retention_days <= 730
    error_message = "Log Analytics retention must be between 30 and 730 days."
  }
}

variable "alert_email_addresses" {
  description = "List of email addresses for alert notifications"
  type        = list(string)
  default     = []
}

variable "alert_webhook_urls" {
  description = "List of webhook URLs for alert notifications"
  type        = list(string)
  default     = []
}

# Backup and Disaster Recovery Configuration
variable "create_backup" {
  description = "Whether to create backup and disaster recovery resources"
  type        = bool
  default     = true
}

variable "backup_vault_sku" {
  description = "SKU for Recovery Services Vault"
  type        = string
  default     = "Standard"
  validation {
    condition     = contains(["Standard", "RS0"], var.backup_vault_sku)
    error_message = "Backup vault SKU must be Standard or RS0."
  }
}

variable "backup_timezone" {
  description = "Timezone for backup schedules"
  type        = string
  default     = "UTC"
}

variable "backup_frequency" {
  description = "Frequency of backups"
  type        = string
  default     = "Daily"
  validation {
    condition     = contains(["Daily", "Weekly"], var.backup_frequency)
    error_message = "Backup frequency must be Daily or Weekly."
  }
}

variable "backup_time" {
  description = "Time of day for backups (HH:MM format)"
  type        = string
  default     = "02:00"
}

variable "backup_retention_daily" {
  description = "Daily backup retention in days"
  type        = number
  default     = 7
  validation {
    condition     = var.backup_retention_daily >= 1 && var.backup_retention_daily <= 9999
    error_message = "Daily retention must be between 1 and 9999 days."
  }
}

variable "backup_retention_weekly" {
  description = "Weekly backup retention in weeks"
  type        = number
  default     = 4
  validation {
    condition     = var.backup_retention_weekly >= 0 && var.backup_retention_weekly <= 9999
    error_message = "Weekly retention must be between 0 and 9999 weeks."
  }
}

variable "backup_retention_monthly" {
  description = "Monthly backup retention in months"
  type        = number
  default     = 12
  validation {
    condition     = var.backup_retention_monthly >= 0 && var.backup_retention_monthly <= 9999
    error_message = "Monthly retention must be between 0 and 9999 months."
  }
}

variable "backup_retention_yearly" {
  description = "Yearly backup retention in years"
  type        = number
  default     = 7
  validation {
    condition     = var.backup_retention_yearly >= 0 && var.backup_retention_yearly <= 9999
    error_message = "Yearly retention must be between 0 and 9999 years."
  }
}

variable "enable_cross_region_replication" {
  description = "Enable cross-region replication for disaster recovery"
  type        = bool
  default     = true
}

variable "replica_location" {
  description = "Location for disaster recovery replica"
  type        = string
  default     = "Australia Southeast"
  validation {
    condition = contains([
      "Australia East",
      "Australia Southeast",
      "Australia Central",
      "Australia Central 2"
    ], var.replica_location)
    error_message = "Replica location must be an Australian region."
  }
}

variable "enable_site_recovery" {
  description = "Enable Azure Site Recovery"
  type        = bool
  default     = false
}

variable "create_automation_runbook" {
  description = "Create automation runbook for disaster recovery"
  type        = bool
  default     = true
}

variable "backup_alert_email_addresses" {
  description = "Email addresses for backup alerts"
  type        = list(string)
  default     = []
}

# Function App Additional Variables
variable "function_app_sku" {
  description = "SKU for the Function App service plan"
  type        = string
  default     = null
}

variable "function_app_version" {
  description = "Runtime version for the Function App"
  type        = string
  default     = null
}

variable "function_app_always_on" {
  description = "Whether the Function App should always be on"
  type        = bool
  default     = null
}

variable "function_app_use_32_bit_worker" {
  description = "Whether to use 32-bit worker process"
  type        = bool
  default     = null
}

variable "function_app_https_only" {
  description = "Whether the Function App should only accept HTTPS traffic"
  type        = bool
  default     = null
}

variable "function_app_min_tls_version" {
  description = "Minimum TLS version for the Function App"
  type        = string
  default     = null
}

variable "function_app_ftps_state" {
  description = "State of FTP/S for the Function App"
  type        = string
  default     = null
}

variable "function_app_managed_identity_type" {
  description = "Type of managed identity for the Function App"
  type        = string
  default     = null
}

# Application Insights Additional Variables
variable "app_insights_type" {
  description = "Type of Application Insights"
  type        = string
  default     = null
}

variable "app_insights_retention_days" {
  description = "Retention days for Application Insights"
  type        = number
  default     = null
}

# Service Bus Configuration
variable "service_bus_sku" {
  description = "SKU of the Service Bus namespace (Basic, Standard, Premium)"
  type        = string
  default     = null
}

variable "service_bus_capacity" {
  description = "Specifies the capacity (messaging units) for Premium SKU. For Standard/Basic, set to 0."
  type        = number
  default     = 0
  validation {
    condition     = var.service_bus_capacity >= 0 && var.service_bus_capacity <= 16
    error_message = "Capacity must be between 0 and 16 messaging units. For Premium SKU, use 1-16. For Standard/Basic, use 0."
  }
}

variable "service_bus_premium_messaging_partitions" {
  description = "Number of messaging partitions for Premium SKU"
  type        = number
  default     = 1
  validation {
    condition     = var.service_bus_premium_messaging_partitions >= 1 && var.service_bus_premium_messaging_partitions <= 4
    error_message = "Premium messaging partitions must be between 1 and 4."
  }
}

variable "service_bus_zone_redundant" {
  description = "Whether the Service Bus namespace is zone redundant (Premium only)"
  type        = bool
  default     = null
}

variable "service_bus_minimum_tls_version" {
  description = "Minimum TLS version for Service Bus"
  type        = string
  default     = null
}

variable "service_bus_identity_type" {
  description = "Type of managed identity for Service Bus"
  type        = string
  default     = null
  validation {
    condition     = var.service_bus_identity_type == null || contains(["SystemAssigned", "UserAssigned", "SystemAssigned,UserAssigned"], var.service_bus_identity_type)
    error_message = "Identity type must be SystemAssigned, UserAssigned, or SystemAssigned,UserAssigned."
  }
}

variable "service_bus_user_assigned_identity_ids" {
  description = "List of user assigned identity IDs for Service Bus"
  type        = list(string)
  default     = null
}

variable "service_bus_queues" {
  description = "List of Service Bus queues to create"
  type = list(object({
    name                                    = string
    max_size_in_megabytes                   = optional(number, 1024)
    default_message_ttl                     = optional(string, "P14D")
    duplicate_detection_history_time_window = optional(string, "PT10M")
    max_delivery_count                      = optional(number, 10)
    lock_duration                           = optional(string, "PT1M")
    enable_batched_operations               = optional(bool, true)
    enable_express                          = optional(bool, false)
    enable_partitioning                     = optional(bool, false)
    requires_duplicate_detection            = optional(bool, false)
    requires_session                        = optional(bool, false)
    dead_lettering_on_message_expiration    = optional(bool, false)
    auto_delete_on_idle                     = optional(string, null)
    forward_to                              = optional(string, null)
    forward_dead_lettered_messages_to       = optional(string, null)
    authorization_rules = optional(list(object({
      name   = string
      listen = optional(bool, false)
      send   = optional(bool, false)
      manage = optional(bool, false)
    })), [])
  }))
  default = []
}

variable "service_bus_topics" {
  description = "List of Service Bus topics to create"
  type = list(object({
    name                                    = string
    max_size_in_megabytes                   = optional(number, 1024)
    default_message_ttl                     = optional(string, "P14D")
    duplicate_detection_history_time_window = optional(string, "PT10M")
    enable_batched_operations               = optional(bool, true)
    enable_express                          = optional(bool, false)
    enable_partitioning                     = optional(bool, false)
    requires_duplicate_detection            = optional(bool, false)
    support_ordering                        = optional(bool, false)
    auto_delete_on_idle                     = optional(string, null)
    authorization_rules = optional(list(object({
      name   = string
      listen = optional(bool, false)
      send   = optional(bool, false)
      manage = optional(bool, false)
    })), [])
    subscriptions = optional(list(object({
      name                                      = string
      max_delivery_count                        = optional(number, 10)
      default_message_ttl                       = optional(string, "P14D")
      lock_duration                             = optional(string, "PT1M")
      enable_batched_operations                 = optional(bool, true)
      requires_session                          = optional(bool, false)
      dead_lettering_on_message_expiration      = optional(bool, false)
      dead_lettering_on_filter_evaluation_error = optional(bool, true)
      auto_delete_on_idle                       = optional(string, null)
      forward_to                                = optional(string, null)
      forward_dead_lettered_messages_to         = optional(string, null)
      rules = optional(list(object({
        name        = string
        filter_type = optional(string, "SqlFilter")
        sql_filter  = optional(string, null)
        correlation_filter = optional(object({
          correlation_id      = optional(string, null)
          message_id          = optional(string, null)
          to                  = optional(string, null)
          reply_to            = optional(string, null)
          label               = optional(string, null)
          session_id          = optional(string, null)
          reply_to_session_id = optional(string, null)
          content_type        = optional(string, null)
          properties          = optional(map(string), {})
        }), null)
        action = optional(string, null)
      })), [])
    })), [])
  }))
  default = []
}

variable "service_bus_authorization_rules" {
  description = "List of authorization rules for the Service Bus namespace"
  type = list(object({
    name   = string
    listen = optional(bool, false)
    send   = optional(bool, false)
    manage = optional(bool, false)
  }))
  default = []
}

variable "service_bus_private_endpoint_enabled" {
  description = "Whether to create a private endpoint for Service Bus (Premium only)"
  type        = bool
  default     = false
}

variable "service_bus_private_endpoint_subnet_id" {
  description = "Subnet ID for the Service Bus private endpoint"
  type        = string
  default     = null
}

variable "key_vault_subnet_ids" {
  description = "List of subnet IDs allowed to access Key Vault when network ACLs are enabled"
  type        = list(string)
  default     = []
}

variable "service_bus_private_dns_zone_ids" {
  description = "Private DNS zone IDs for Service Bus private endpoint"
  type        = list(string)
  default     = null
}

# Custom Resource Naming Variables
variable "resource_group_name_custom" {
  description = "Custom name for the resource group (overrides generated name)"
  type        = string
  default     = null
}

variable "storage_account_name_custom" {
  description = "Custom name for the storage account (overrides generated name)"
  type        = string
  default     = null
}

variable "key_vault_name_custom" {
  description = "Custom name for the key vault (overrides generated name)"
  type        = string
  default     = null
}

variable "function_app_name_custom" {
  description = "Custom name for the function app (overrides generated name)"
  type        = string
  default     = null
}

variable "app_service_plan_name_custom" {
  description = "Custom name for the app service plan (overrides generated name)"
  type        = string
  default     = null
}

variable "app_insights_name_custom" {
  description = "Custom name for the application insights (overrides generated name)"
  type        = string
  default     = null
}

variable "service_bus_namespace_name_custom" {
  description = "Custom name for the service bus namespace (overrides generated name)"
  type        = string
  default     = null
}

variable "log_analytics_workspace_name_custom" {
  description = "Custom name for the Log Analytics workspace (overrides generated name)"
  type        = string
  default     = null
}

variable "action_group_name_custom" {
  description = "Custom name for the Action Group (overrides generated name)"
  type        = string
  default     = null
}

variable "dashboard_name_custom" {
  description = "Custom name for the Azure Dashboard (overrides generated name)"
  type        = string
  default     = null
}

variable "create_storage_container" {
  description = "Whether to create storage containers in the storage account. Use false for import/brownfield."
  type        = bool
  default     = true
}

variable "create_storage_table" {
  description = "Whether to create the storage table(s) for state locking, etc. Use false for import/brownfield."
  type        = bool
  default     = true
}
