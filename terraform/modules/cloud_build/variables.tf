variable "trigger_name" {
  type = string
}

variable "region" {
  type = string
}

variable "repository_resource" {
  description = "Full resource name of the Cloud Build Gen 2 repository connection"
  type        = string
}

variable "branch_pattern" {
  type    = string
  default = "^main$"
}

variable "cloudbuild_file" {
  type    = string
  default = "cloudbuild.yaml"
}

variable "service_account" {
  description = "Service account for Cloud Build trigger (full resource name)"
  type        = string
  default     = null
}

variable "substitutions" {
  type    = map(string)
  default = {}
}
