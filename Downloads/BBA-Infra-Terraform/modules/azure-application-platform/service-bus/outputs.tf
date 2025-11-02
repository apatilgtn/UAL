output "service_bus_namespace_id" {
  description = "ID of the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].id : null
}

output "service_bus_namespace_name" {
  description = "Name of the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].name : null
}

output "service_bus_namespace_endpoint" {
  description = "Endpoint of the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].endpoint : null
}

output "service_bus_namespace_primary_connection_string" {
  description = "Primary connection string for the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].default_primary_connection_string : null
  sensitive   = true
}

output "service_bus_namespace_secondary_connection_string" {
  description = "Secondary connection string for the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].default_secondary_connection_string : null
  sensitive   = true
}

output "service_bus_namespace_primary_key" {
  description = "Primary key for the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].default_primary_key : null
  sensitive   = true
}

output "service_bus_namespace_secondary_key" {
  description = "Secondary key for the Service Bus namespace"
  value       = var.create_service_bus ? azurerm_servicebus_namespace.this[0].default_secondary_key : null
  sensitive   = true
}

output "service_bus_namespace_identity" {
  description = "Identity configuration of the Service Bus namespace"
  value = var.create_service_bus && var.service_bus_identity_type != null ? {
    type         = azurerm_servicebus_namespace.this[0].identity[0].type
    principal_id = azurerm_servicebus_namespace.this[0].identity[0].principal_id
    tenant_id    = azurerm_servicebus_namespace.this[0].identity[0].tenant_id
  } : null
}

output "service_bus_queues" {
  description = "Map of Service Bus queues"
  value = var.create_service_bus ? {
    for queue_name, queue in azurerm_servicebus_queue.this : queue_name => {
      id                    = queue.id
      name                  = queue.name
      max_size_in_megabytes = queue.max_size_in_megabytes
      max_delivery_count    = queue.max_delivery_count
    }
  } : {}
}

output "service_bus_topics" {
  description = "Map of Service Bus topics"
  value = var.create_service_bus ? {
    for topic_name, topic in azurerm_servicebus_topic.this : topic_name => {
      id                    = topic.id
      name                  = topic.name
      max_size_in_megabytes = topic.max_size_in_megabytes
    }
  } : {}
}

output "service_bus_subscriptions" {
  description = "Map of Service Bus topic subscriptions"
  value = var.create_service_bus ? {
    for subscription_key, subscription in azurerm_servicebus_subscription.this : subscription_key => {
      id                 = subscription.id
      name               = subscription.name
      max_delivery_count = subscription.max_delivery_count
    }
  } : {}
}

output "service_bus_namespace_authorization_rules" {
  description = "Map of Service Bus namespace authorization rules"
  value = var.create_service_bus ? {
    for rule_name, rule in azurerm_servicebus_namespace_authorization_rule.this : rule_name => {
      id                          = rule.id
      name                        = rule.name
      primary_key                 = rule.primary_key
      secondary_key               = rule.secondary_key
      primary_connection_string   = rule.primary_connection_string
      secondary_connection_string = rule.secondary_connection_string
    }
  } : {}
  sensitive = true
}

output "service_bus_queue_authorization_rules" {
  description = "Map of Service Bus queue authorization rules"
  value = var.create_service_bus ? {
    for rule_key, rule in azurerm_servicebus_queue_authorization_rule.this : rule_key => {
      id                          = rule.id
      name                        = rule.name
      primary_key                 = rule.primary_key
      secondary_key               = rule.secondary_key
      primary_connection_string   = rule.primary_connection_string
      secondary_connection_string = rule.secondary_connection_string
    }
  } : {}
  sensitive = true
}

output "service_bus_topic_authorization_rules" {
  description = "Map of Service Bus topic authorization rules"
  value = var.create_service_bus ? {
    for rule_key, rule in azurerm_servicebus_topic_authorization_rule.this : rule_key => {
      id                          = rule.id
      name                        = rule.name
      primary_key                 = rule.primary_key
      secondary_key               = rule.secondary_key
      primary_connection_string   = rule.primary_connection_string
      secondary_connection_string = rule.secondary_connection_string
    }
  } : {}
  sensitive = true
}

output "service_bus_private_endpoint_id" {
  description = "ID of the Service Bus private endpoint"
  value       = var.create_service_bus && var.service_bus_sku == "Premium" && var.service_bus_private_endpoint_enabled ? azurerm_private_endpoint.service_bus[0].id : null
}

output "service_bus_private_endpoint_ip" {
  description = "Private IP address of the Service Bus private endpoint"
  value = var.create_service_bus && var.service_bus_sku == "Premium" && var.service_bus_private_endpoint_enabled ? (
    length(azurerm_private_endpoint.service_bus[0].private_service_connection) > 0 ?
    azurerm_private_endpoint.service_bus[0].private_service_connection[0].private_ip_address : null
  ) : null
}