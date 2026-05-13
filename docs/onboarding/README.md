# LogosOne オンボーディングガイド

## プロジェクト概要

LogosOne は **カフェロゴス** 専用の POS システム・注文管理プラットフォームです。
Monorepo 構成で、2 つの主要サブシステム（**LogoREGI** / **OrderLink**）と共通基盤から成ります。

### サービスモード

| モード | 概要 |
|--------|------|
| **EatIn（イートイン）** | 店員がハンディ端末で注文を受け付け、レジで後払い会計 |
| **TakeOut（テイクアウト）** | お客さんがセルフ注文キオスクから注文・前払い会計 |

---

## アーキテクチャ全体像

```
┌─────────────────── フロントエンド ───────────────────┐
│  logoregi-admin  (管理ダッシュボード)     :3000       │
│  logoregi-handy  (店員ハンディ端末)       :3002       │
│  logoregi-togo   (テイクアウト注文)       :3003       │
│  orderlink-frontend (スタッフモニター)    :3001       │
│  orderlink-webcall  (お客様モニター)      :3004       │
└──────────────┬──────────────────┬────────────────────┘
               │ Connect/gRPC    │ WebSocket
┌──────────────▼──────────────────▼────────────────────┐
│  logoregi-backend   (POS コア)            :8080       │
│  orderlink-backend  (注文管理)            :8082       │
│  ticket-backend     (チケット発番)        :8081       │
└──────────────┬──────────────────┬────────────────────┘
               │                  │
        ┌──────▼──────┐    ┌──────▼──────┐
        │ PostgreSQL  │    │    Redis    │
        │  (3 DB)     │    │  Pub/Sub   │
        └─────────────┘    └────────────┘
```

### サービス間通信

- **フロントエンド → バックエンド**: Connect/gRPC (Protocol Buffers)
- **logoregi-backend → orderlink-backend / ticket-backend**: gRPC
- **orderlink-backend → フロントエンド**: WebSocket（リアルタイム注文状態通知）
- **orderlink-backend 内部**: Redis Pub/Sub（開発）/ Cloud Pub/Sub（本番）

---

## 技術スタック

### バックエンド

| サービス | 言語 | 主要ライブラリ |
|----------|------|----------------|
| logoregi-backend | Go 1.24 | connect-go, uptrace/bun, samber/do, Square SDK |
| orderlink-backend | Go 1.24 | connect-go, uptrace/bun, gorilla/websocket, go-redis |
| ticket-backend | Rust | tonic (gRPC), SeaORM, shaku (DI), tokio |

### フロントエンド

| アプリ | フレームワーク | UI ライブラリ | 状態管理 |
|--------|---------------|--------------|----------|
| logoregi-admin | Next.js 14 | Chakra UI v3 | TanStack Query |
| logoregi-handy | Next.js 14 | Chakra UI v2 | jotai |
| logoregi-togo | Next.js 14 | Chakra UI v2 | jotai |
| orderlink-frontend | Next.js 14 | Chakra UI v2 | jotai + WebSocket |
| orderlink-webcall | Vite + React 18 | Chakra UI v3 | jotai + WebSocket |

### インフラ・ツール

- **DB**: PostgreSQL 16（`pos`, `orderlink`, `ticket` の 3 データベース）
- **メッセージング**: Redis 7（開発）/ Cloud Pub/Sub（本番）
- **コンテナ**: Docker Compose
- **本番**: Cloud Run (GCP)
- **パッケージマネージャ**: Bun（フロントエンド）, Go Modules（バックエンド）
- **タスクランナー**: Taskfile
- **ツールバージョン管理**: aqua
- **Proto 生成**: buf（Go / TypeScript / Swift コード生成）
- **ホットリロード**: air（Go バックエンド）

---

## ディレクトリ構成

```
logosone/
├── proto/                    # Protocol Buffers 定義 + 生成コード
│   ├── proto/                #   .proto ファイル (pos, orderlink, ticket, common)
│   ├── pkg/                  #   生成された Go コード
│   ├── scripts/              #   生成された TypeScript コード
│   └── Sources/              #   生成された Swift コード
│
├── logoregi-backend/         # POS コアバックエンド (Go)
├── orderlink-backend/        # 注文管理バックエンド (Go)
├── ticket-backend/           # チケット発番バックエンド (Rust)
│
├── logoregi-admin/           # 管理ダッシュボード (Next.js)
├── logoregi-handy/           # 店員ハンディ端末 (Next.js)
├── logoregi-togo/            # テイクアウト注文 (Next.js)
├── orderlink-frontend/       # スタッフ注文モニター (Next.js)
├── orderlink-webcall/        # お客様注文モニター (Vite+React)
│
├── compose.yml               # Docker Compose (開発)
├── compose.prod.yml          # Docker Compose (本番)
├── Taskfile.yml              # 開発タスク定義
├── aqua.yaml                 # ツールバージョン管理
├── package.json              # Bun ワークスペースルート
├── Package.swift             # iOS/macOS 向け Swift パッケージ
└── init/postgres/            # DB 初期化 SQL
```

### バックエンドのレイヤー構造（共通）

各 Go バックエンドはオニオンアーキテクチャ / DDD に準拠:

