variable "secret_ids" {
  description = "List of secret IDs to create"
  type        = list(string)
}

variable "secret_data" {
  description = "Map of secret_id => secret_value"
  type        = map(string)
  sensitive   = true
}

variable "region" {
  type = string
}
