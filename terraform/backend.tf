provider "azurerm" {
    features {
      
    }
}

terraform {
  required_version = ">= 1.0"

  backend "azurerm" {
    container_name       = "tf-spa"
    key                  = "terraform.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.65.0, <3.0.0"
    }
  }
}