# ATAT Deployment Infrastructure

This directory contains the Terraform code necessary to deploy the ATAT Web UI
to an Azure Storage Account and to make it available using Azure Static
Websites.

## Prerequisites

The following resources must be created prior to running this Terraform:

 - a persistent storage account in which to store the state must exist
 - a sufficiently-permissioned role must exist and the credentials must be saved
   as secrets on this repository
