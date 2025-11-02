# BBA Infrastructure Terraform - Enterprise Azure Platform

Enterprise-grade Azure infrastructure modules with CI/CD pipeline, security scanning, and dual-repository architecture for Beyond Bank Australia.

## Architecture Overview

This repository contains core infrastructure modules used across multiple teams at Beyond Bank Australia. It implements a dual-repository architecture for separation of concerns:

### Dual-Repository Strategy
```
┌─────────────────────────────────────┐    ┌─────────────────────────────────────┐
│           BBA-Infra-terraform       │    │           BBA-Infra-Teams           │
│         (Core Modules)              │    │      (Team Configurations)         │
├─────────────────────────────────────┤    ├─────────────────────────────────────┤
│ • Azure Application Platform        │◄──►│ • Lending/Loan Origination         │
│ • Service Bus Module                │    │ • Other Team Environments          │
│ • Generic Tagging System            │    │ • Environment-specific configs     │
│ • Security & Compliance             │    │ • Organizational Tags              │
│ • CI/CD Pipeline                    │    │ • Pipeline with Manual Approval    │
└─────────────────────────────────────┘    └─────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Terraform >= 1.0
- Azure Provider ~> 4.0
- Azure CLI (latest version)
- Azure DevOps with service connections configured

### Basic Usage

```hcl
module "application_platform" {
  source = "../../modules/azure-application-platform"
  
  # Required Variables
  application_name = "loan-origination"
  environment      = "dev"
  location         = "Australia East"
  
  # Resource Configuration
  create_function_app     = true
  create_key_vault       = true
  create_service_bus     = true
  create_monitoring      = true
  
  # Enterprise Tags (Required)
  common_tags = {
    Environment        = "Development"
    Description        = "Loan Origination Platform"
    Department         = "Technology"
    Owner             = "team-lead@beyondbank.com.au"
    Application       = "loan-origination"
    DataClassification = "S2 - Internal"
    Criticality       = "A2 - High"
  }
}
```

### Local Development Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd BBA-Infra-terraform

# 2. Initialize Terraform
cd modules/azure-application-platform  
terraform init -backend=false

# 3. Validate configuration
terraform validate

# 4. Check formatting
terraform fmt -check -recursive .

# 5. Run security scans (optional)
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b ./tools
./tools/trivy config modules/azure-application-platform --severity CRITICAL,HIGH
```

## Custom Resource Naming

The module supports **complete flexibility** in resource naming. You can use custom names for all resources or let the module generate names automatically.

### Using Custom Names

All resources support custom naming via `*_name_custom` variables:

```hcl
module "my_platform" {
  source = "../../modules/azure-application-platform"
  
  application_name = "myapp"
  environment      = "dev"
  
  # Custom Resource Names (Optional)
  resource_group_name_custom          = "rg-teamname-dev"
  storage_account_name_custom         = "stteamnamedev001"
  key_vault_name_custom               = "kv-teamname-dev"
  function_app_name_custom            = "fn-teamname-dev"
  app_service_plan_name_custom        = "asp-teamname-dev"
  app_insights_name_custom            = "appi-teamname-dev"
  service_bus_namespace_name_custom   = "sb-teamname-dev"
  log_analytics_workspace_name_custom = "log-teamname-dev"
  action_group_name_custom            = "ag-teamname-dev"
  dashboard_name_custom               = "dash-teamname-dev"
  
  # Enterprise tags
  common_tags = {
    Environment        = "Development"
    Department         = "Technology"
    Owner             = "team-lead@beyondbank.com.au"
    Application       = "myapp"
    DataClassification = "S2 - Internal"
    Criticality       = "A2 - High"
  }
}
```

### Default Naming (When Custom Names Not Provided)

If you don't provide custom names, the module generates names using this pattern:

| Resource | Default Pattern | Example |
|----------|----------------|---------|
| Resource Group | `rg-{application_name}-{environment}` | `rg-myapp-dev` |
| Storage Account | `st{application_name}{environment}01` + random | `stmyappdev01{random}` |
| Key Vault | `kv-{application_name}-{environment}` | `kv-myapp-dev` |
| Function App | `fn-{application_name}-{environment}` | `fn-myapp-dev` |
| App Service Plan | `asp-{application_name}-{environment}` | `asp-myapp-dev` |
| App Insights | `appi-{application_name}-{environment}` | `appi-myapp-dev` |
| Service Bus | `sb-{application_name}-{environment}` | `sb-myapp-dev` |
| Log Analytics | `log-{application_name}-{environment}` | `log-myapp-dev` |
| Action Group | `ag-{application_name}-{environment}` | `ag-myapp-dev` |
| Dashboard | `dash-{application_name}-{environment}` | `dash-myapp-dev` |

