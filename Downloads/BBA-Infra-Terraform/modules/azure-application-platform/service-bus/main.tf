# Service Bus Namespace
resource "azurerm_servicebus_namespace" "this" {
  count               = var.create_service_bus ? 1 : 0
  name                = var.service_bus_namespace_name != null ? var.service_bus_namespace_name : "sb-${var.application_name}-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = var.service_bus_sku
  # For Standard/Basic SKU, capacity must be 0. For Premium, set between 1-16.
  capacity = var.service_bus_capacity

  # Premium tier specific settings
  premium_messaging_partitions = var.service_bus_sku == "Premium" ? var.service_bus_premium_messaging_partitions : null

  # Network security
  public_network_access_enabled = var.service_bus_public_network_access_enabled
  minimum_tls_version           = var.service_bus_minimum_tls_version

  # Identity
  dynamic "identity" {
    for_each = var.service_bus_identity_type != null ? [1] : []
    content {
      type         = var.service_bus_identity_type
      identity_ids = var.service_bus_identity_type == "UserAssigned" ? var.service_bus_user_assigned_identity_ids : null
    }
  }

  tags = var.tags
}

# Service Bus Queues
resource "azurerm_servicebus_queue" "this" {
  for_each = var.create_service_bus ? { for queue in var.service_bus_queues : queue.name => queue } : {}

  name         = each.value.name
  namespace_id = azurerm_servicebus_namespace.this[0].id

  # Queue settings
  max_size_in_megabytes                   = each.value.max_size_in_megabytes
  default_message_ttl                     = each.value.default_message_ttl
  duplicate_detection_history_time_window = each.value.duplicate_detection_history_time_window
  max_delivery_count                      = each.value.max_delivery_count
  lock_duration                           = each.value.lock_duration

  # Features
  batched_operations_enabled           = each.value.enable_batched_operations
  express_enabled                      = each.value.enable_express
  partitioning_enabled                 = each.value.enable_partitioning
  requires_duplicate_detection         = each.value.requires_duplicate_detection
  requires_session                     = each.value.requires_session
  dead_lettering_on_message_expiration = each.value.dead_lettering_on_message_expiration

  # Auto-delete
  auto_delete_on_idle = each.value.auto_delete_on_idle

  # Forward to queue/topic
  forward_to                        = each.value.forward_to
  forward_dead_lettered_messages_to = each.value.forward_dead_lettered_messages_to
}

# Service Bus Topics
resource "azurerm_servicebus_topic" "this" {
  for_each = var.create_service_bus ? { for topic in var.service_bus_topics : topic.name => topic } : {}

  name         = each.value.name
  namespace_id = azurerm_servicebus_namespace.this[0].id

  # Topic settings
  max_size_in_megabytes                   = each.value.max_size_in_megabytes
  default_message_ttl                     = each.value.default_message_ttl
  duplicate_detection_history_time_window = each.value.duplicate_detection_history_time_window

  # Features
  batched_operations_enabled   = each.value.enable_batched_operations
  express_enabled              = each.value.enable_express
  partitioning_enabled         = each.value.enable_partitioning
  requires_duplicate_detection = each.value.requires_duplicate_detection
  support_ordering             = each.value.support_ordering

  # Auto-delete
  auto_delete_on_idle = each.value.auto_delete_on_idle
}

# Service Bus Topic Subscriptions
resource "azurerm_servicebus_subscription" "this" {
  for_each = var.create_service_bus ? {
    for sub in local.topic_subscriptions : "${sub.topic_name}-${sub.name}" => sub
  } : {}

  name     = each.value.name
  topic_id = azurerm_servicebus_topic.this[each.value.topic_name].id

  # Subscription settings
  max_delivery_count  = each.value.max_delivery_count
  default_message_ttl = each.value.default_message_ttl
  lock_duration       = each.value.lock_duration

  # Features
  batched_operations_enabled                = each.value.enable_batched_operations
  requires_session                          = each.value.requires_session
  dead_lettering_on_message_expiration      = each.value.dead_lettering_on_message_expiration
  dead_lettering_on_filter_evaluation_error = each.value.dead_lettering_on_filter_evaluation_error

  # Auto-delete
  auto_delete_on_idle = each.value.auto_delete_on_idle

  # Forward to queue/topic
  forward_to                        = each.value.forward_to
  forward_dead_lettered_messages_to = each.value.forward_dead_lettered_messages_to
}

