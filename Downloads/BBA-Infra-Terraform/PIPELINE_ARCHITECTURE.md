# Pipeline Architecture

## Overview
This repository contains two separate pipelines with distinct purposes:

### 1. **azure-pipelines.yml** - Module Validation Pipeline
**Location:** `BBA-Infra-terraform/azure-pipelines.yml`
**Purpose:** Validates and tests Terraform modules
**Triggers:** Only runs when `modules/**` or `examples/**` change
**Stages:**
- Module Validation
- Code Quality & Formatting
- Security Scanning
- Pipeline Summary

### 2. **azure-teams-pipeline.yml** - Team Deployment Template
**Location:** `BBA-Infra-terraform/azure-teams-pipeline.yml`
**Purpose:** Template containing all deployment stages for team infrastructure
**Triggers:** None (template file - not run directly)
**Usage:** Referenced by `BBA-Infra-Teams/azure-pipelines.yml`

## Pipeline Separation

### Module Changes → Module Pipeline Only
When you modify files in `modules/**` or `examples/**`:
- ✅ `BBA-Infra-terraform/azure-pipelines.yml` runs automatically
- ❌ `BBA-Infra-Teams/azure-pipelines.yml` does NOT run

### Team Config Changes → Team Pipeline Only
When you modify team configurations in `BBA-Infra-Teams/lending/**`:
- ✅ `BBA-Infra-Teams/azure-pipelines.yml` runs automatically
- ❌ `BBA-Infra-terraform/azure-pipelines.yml` does NOT run

## Team Pipeline Structure

### BBA-Infra-Teams/azure-pipelines.yml (Small Wrapper)
This is a thin wrapper pipeline that:
1. Defines triggers (runs on team config changes)
2. Defines parameters (teamName, projectName, environment)
3. Defines variables (deploymentPath, etc.)
4. References the stages template from BBA-Infra-Terraform

```yaml
trigger:
  paths:
    include:
      - lending/**      # Only triggers on team config changes
      
parameters:
  - name: teamName
  - name: projectName
  - name: environment

variables:
  - group: tf-insights
  - name: deploymentPath
    value: '$(System.DefaultWorkingDirectory)/BBA-Infra-Teams/${{ parameters.teamName }}/...'

stages:
  - template: azure-teams-pipeline.yml@BBA-Infra-Terraform
    parameters:
      teamName: ${{ parameters.teamName }}
      projectName: ${{ parameters.projectName }}
      environment: ${{ parameters.environment }}
```

### BBA-Infra-Terraform/azure-teams-pipeline.yml (Template)
This template contains all the deployment stages:
- Resource Import
- Plan
- Security Scan
- Manual Approval
- Deploy
- Post-Deploy Validation

## Benefits

1. **Clear Separation:** Module changes only validate modules, not deploy anything
2. **Reusability:** One deployment template used by all teams
3. **Maintainability:** Deployment logic centralized in one template
4. **Flexibility:** Each team repo can have its own trigger patterns

