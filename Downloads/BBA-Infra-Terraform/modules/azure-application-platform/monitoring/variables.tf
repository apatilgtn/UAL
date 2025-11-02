# Monitoring Module Variables

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

# Resource IDs passed from parent module
variable "function_app_id" {
  description = "ID of the Function App"
  type        = string
  default     = null
}

variable "storage_account_id" {
  description = "ID of the Storage Account"
  type        = string
  default     = null
}

variable "key_vault_id" {
  description = "ID of the Key Vault"
  type        = string
  default     = null
}

variable "app_insights_id" {
  description = "ID of the Application Insights"
  type        = string
  default     = null
}

# Local values passed from parent module
variable "resource_names" {
  description = "Map of resource names"
  type        = map(string)
  default     = {}
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = ""
}

variable "resource_group_location" {
  description = "Location of the resource group"
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "create_function_app" {
  description = "Whether Function App was created"
  type        = bool
  default     = false
}

variable "create_storage_account" {
  description = "Whether Storage Account was created"
  type        = bool
  default     = false
}

variable "create_key_vault" {
  description = "Whether Key Vault was created"
  type        = bool
  default     = false
}

variable "create_app_insights" {
  description = "Whether Application Insights was created"
  type        = bool
  default     = false
}
