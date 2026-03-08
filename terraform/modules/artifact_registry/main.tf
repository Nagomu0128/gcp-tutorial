resource "google_artifact_registry_repository" "docker" {
  repository_id = var.repository_id
  location      = var.region
  format        = "DOCKER"
  description   = var.description

  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "delete-old-images"
    action = "DELETE"

    condition {
      older_than = "${var.cleanup_older_than_days * 24 * 60 * 60}s"
    }
  }

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"

    most_recent_versions {
      keep_count = var.cleanup_keep_count
    }
  }

  vulnerability_scanning_config {
    enablement_config = "DISABLED"
  }
}
