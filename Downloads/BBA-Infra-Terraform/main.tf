# Main Terraform configuration for Azure Application Platform
# This file demonstrates how to use the module with custom resource names

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Use the Azure Application Platform module to create resources
module "application_platform" {
  source = "./modules/azure-application-platform"

  # Core configuration
  application_name = var.application_name
  environment      = var.environment
  location         = var.location

  # Resource creation flags
  create_resource_group  = var.create_resource_group
  create_storage_account = var.create_storage_account
  create_key_vault       = var.create_key_vault
  create_function_app    = var.create_function_app
  create_app_insights    = var.create_app_insights
  create_service_bus     = var.create_service_bus
  create_monitoring      = var.create_monitoring

  # Custom resource names - these override the generated names
  resource_group_name_custom   = var.resource_group_name
  storage_account_name_custom  = var.storage_account_name
  key_vault_name_custom        = var.key_vault_name
  function_app_name_custom     = var.function_app_name
  app_service_plan_name_custom = var.app_service_plan_name
  app_insights_name_custom     = var.app_insights_name

  # Configuration overrides
  storage_account_tier          = var.storage_account_tier
  storage_replication_type      = var.storage_replication_type
  key_vault_sku                 = var.key_vault_sku
  function_app_os_type          = var.function_app_os_type
  function_app_sku_name         = var.function_app_sku_name
  function_app_runtime_stack    = var.function_app_runtime_stack
  app_insights_application_type = var.app_insights_application_type

  # Tags
  common_tags = var.tags
}

# Outputs
output "resource_group_name" {
  description = "Name of the created resource group"
  value       = module.application_platform.resource_group_name
}

output "storage_account_name" {
  description = "Name of the created storage account"
  value       = module.application_platform.storage_account_name
}

output "key_vault_name" {
  description = "Name of the created key vault"
  value       = module.application_platform.key_vault_name
}

output "function_app_name" {
  description = "Name of the created function app"
  value       = module.application_platform.function_app_name
}

output "app_insights_name" {
  description = "Name of the created application insights"
  value       = module.application_platform.app_insights_name
}

output "app_service_plan_name" {
  description = "Name of the created app service plan"
  value       = module.application_platform.app_service_plan_name
}