variable "repository_id" {
  type = string
}

variable "region" {
  type = string
}

variable "description" {
  type    = string
  default = ""
}

variable "cleanup_older_than_days" {
  description = "この日数より古いイメージを自動削除"
  type        = number
  default     = 5
}

variable "cleanup_keep_count" {
  description = "最低限保持するイメージ数"
  type        = number
  default     = 5
}
