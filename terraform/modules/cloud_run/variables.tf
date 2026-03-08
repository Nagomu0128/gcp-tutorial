variable "service_name" {
  type = string
}

variable "region" {
  type = string
}

variable "image" {
  type    = string
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "cpu" {
  type    = string
  default = "1"
}

variable "memory" {
  type    = string
  default = "512Mi"
}

variable "cpu_allocation" {
  description = "CPU allocation type: 'always' or 'request' (throttled)"
  type        = string
  default     = "always"
}

variable "min_instances" {
  type    = number
  default = 0
}

variable "max_instances" {
  type    = number
  default = 3
}

variable "allow_unauthenticated" {
  type    = bool
  default = true
}

variable "service_account_email" {
  description = "Cloud Run service account email"
  type        = string
  default     = null
}

variable "env_vars" {
  description = "Plain-text environment variables"
  type        = map(string)
  default     = {}
}

variable "secret_env_vars" {
  description = "Environment variables from Secret Manager (name => secret_id)"
  type        = map(string)
  default     = {}
}

variable "cloud_sql_connection_name" {
  description = "Cloud SQL instance connection name"
  type        = string
  default     = null
}
