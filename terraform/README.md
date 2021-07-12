# ATAT Deployment Infrastructure

This directory contains the Terraform code necessary to deploy the ATAT Web UI
to an Azure Storage Account and to make it available using Azure Static
Websites.

## Prerequisites

The following resources must be created prior to running this Terraform:

 - a persistent storage account in which to store the state must exist
 - a sufficiently-permissioned role must exist and the credentials must be saved
   as secrets on this repository

All subsequent steps are going to assume that these are both configured.

## Deploying

### Terraform Init

You will need the name of the storage account where state will be stored as well as the
resource group that the storage account is in. Those will be called `$AZURE_STORAGE_ACCOUNT` and
`$AZURE_STORAGE_RESOURCE_GROUP` respectively in any subsequent steps.

```
terraform init -backend-config=resource_group_name=$AZURE_STORAGE_RESOURCE_GROUP -backend-config=storage_account_name=$AZURE_STORAGE_ACCOUNT
```

### Create Terraform workspace

The Terraform here expects that you are using a Terraform workspace, for which the name of the
workspaces matches the name of the environment that is being deployed to. Wherever this may be
relevant subsequently, it will be referred to as `$WORKSPACE_NAME`. Typical examples will likely
be something like `dev`, `test`, or `staging`.

```
terraform workspace new $WORKSPACE_NAME
```

### Plan and Apply

It should be fairly trivial at this point to go ahead and plan and apply. So as the typical
steps would be:

```
terraform plan -out "deploy-$WORKSPACE_NAME.tfplan"
```

Verify that the plan is acceptable and then run with:

```
terraform apply "deploy-$WORKSPACE_NAME.tfplan"
```

The storage account for the SPA for the environment should now be created. And the state file
should be in the persistent state storage account.
