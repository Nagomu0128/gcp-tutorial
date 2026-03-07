resource "google_secret_manager_secret" "this" {
  for_each = toset(var.secret_ids)

  secret_id = each.key

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "this" {
  for_each = toset(var.secret_ids)

  secret      = google_secret_manager_secret.this[each.key].id
  secret_data = var.secret_data[each.key]
}
