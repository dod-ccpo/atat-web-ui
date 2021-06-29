output "spa_web_host" {
  value       = azurerm_storage_account.spa_storage_account.primary_web_host
  description = "The host for the SPA web site"
}

output "spa_web_url" {
  value       = azurerm_storage_account.spa_storage_account.primary_web_endpoint
  description = "The URL where the storage account can be reached"
}

output "spa_account_name" {
    value = azurerm_storage_account.spa_storage_account.name
    description = "The name of the SPA storage account"
}