# Service Bus Topic Subscription Rules
resource "azurerm_servicebus_subscription_rule" "this" {
  for_each = var.create_service_bus ? {
    for rule in local.subscription_rules : "${rule.topic_name}-${rule.subscription_name}-${rule.name}" => rule
  } : {}

  name            = each.value.name
  subscription_id = azurerm_servicebus_subscription.this["${each.value.topic_name}-${each.value.subscription_name}"].id
  filter_type     = each.value.filter_type

  # SQL Filter
  sql_filter = each.value.filter_type == "SqlFilter" ? each.value.sql_filter : null

  # Correlation Filter
  dynamic "correlation_filter" {
    for_each = each.value.filter_type == "CorrelationFilter" && each.value.correlation_filter != null ? [each.value.correlation_filter] : []
    content {
      correlation_id      = correlation_filter.value.correlation_id
      message_id          = correlation_filter.value.message_id
      to                  = correlation_filter.value.to
      reply_to            = correlation_filter.value.reply_to
      label               = correlation_filter.value.label
      session_id          = correlation_filter.value.session_id
      reply_to_session_id = correlation_filter.value.reply_to_session_id
      content_type        = correlation_filter.value.content_type
      properties          = correlation_filter.value.properties
    }
  }

  # Action
  action = each.value.action
}

# Authorization Rules for Namespace
resource "azurerm_servicebus_namespace_authorization_rule" "this" {
  for_each = var.create_service_bus ? { for rule in var.service_bus_authorization_rules : rule.name => rule } : {}

  name         = each.value.name
  namespace_id = azurerm_servicebus_namespace.this[0].id

  listen = each.value.listen
  send   = each.value.send
  manage = each.value.manage
}

# Authorization Rules for Queues
resource "azurerm_servicebus_queue_authorization_rule" "this" {
  for_each = var.create_service_bus ? {
    for rule in local.queue_authorization_rules : "${rule.queue_name}-${rule.name}" => rule
  } : {}

  name     = each.value.name
  queue_id = azurerm_servicebus_queue.this[each.value.queue_name].id

  listen = each.value.listen
  send   = each.value.send
  manage = each.value.manage
}

# Authorization Rules for Topics
resource "azurerm_servicebus_topic_authorization_rule" "this" {
  for_each = var.create_service_bus ? {
    for rule in local.topic_authorization_rules : "${rule.topic_name}-${rule.name}" => rule
  } : {}

  name     = each.value.name
  topic_id = azurerm_servicebus_topic.this[each.value.topic_name].id

  listen = each.value.listen
  send   = each.value.send
  manage = each.value.manage
}

# Private Endpoint for Service Bus (Premium tier only)
resource "azurerm_private_endpoint" "service_bus" {
  count               = var.create_service_bus && var.service_bus_sku == "Premium" && var.service_bus_private_endpoint_enabled ? 1 : 0
  name                = "${var.service_bus_namespace_name}-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.service_bus_private_endpoint_subnet_id

  private_service_connection {
    name                           = "${var.service_bus_namespace_name}-psc"
    private_connection_resource_id = azurerm_servicebus_namespace.this[0].id
    subresource_names              = ["namespace"]
    is_manual_connection           = false
  }

  dynamic "private_dns_zone_group" {
    for_each = var.service_bus_private_dns_zone_ids != null ? [1] : []
    content {
      name                 = "servicebus-dns-zone-group"
      private_dns_zone_ids = var.service_bus_private_dns_zone_ids
    }
  }

  tags = var.tags
}

# Locals for flattening complex data structures
locals {
  # Flatten topic subscriptions
  topic_subscriptions = flatten([
    for topic in var.service_bus_topics : [
      for subscription in topic.subscriptions : {
        topic_name                                = topic.name
        name                                      = subscription.name
        max_delivery_count                        = subscription.max_delivery_count
        default_message_ttl                       = subscription.default_message_ttl
        lock_duration                             = subscription.lock_duration
        enable_batched_operations                 = subscription.enable_batched_operations
        requires_session                          = subscription.requires_session
        dead_lettering_on_message_expiration      = subscription.dead_lettering_on_message_expiration
        dead_lettering_on_filter_evaluation_error = subscription.dead_lettering_on_filter_evaluation_error
        auto_delete_on_idle                       = subscription.auto_delete_on_idle
        forward_to                                = subscription.forward_to
        forward_dead_lettered_messages_to         = subscription.forward_dead_lettered_messages_to
      }
    ]
  ])

  # Flatten subscription rules
  subscription_rules = flatten([
    for topic in var.service_bus_topics : [
      for subscription in topic.subscriptions : [
        for rule in subscription.rules : {
          topic_name         = topic.name
          subscription_name  = subscription.name
          name               = rule.name
          filter_type        = rule.filter_type
          sql_filter         = rule.sql_filter
          correlation_filter = rule.correlation_filter
          action             = rule.action
        }
      ]
    ]
  ])

  # Flatten queue authorization rules
  queue_authorization_rules = flatten([
    for queue in var.service_bus_queues : [
      for rule in queue.authorization_rules : {
        queue_name = queue.name
        name       = rule.name
        listen     = rule.listen
        send       = rule.send
        manage     = rule.manage
      }
    ]
  ])

  # Flatten topic authorization rules
  topic_authorization_rules = flatten([
    for topic in var.service_bus_topics : [
      for rule in topic.authorization_rules : {
        topic_name = topic.name
        name       = rule.name
        listen     = rule.listen
        send       = rule.send
        manage     = rule.manage
      }
    ]
  ])
}