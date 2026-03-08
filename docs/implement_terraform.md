# Terraform によるインフラ構築手順

GCP リソースを Terraform で統一管理するための手順書。
GUI で中途半端に作成したリソースを削除し、Terraform で再構築する手順を含む。

---

## 前提条件

- GCP プロジェクトが作成済みであること
- 請求先アカウントが紐づけ済みであること
- 以下がインストール済みであること:
  - `gcloud` CLI
  - `terraform` (>= 1.5)

---

## Phase 1: 事前準備

### 1-1. gcloud 認証

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project <PROJECT_ID>
```

### 1-2. Cloud Build の GitHub 接続 [GUI]

> OAuth 認証フローが必要なため GUI 必須。

1. Cloud Console → Cloud Build → リポジトリ (第2世代)
2. 「ホスト接続を作成」→ GitHub → リージョン: `asia-northeast2` → 接続名: `gcp-tutorial`
3. GitHub OAuth 認証を完了
4. 接続内で対象リポジトリをリンク

### 1-3. terraform.tfvars の作成

```bash
cd terraform/environments/dev
```

`terraform.tfvars` を作成:

```hcl
project_id     = "<PROJECT_ID>"
project_number = "<PROJECT_NUMBER>"
region         = "asia-northeast2"
service_name   = "gcp-tutorial-service"
db_password    = "<STRONG_PASSWORD>"
```

確認コマンド:

```bash
gcloud config get-value project
gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)'
```

---

## Phase 2: 既存 GUI リソースの削除

> Terraform と名前や設定が異なるリソースが GUI で作成されている場合、先に削除する。
> 該当がなければスキップ。

```bash
# Cloud Run
gcloud run services delete <SERVICE_NAME> --region=asia-northeast2 --quiet

# Cloud Build トリガー
gcloud builds triggers delete <TRIGGER_NAME> --region=asia-northeast2 --quiet

# Artifact Registry（中のイメージも削除される）
gcloud artifacts repositories delete <REPO_NAME> --location=asia-northeast2 --quiet
```

削除確認:

```bash
gcloud run services list --region=asia-northeast2
gcloud builds triggers list --region=asia-northeast2
gcloud artifacts repositories list --location=asia-northeast2
```

> **注意:** Cloud Build の GitHub 接続とリポジトリリンクは削除しない（Terraform 管理外）。

---

## Phase 3: Terraform 実行

### 3-1. 初期化

```bash
cd terraform/environments/dev
terraform init
```

### 3-2. 実行計画の確認

```bash
terraform plan
```

以下のリソースが作成される:

| リソース | 名前 |
|---------|------|
| API 有効化 (6個) | run, cloudbuild, artifactregistry, sqladmin, storage, secretmanager |
| Service Account | `gcp-tutorial-run-dev` |
| IAM バインディング (5個) | cloudsql.client, secretmanager.secretAccessor, storage.objectViewer 等 |
| Secret Manager | `db-password-dev` |
| Artifact Registry | `gcp-tutorial` |
| Cloud SQL | `gcp-tutorial-db-dev` (PostgreSQL 15) |
| Cloud Run | `gcp-tutorial-service-dev` |
| Cloud Build trigger | `gcp-tutorial-deploy-dev` |
| Cloud Storage | `<PROJECT_ID>-gcp-tutorial-assets-dev` |

### 3-3. 適用

```bash
terraform apply
```

`yes` を入力して適用。Cloud SQL の作成に 10〜15 分かかる。

### 3-4. 適用後の確認

```bash
terraform output
```

---

## Phase 4: Terraform State のリモート管理

ローカルの state ファイルを GCS に移行し、チームで共有可能にする。

### 4-1. State 用バケットの作成

> Terraform 自身の state を保存するバケットは循環依存を避けるため gcloud で作成する。

```bash
gcloud storage buckets create gs://<PROJECT_ID>-terraform-state \
  --location=asia-northeast2 \
  --uniform-bucket-level-access
```

### 4-2. backend 設定のコメントイン

`terraform/environments/dev/main.tf` の backend ブロックを有効化:

```hcl
terraform {
  backend "gcs" {
    bucket = "<PROJECT_ID>-terraform-state"
    prefix = "env/dev"
  }
}
```

### 4-3. State の移行

```bash
terraform init -migrate-state
```

`yes` を入力してローカルの state を GCS に移行。

移行確認:

```bash
gcloud storage ls gs://<PROJECT_ID>-terraform-state/env/dev/
```

---

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| `API not enabled` エラー | 数分待ってリトライ |
| Cloud SQL 作成失敗 (同名) | 削除後 1 週間は同名で作成不可。別名を使用 |
| Cloud Build トリガー作成失敗 | Phase 1-2 の GitHub 接続を再確認 |
| 権限エラー | `gcloud auth application-default login` を再実行 |
| `Unsupported block type` | Terraform provider バージョンと設定の互換性を確認 |
