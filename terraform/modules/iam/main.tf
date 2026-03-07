# Cloud Run 用サービスアカウント
resource "google_service_account" "cloud_run" {
  account_id   = var.cloud_run_sa_name
  display_name = "Cloud Run Service Account"
}

# Cloud Run SA に Cloud SQL クライアント権限
resource "google_project_iam_member" "cloud_run_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run SA に Secret Manager アクセス権限
resource "google_project_iam_member" "cloud_run_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run SA に Cloud Storage アクセス権限
resource "google_project_iam_member" "cloud_run_storage_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Build デフォルト SA に Cloud Run デプロイ権限
resource "google_project_iam_member" "cloudbuild_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${var.cloud_build_sa_email}"
}

# Cloud Build SA に Artifact Registry 書き込み権限
resource "google_project_iam_member" "cloudbuild_ar_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${var.cloud_build_sa_email}"
}

# Cloud Build SA が Cloud Run SA を使用できるようにする
resource "google_service_account_iam_member" "cloudbuild_act_as_run_sa" {
  service_account_id = google_service_account.cloud_run.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${var.cloud_build_sa_email}"
}
