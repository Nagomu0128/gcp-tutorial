variable "project_id" {
  type = string
}

variable "cloud_run_sa_name" {
  description = "Cloud Run サービスアカウントの account_id"
  type        = string
  default     = "cloud-run-sa"
}

variable "cloud_build_sa_email" {
  description = "Cloud Build のサービスアカウント email"
  type        = string
}