### Mixed Approach

You can mix custom and generated names - only specify custom names for resources that need specific naming:

```hcl
module "my_platform" {
  source = "../../modules/azure-application-platform"
  
  application_name = "myapp"
  environment      = "dev"
  
  # Custom names for important resources only
  resource_group_name_custom = "rg-teamname-dev"
  key_vault_name_custom     = "kv-teamname-dev"
  
  # Other resources will use generated names based on application_name
  
  common_tags = { /* ... */ }
}
```

### Important Notes

- **Storage Account Names**: Must be globally unique, lowercase, alphanumeric only (3-24 chars). Module adds random suffix automatically.
- **All Other Resources**: Follow standard Azure naming conventions (allow hyphens, letters, numbers).
- **Custom Names Override**: When provided, custom names take precedence over generated names.

## Core Modules

### Azure Application Platform
**Location**: `modules/azure-application-platform/`

Comprehensive platform module that includes:

| Component | Description | Security Features |
|-----------|-------------|-------------------|
| **Function App** | Serverless compute platform | Private endpoints, managed identity |
| **Key Vault** | Secrets & certificate management | Network ACLs, default deny policy |
| **Service Bus** | Message queuing & pub/sub | Private endpoints, authorization rules |
| **Storage Account** | Data storage & Terraform state | Encryption, network restrictions |
| **Application Insights** | Monitoring & observability | Secure log aggregation |
| **Monitoring** | Custom dashboards & alerts | Compliance reporting |

### Service Bus Module
**Location**: `modules/azure-application-platform/service-bus/`

Enterprise messaging platform with:
- **Queues**: Point-to-point messaging
- **Topics & Subscriptions**: Publish-subscribe patterns  
- **Private Endpoints**: Secure network connectivity
- **Authorization Rules**: Fine-grained access control

## Enterprise Tagging System

### Generic Tagging Framework

The tagging system supports any department and automatically validates against enterprise standards:

```hcl
# Required tags for all resources
common_tags = {
  Environment        = "Development"    # Development, Test, UAT, Production
  Description        = "Loan Origination Platform"
  Department         = "Technology"     # Technology, Finance, Risk, etc.
  Owner             = "team-lead@beyondbank.com.au"
  Application       = "loan-origination"
  DataClassification = "S2 - Internal"  # S1-S4 or Public - Description
  Criticality       = "A2 - High"        # A1-Critical, A2-High, A3-Medium, Low/Medium/High
}
```

### Validation Rules
- **Environment**: Must be one of: Development, Test, UAT, Production
- **DataClassification**: Must follow format: `S1 - Description`, `S2 - Description`, etc., or `Public - Description`
- **Criticality**: Must follow format: `A1 - Critical`, `A2 - High`, `A3 - Medium`, or `Low/Medium/High - Description`

## Security & Compliance

### Security Standards
- **Zero Trust Architecture**: Default deny with explicit allow lists
- **Encryption**: All data encrypted at rest and in transit
- **Network Security**: Private endpoints, network ACLs
- **Key Vault Security**: Always deny default action with IP/subnet allowlists
- **Service Bus Security**: Private endpoints, authorization rules
- **Identity Management**: Managed identities, RBAC

### Security Scanning
- **Trivy**: Infrastructure security scanning (CRITICAL/HIGH severity fails pipeline)
- **TFSec**: Terraform static analysis with security best practices
- **Azure Policy**: Compliance monitoring and enforcement

### Compliance Features
- **Tagging Enforcement**: Automatic validation of enterprise tagging standards
- **Audit Logging**: Comprehensive logging for compliance reporting  
- **Access Controls**: Role-based access with principle of least privilege
- **Data Protection**: Encryption, backup, and retention policies

## CI/CD Pipeline

### Pipeline Architecture
The repository includes a comprehensive CI/CD pipeline with 4 stages:

```yaml
1. Module Validation    # Terraform validate, syntax checks
2. Code Quality         # Formatting, configuration validation  
3. Security Scanning    # Trivy (CRITICAL/HIGH fails), TFSec analysis
4. Pipeline Summary     # Overall status reporting
```

### Pipeline Features
- **Strict Validation**: Pipeline fails on validation errors or critical security issues
- **Fast Execution**: ~2-3 minutes (no authentication timeouts)
- **Security First**: Automatic security scanning with failure policies
- **Comprehensive Reporting**: Detailed success/failure reporting

