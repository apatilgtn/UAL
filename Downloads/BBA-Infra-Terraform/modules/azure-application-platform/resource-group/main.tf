# Azure Resource Group
resource "azurerm_resource_group" "main" {
  count    = var.create_resource_group ? 1 : 0
  name     = var.resource_group_name != null ? var.resource_group_name : local.resource_names.resource_group
  location = var.location
  tags     = local.resource_specific_tags.resource_group

  lifecycle {
    prevent_destroy = true
  }
}