# Terraform and Provider Configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

# Data sources for current Azure context
data "azurerm_client_config" "current" {}

# Check for existing resource group (only if not creating one AND name is provided)
data "azurerm_resource_group" "existing" {
  count = var.create_resource_group ? 0 : (var.resource_group_name != null ? 1 : 0)
  name  = var.resource_group_name

  # Only query if resource group name is provided
  depends_on = []
}