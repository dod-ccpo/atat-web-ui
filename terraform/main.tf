resource "azurerm_resource_group" "spa_resoure_group" {
  name     = "${var.application_name}-${terraform.workspace}-spa"
  location = var.resource_region
}

resource "azurerm_storage_account" "spa_storage_account" {
  name                      = "${var.application_name}${terraform.workspace}"
  resource_group_name       = azurerm_resource_group.spa_resoure_group.name
  location                  = azurerm_resource_group.spa_resoure_group.location
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "GRS"
  enable_https_traffic_only = true
  min_tls_version           = "TLS1_2"

  static_website {
    index_document = "index.html"
  }
}