## Repository Structure

```
BBA-Infra-terraform/
├── modules/
│   └── azure-application-platform/     # Core platform module
│       ├── main.tf                     # Main resources
│       ├── variables.tf                 # Input variables  
│       ├── outputs.tf                  # Output values
│       ├── locals.tf                   # Local computations
│       ├── providers.tf                # Provider configuration
│       └── service-bus/                # Service Bus submodule
│           ├── main.tf                 # Service Bus resources
│           ├── variables.tf            # Service Bus variables
│           └── outputs.tf               # Service Bus outputs
├── azure-pipelines.yml                 # CI/CD pipeline
├── backend-config-template.tf          # Terraform backend template
└── README.md                           # This file
```

## Available Variables

### Core Configuration
- `application_name` - Used for generated resource names (required)
- `environment` - Environment name: dev, uat, or prod (required)
- `location` - Azure region (default: "Australia East")

### Resource Creation Flags
- `create_resource_group` - Create resource group (default: true)
- `create_storage_account` - Create storage account (default: true)
- `create_key_vault` - Create key vault (default: true)
- `create_function_app` - Create function app (default: true)
- `create_app_insights` - Create application insights (default: true)
- `create_service_bus` - Create service bus (default: false)
- `create_monitoring` - Create monitoring resources (default: true)
- `create_dashboard` - Create Azure dashboard (default: true)

### Custom Resource Names (All Optional)
- `resource_group_name_custom` - Custom resource group name
- `storage_account_name_custom` - Custom storage account name
- `key_vault_name_custom` - Custom key vault name
- `function_app_name_custom` - Custom function app name
- `app_service_plan_name_custom` - Custom app service plan name
- `app_insights_name_custom` - Custom application insights name
- `service_bus_namespace_name_custom` - Custom service bus namespace name
- `log_analytics_workspace_name_custom` - Custom Log Analytics workspace name
- `action_group_name_custom` - Custom action group name
- `dashboard_name_custom` - Custom dashboard name

### Enterprise Tags (Required)
- `common_tags` - Map of enterprise tags (see Enterprise Tagging System section)

## Outputs

The module provides outputs for all created resources:
- `resource_group_name` - Name of the resource group
- `storage_account_name` - Name of the storage account
- `key_vault_name` - Name of the key vault
- `function_app_name` - Name of the function app
- `app_insights_name` - Name of the application insights
- `service_bus_namespace_name` - Name of the service bus namespace
- `log_analytics_workspace_name` - Name of the Log Analytics workspace
- And many more...

## Troubleshooting

### Common Issues

#### Pipeline Failures
```bash
# Validation Error
terraform validate
terraform fmt -recursive .

# Security Scan Failure  
trivy config modules/azure-application-platform --severity CRITICAL,HIGH

# Formatting Error
terraform fmt -recursive .
```

#### Module Configuration
```bash
# Missing Variables
# Ensure all required variables are provided

# Provider Version Issues
# Use Azure provider ~> 4.0 for compatibility

# Authentication Issues  
az account show
```

#### Storage Account Name Conflicts
- Storage account names must be globally unique
- The module adds a random suffix to prevent conflicts
- If deployment fails, check for existing storage accounts

#### Key Vault Access Issues
- Ensure service principal has appropriate permissions
- Check Azure AD group memberships
- Verify object IDs are correct

### Debugging Commands

```bash
# Check current Azure context
az account show

# List resources in resource group
az resource list --resource-group rg-<name> --output table

# Test Key Vault access
az keyvault secret list --vault-name kv-<name>

# Check Function App status
az functionapp show --name fn-<name> --resource-group rg-<name>
```

## Contributing

1. **Create Feature Branch**: `git checkout -b feature/description`
2. **Make Changes**: Update modules following enterprise standards
3. **Test Locally**: Run validation and security scans
4. **Update Documentation**: Update README.md for any changes
5. **Submit PR**: Create pull request with detailed description
6. **Pipeline Validation**: Ensure CI/CD pipeline passes all stages

### Development Guidelines
- Follow Terraform best practices
- Update README.md for new features
- Add examples for complex configurations
- Test changes across multiple environments
- Run `terraform fmt -recursive .` before committing

## Support & Contact

- **Team**: Beyond Bank Australia - Technology Infrastructure
- **Repository**: BBA-Infra-terraform
- **Pipeline**: Azure DevOps - Enterprise Project
- **Documentation**: Internal DevOps Knowledge Base

**Security Note**: This repository contains enterprise infrastructure code. Follow all security policies and procedures when working with this codebase.
