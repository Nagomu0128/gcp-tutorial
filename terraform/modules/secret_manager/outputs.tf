output "secret_ids" {
  description = "Map of secret_id => full resource ID"
  value       = { for k, v in google_secret_manager_secret.this : k => v.id }
}
