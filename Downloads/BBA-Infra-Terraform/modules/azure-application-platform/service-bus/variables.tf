variable "application_name" {
  description = "Name of the application for resource naming convention."
  type        = string
}

variable "environment" {
  description = "Environment name for resource naming convention."
  type        = string
}
variable "create_service_bus" {
  description = "Whether to create Service Bus resources"
  type        = bool
  default     = false
}

variable "service_bus_namespace_name" {
  description = "Name of the Service Bus namespace"
  type        = string
}

variable "location" {
  description = "Azure region where resources will be created"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "service_bus_sku" {
  description = "SKU of the Service Bus namespace (Basic, Standard, Premium)"
  type        = string
  default     = "Standard"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.service_bus_sku)
    error_message = "SKU must be Basic, Standard, or Premium."
  }
}

variable "service_bus_capacity" {
  description = "Specifies the capacity (messaging units) for Premium SKU. For Standard/Basic, set to 0."
  type        = number
  default     = 0
  validation {
    condition     = var.service_bus_sku == "Premium" ? (var.service_bus_capacity >= 1 && var.service_bus_capacity <= 16) : var.service_bus_capacity == 0
    error_message = "For Premium SKU, capacity must be between 1 and 16. For Standard/Basic, set to 0."
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
  default     = false
}

variable "service_bus_public_network_access_enabled" {
  description = "Whether public network access is enabled"
  type        = bool
  default     = true
}

variable "service_bus_minimum_tls_version" {
  description = "Minimum TLS version for Service Bus"
  type        = string
  default     = "1.2"
  validation {
    condition     = contains(["1.0", "1.1", "1.2"], var.service_bus_minimum_tls_version)
    error_message = "Minimum TLS version must be 1.0, 1.1, or 1.2."
  }
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

variable "service_bus_private_dns_zone_ids" {
  description = "Private DNS zone IDs for Service Bus private endpoint"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}