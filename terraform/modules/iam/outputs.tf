output "cloud_run_sa_email" {
  value = google_service_account.cloud_run.email
}

output "cloud_run_sa_name" {
  value = google_service_account.cloud_run.name
}
