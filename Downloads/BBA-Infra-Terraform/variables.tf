# Variables for the Azure Application Platform deployment
# Users can customize these values to create their resources

variable "application_name" {
  description = "Name of the application (used for resource naming when custom names are not provided)"
  type        = string
  default     = "myapp"
}

variable "environment" {
  description = "Environment name (dev, uat, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "East US"
}

# Custom resource names (optional - if not provided, names will be generated)
variable "resource_group_name" {
  description = "Custom name for the resource group"
  type        = string
  default     = null
}

variable "storage_account_name" {
  description = "Custom name for the storage account"
  type        = string
  default     = null
}

variable "key_vault_name" {
  description = "Custom name for the key vault"
  type        = string
  default     = null
}

variable "function_app_name" {
  description = "Custom name for the function app"
  type        = string
  default     = null
}

variable "app_service_plan_name" {
  description = "Custom name for the app service plan"
  type        = string
  default     = null
}

variable "app_insights_name" {
  description = "Custom name for the application insights"
  type        = string
  default     = null
}

# Resource creation flags
variable "create_resource_group" {
  description = "Whether to create a new resource group"
  type        = bool
  default     = true
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

variable "create_monitoring" {
  description = "Whether to create monitoring resources"
  type        = bool
  default     = true
}

# Configuration variables
variable "storage_account_tier" {
  description = "Storage account performance tier"
  type        = string
  default     = "Standard"
}

variable "storage_replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "LRS"
}

variable "key_vault_sku" {
  description = "Key Vault SKU"
  type        = string
  default     = "standard"
}

variable "function_app_os_type" {
  description = "Operating system type for function app"
  type        = string
  default     = "Linux"
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

variable "app_insights_application_type" {
  description = "Application type for Application Insights"
  type        = string
  default     = "web"
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment        = "Development"
    Description        = "Application infrastructure"
    Department         = "Engineering"
    Owner              = "team@company.com"
    Application        = "MyApp"
    DataClassification = "Public - General"
    Criticality        = "Low - Development"
  }
}