# Azure Application Insights
resource "azurerm_application_insights" "main" {
  count               = var.create_app_insights ? 1 : 0
  name                = var.app_insights_name != null ? var.app_insights_name : local.resource_names.app_insights
  location            = local.resource_group_location
  resource_group_name = local.resource_group_name
  application_type    = var.app_insights_application_type
  retention_in_days   = var.app_insights_retention_in_days

  tags = local.resource_specific_tags.app_insights

  lifecycle {
    prevent_destroy = true
  }
}

# Application Insights Web Test (optional)
resource "azurerm_application_insights_web_test" "main" {
  count                   = var.create_app_insights && var.create_function_app ? 1 : 0
  name                    = "webtest-${local.resource_names.function_app}"
  location                = local.resource_group_location
  resource_group_name     = local.resource_group_name
  application_insights_id = azurerm_application_insights.main[0].id
  kind                    = "ping"
  frequency               = 300
  timeout                 = 60
  enabled                 = true
  geo_locations           = ["us-tx-sn1-azr", "us-il-ch1-azr"]

  configuration = <<XML
<WebTest Name="WebTest1" Id="ABD48585-0831-40CB-9069-682EA6BB3583" Enabled="True" CssProjectStructure="" CssIteration="" Timeout="0" WorkItemIds="" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010" Description="" CredentialUserName="" CredentialPassword="" PreAuthenticate="True" Proxy="default" StopOnError="False" RecordedResultFile="" ResultsLocale="">
  <Items>
    <Request Method="GET" Guid="a5f10126-e4cd-570d-961c-cea43999a200" Version="1.1" Url="https://${local.resource_names.function_app}.azurewebsites.net" ThinkTime="0" Timeout="300" ParseDependentRequests="True" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" ExpectedResponseUrl="" ReportingName="" IgnoreHttpStatusCode="False" />
  </Items>
</WebTest>
XML

  tags = local.resource_specific_tags.app_insights
}