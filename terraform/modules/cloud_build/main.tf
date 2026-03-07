resource "google_cloudbuild_trigger" "this" {
  name     = var.trigger_name
  location = var.region

  repository_event_config {
    repository = var.repository_resource

    push {
      branch = var.branch_pattern
    }
  }

  filename        = var.cloudbuild_file
  service_account = var.service_account

  substitutions = var.substitutions
}