```
*-backend/
├── domain/
│   ├── model/          # エンティティ・値オブジェクト
│   ├── repository/     # リポジトリインターフェース
│   ├── domain_event/   # ドメインイベント
│   └── domain_service/ # ドメインサービス
├── application/        # ユースケース (CQRS: Command / Query 分離)
├── infra/
│   ├── bundb/          # DB リポジトリ実装 + DAO
│   ├── square/         # Square Terminal 連携 (logoregi のみ)
│   └── ...             # 外部サービスクライアント
└── presentation/
    ├── grpc_server/    # Connect-Go gRPC ハンドラ
    └── http_server/    # HTTP ハンドラ (Webhook 等)
```

---

## 開発環境セットアップ

### 前提条件

- Docker / Docker Compose
- [aqua](https://aquaproj.github.io/)（ツールバージョン管理）
- direnv（環境変数の自動読み込み）

### 手順

```bash
# 1. aqua でツール一式をインストール（Go, Bun, air, task 等）
aqua install -l

# 2. direnv を許可（aqua の PATH 設定が読み込まれる）
direnv allow

# 3. フロントエンドの依存関係をインストール
bun install

# 4. Docker コンテナ起動 + DB 初期化
docker compose up -d db redis ticket-backend
task init

# 5. 全サービス一括起動
task dev
```

### ポート一覧

| ポート | サービス |
|--------|----------|
| 3000 | logoregi-admin |
| 3001 | orderlink-frontend |
| 3002 | logoregi-handy |
| 3003 | logoregi-togo |
| 3004 | orderlink-webcall |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8080 | logoregi-backend |
| 8081 | ticket-backend |
| 8082 | orderlink-backend |

### 主要タスクコマンド

```bash
task dev              # 全サービス起動（Docker + バックエンド + フロントエンド）
task init             # DB マイグレーション（初回）
task migrate          # DB マイグレーション（差分適用）
task psql             # PostgreSQL CLI に接続
```

---

## Proto（API 定義）の開発フロー

API は Protocol Buffers で定義され、`buf` で Go / TypeScript / Swift コードを自動生成します。

```bash
cd proto

# Go ツールのパスを通す
export PATH="$PATH:$(go env GOPATH)/bin"

# コード生成
bun run generate
```

### 主な .proto ファイル

| ファイル | 内容 |
|----------|------|
| `proto/pos/pos_service.proto` | POS サービス（注文・会計・商品・在庫・座席・割引・売上分析） |
| `proto/orderlink/orderlink_service.proto` | 注文管理サービス（注文受付・一覧取得） |
| `proto/ticket/*.proto` | チケット発番サービス |
| `proto/common/common.proto` | 共通型定義 |

---

## ドメインモデル概要

### 商品 (Product)

2 種類の商品タイプ:
- **Coffee**: `CoffeeBean`（豆）+ `CoffeeBrews[]`（抽出方法・価格）
- **Other**: 固定価格 `amount` + `Stock`（在庫）

フラグ:
- `IsManagingOrder`: OrderLink で注文管理するか
- `IsOlUseKitchen`: キッチンモニターに表示するか

### 注文 (Order)

- `OrderItem[]` + `Discount[]`
- `OrderType`: EatIn / TakeOut
- EatIn の場合は `seatId` と `clientId` を持つ

### 決済 (Payment)

- `Cash`: 現金支払い
- `External`: Square Terminal 連携
- `receiveAmount`, `paymentAmount`, `changeAmount` を追跡

### OrderLink 注文状態

```
NotYet → Cooking → Cooked → Calling → Served
```

---

## 設計原則・コーディング規約

### バックエンド (Go)

- **オニオンアーキテクチャ / DDD**: ドメイン層を中心に、依存方向は外→内
- **CQRS**: 書き込み（Repository）と読み取り（QueryService）の責務分離
- **依存性注入**: `samber/do` ライブラリ
- **リポジトリパターン**: ドメインモデルのみを扱い、永続化詳細を隠蔽
- **ドメインイベント**: サービス間の疎結合を実現
- **時間処理**: `synchro` ライブラリで UTC 固定

### フロントエンド (TypeScript)

- **関数コンポーネント** + TypeScript で型安全性を確保
- **connect-query** で gRPC バックエンドと通信
- **jotai** / **TanStack Query** で状態管理
- **any 禁止**: `unknown` を使用してから型を絞り込む
- **Result 型** (`neverthrow`) でエラーを明示的に処理
- **アダプターパターン** で外部依存を抽象化
- **ESLint / Prettier** 標準ルールに準拠

### 共通

- 単一責任の原則
- テスト駆動開発（Red → Green → Refactor）
- 早期リターンで条件分岐をフラット化
- 過度な抽象化を避ける

---

## CI/CD

- **GitHub Actions**:
  - `biome-lint.yml`: orderlink-frontend の Lint チェック
  - `pr-agent-review.yaml`: AI による自動 PR レビュー
- **本番デプロイ**: Docker イメージを Cloud Run にデプロイ
  - Next.js は `output: "standalone"` でビルド
  - orderlink-backend は本番で Cloud Pub/Sub に切り替え（環境変数で制御）

---

## 関連ドキュメント

| ファイル | 内容 |
|----------|------|
| `.clinerules` | アーキテクチャ・コーディング規約の詳細（日本語） |
| `logoregi-backend/README.md` | バックエンド概要 |
| `ticket-backend/README.md` | Rust バックエンドのセットアップ・マイグレーション |
| `orderlink-frontend/README.md` | フロントエンドクイックスタート |
| `proto/README.md` | Proto 生成手順 |
