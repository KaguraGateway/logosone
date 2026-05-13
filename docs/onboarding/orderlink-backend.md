# orderlink-backend オンボーディングガイド

## 1. サービス概要

`orderlink-backend` は **カフェロゴス** のキッチン向け注文管理バックエンドです。POS（`logoregi-backend`）から注文を受け取り、キッチンスタッフが調理状況をリアルタイムで確認・更新できる仕組みを提供します。

### このサービスが担う責務

- POS からの注文受信（gRPC `PostOrder`）
- 注文・注文アイテムのステータス管理（`NotYet` → `Cooking` → `Cooked` → `Calling` → `Provided`）
- WebSocket 経由でのフロントエンド（`orderlink-frontend`）へのリアルタイム通知
- 提供済み注文履歴の一覧提供（gRPC `ListOrders`）

### 注文状態遷移

```
            OrderItem ステータス
NotYet ──────────────────────────► Cooking ──────────────────────────► Cooked
  │     いずれかのアイテムが           │      全アイテムが
  │     Cooking になったとき           │      Cooked になったとき
  │                                    │
  │ (全アイテムが NotYet に戻った場合)  │ (いずれかのアイテムが
  │ Cooking → NotYet                   │  Cooking に戻った場合)
  │                                    │ Cooked → Cooking
  ▼                                    ▼

Order ステータス（API 経由でも操作可）

NotYet → Cooking → Cooked → Calling → Provided(Served)
                              ↑
                     キッチンスタッフが
                     手動で変更する

※ Provided のみ任意のステータスへ遷移可能（UpdateStatus の特例）
※ それ以外は ±1 ステップの遷移のみ許可
```

**OrderType（注文種別）**

| 値 | 意味 |
|----|------|
| `0 = EatIn` | イートイン（座席あり） |
| `1 = TakeOut` | テイクアウト |

---

## 2. 技術スタック

| カテゴリ | 使用技術 |
|----------|---------|
| 言語 | Go 1.24 |
| Web フレームワーク | Echo v4 |
| gRPC | Connect-Go (`connectrpc.com/connect`) |
| ORM / DB クライアント | uptrace/bun（PostgreSQL） |
| WebSocket | gorilla/websocket |
| Pub/Sub（開発）| Redis Pub/Sub (`redis/go-redis/v9`) |
| Pub/Sub（本番）| GCP Cloud Pub/Sub (`cloud.google.com/go/pubsub`) |
| 依存性注入 | samber/do |
| ID 生成 | ULID (`oklog/ulid/v2`) |
| 時刻処理 | `Code-Hex/synchro`（UTC 固定） |
| エラー処理 | `cockroachdb/errors` |
| エラー監視 | Sentry (`getsentry/sentry-go`) |
| コレクション操作 | `samber/lo` |
| 環境変数 | `joho/godotenv` |
| HTTP/2 | `golang.org/x/net/http2`（H2C） |
| ホットリロード（開発）| air |

---

## 3. ディレクトリ構成（オニオンアーキテクチャ）

```
orderlink-backend/
├── main.go                         # エントリポイント・DI コンテナ構築
├── go.mod / go.sum
├── Dockerfile
├── entrypoint.sh                   # DB init/migrate してから起動
├── .env.example                    # 環境変数テンプレート
├── .air.toml                       # ホットリロード設定（開発用）
│
├── domain/                         # ── ドメイン層（最内層） ──
│   ├── error.go                    # ドメインエラー定義
│   ├── model/
│   │   ├── event.go                # イベント値オブジェクト
│   │   ├── order_ticket.go         # OrderTicket エンティティ
│   │   ├── order/
│   │   │   ├── order.go            # Order エンティティ（集約ルート）
│   │   │   ├── order_status.go     # OrderStatus 列挙
│   │   │   ├── order_status_history.go  # ステータス履歴エンティティ
│   │   │   └── order_type.go       # OrderType 列挙
│   │   └── order_item/
│   │       ├── order_item.go       # OrderItem エンティティ
│   │       └── order_item_status.go # OrderItemStatus 列挙
│   ├── repository/                 # リポジトリ・サービスインターフェース
│   │   ├── order.go                # OrderRepository
│   │   ├── order_item.go           # OrderItemRepository
│   │   ├── order_ticket.go         # OrderTicketRepository / OrderTicketService
│   │   ├── s2c_pub.go              # SrvToClientPubService（サーバー→クライアント）
│   │   ├── s2s_pubsub.go           # SrvToSrvPubSubService（サーバー間）
│   │   └── tx.go                   # TxRepository（トランザクション）
│   └── service/
│       └── order.go                # OrderDomainService（現状は空）
│
├── application/                    # ── アプリケーション層 ──
│   ├── const.go                    # CtxTimeoutDur = 10s
│   ├── error.go                    # アプリケーションエラー定義
│   ├── query_service.go            # OrderQueryService インターフェース + OrderDto
│   ├── get_orders.go               # GetOrders ユースケース
│   ├── list_orders.go              # ListOrders ユースケース
│   ├── post_order_from_pos.go      # PostOrderFromPos ユースケース
│   ├── update_order_status.go      # UpdateOrderStatus ユースケース
│   ├── update_order_item_status.go # UpdateOrderItemStatus ユースケース
│   ├── on_receive_order.go         # OnReceiveOrder ユースケース（Pub/Sub 受信後処理）
│   ├── on_updated_order_status.go  # OnUpdatedOrderStatus ユースケース（Pub/Sub 受信後処理）
│   └── on_updated_order_item_status.go # OnUpdatedOrderItemStatus ユースケース
│
├── infra/                          # ── インフラ層 ──
│   ├── bundb/
│   │   ├── dao/                    # DB マッピング用 DAO 構造体
│   │   │   ├── order.go
│   │   │   ├── order_item.go
│   │   │   ├── order_status_history.go
│   │   │   └── order_ticket.go
│   │   ├── order.go                # OrderRepository + OrderQueryService の実装
│   │   ├── order_item.go           # OrderItemRepository の実装
│   │   ├── order_ticket.go         # OrderTicketRepository の実装
│   │   ├── s2s_pubsub.go           # PostgreSQL LISTEN/NOTIFY を使った PubSub（参考実装）
│   │   └── tx.go                   # TxRepository（bun.RunInTx）の実装
│   ├── goredis/
│   │   └── s2s_pubsub.go           # Redis Pub/Sub 実装（開発環境）
│   ├── gcp/
│   │   └── s2s_pubsub.go           # GCP Cloud Pub/Sub 実装（本番環境）
│   └── websocket/
│       └── s2c_pubsub.go           # WebSocket による Server→Client Publish 実装
│
├── presentation/                   # ── プレゼンテーション層 ──
│   ├── grpc_server/
│   │   ├── server.go               # GrpcServer 構造体
│   │   ├── post_order_from_pos.go  # PostOrder ハンドラ
│   │   └── list_orders.go          # ListOrders ハンドラ
│   ├── http_server/
│   │   ├── routes.go               # ルート登録（GET / → WebSocket）
│   │   ├── ws_receiver.go          # WebSocket 受信・イベントルーティング
│   │   ├── ws_time_signal.go       # 1 秒ごとの TimeSignal 送信 goroutine
│   │   ├── get_orders.go           # GetOrders WebSocket ハンドラ
│   │   ├── update_order_status.go  # UpdateOrderStatus WebSocket ハンドラ
│   │   ├── update_order_item_status.go # UpdateOrderItemStatus WebSocket ハンドラ
│   │   ├── event.go                # EventOutput 型・変換ヘルパー
│   │   └── error.go                # プレゼン層エラー定義
│   └── pubsub/
│       ├── receiver.go             # PubSubReceiver（トピック購読登録）
│       ├── on_receive_order.go     # "NewOrder" トピック受信ハンドラ
│       ├── on_updated_order_status.go   # "UpdatedOrderStatus" トピック受信ハンドラ
│       └── on_updated_order_item_status.go # "UpdatedOrderItemStatus" トピック受信ハンドラ
│
└── cmd/bin/
    ├── main.go                     # マイグレーション CLI エントリポイント
    └── migrations/
        ├── main.go                 # Migrations 変数定義
        ├── 20230920150302_init.go  # orders / order_items / order_tickets テーブル作成
        └── 20260205151600_order_history_status.go # order_status_histories テーブル作成
```

### 各レイヤーの役割

| レイヤー | 役割 | 依存方向 |
|----------|------|---------|
| `domain/` | ビジネスルール・エンティティ・インターフェース定義。外部技術に一切依存しない | なし（最内層） |
| `application/` | ユースケースのオーケストレーション。ドメインオブジェクトを操作し、リポジトリを呼ぶ | domain のみ |
| `infra/` | DB・Redis・GCP・WebSocket の具体的な実装 | domain, application |
| `presentation/` | gRPC ハンドラ・WebSocket ハンドラ。入力を application 層へ渡す | application, domain |

---

## 4. ドメインモデル一覧

### Order（注文 / 集約ルート）

```go
type Order struct {
    id                 string
    orderItems         []OrderItem
    orderStatusHistory []OrderStatusHistory
    orderAt            synchro.Time[tz.UTC]
    orderType          OrderType            // EatIn(0) / TakeOut(1)
    status             OrderStatus
    seatName           *string
}
```

- `UpdateStatus(status)` を呼ぶと `±1 ステップ`（または `Provided` への遷移）のみ許可。違反時は `ErrCantOperationOrderStatus`。
- ステータス更新のたびに `OrderStatusHistory` を自動追記。

### OrderItem（注文アイテム）

```go
type OrderItem struct {
    id           string   // ULID
    orderId      string
    productId    string
    coffeeBrewId *string  // コーヒー抽出方法ID（任意）
    status       OrderItemStatus  // NotYet(0) / Cooking(1) / Cooked(2)
}
```

- LogoREGI と異なり、**1 ドメインオブジェクト = 1 個**。数量分だけオブジェクトを生成する。

### OrderStatusHistory（注文ステータス履歴）

```go
type OrderStatusHistory struct {
    id        string
    status    OrderStatus
    createdAt synchro.Time[tz.UTC]
}
```

### OrderTicket（チケット紐付け）

```go
type OrderTicket struct {
    orderId    string
    ticketId   string
    ticketAddr string  // ticket-backend のアドレス
}
```

### Event（Pub/Sub イベント）

```go
type Event struct {
    topic   string
    message interface{}
}
```

Pub/Sub で送受信するメッセージのラッパー。`topic` がルーティングキーになる。

---

## 5. ユースケース一覧

### コマンド系（書き込み）

| ユースケース | ファイル | 説明 |
|-------------|---------|------|
| `PostOrderFromPos` | `application/post_order_from_pos.go` | POS から注文を受信・保存。トランザクション内で Order / OrderItem / OrderTicket を保存後、`NewOrder` イベントを S2S Pub/Sub で発行 |
| `UpdateOrderStatus` | `application/update_order_status.go` | 注文全体のステータスを更新（`NotYet`, `Cooking` への変更は禁止）。更新後 `UpdatedOrderStatus` を S2S Pub/Sub で発行 |
| `UpdateOrderItemStatus` | `application/update_order_item_status.go` | 個別アイテムのステータスを更新。アイテム状況に応じて Order のステータスも自動遷移。`UpdatedOrderItemStatus` と（必要なら）`UpdatedOrderStatus` を S2S Pub/Sub で発行 |

### クエリ系（読み取り）

| ユースケース | ファイル | 説明 |
|-------------|---------|------|
| `GetOrders` | `application/get_orders.go` | 注文一覧取得。`Status` フィルタ付きまたは「未提供のみ」で取得（`OrderQueryService` 経由） |
| `ListOrders` | `application/list_orders.go` | 全注文を取得し、`served_at` (= 最後に `Provided` になった `OrderStatusHistory.CreatedAt`) を付加して返す |

### イベント受信系（Pub/Sub トリガー）

| ユースケース | ファイル | 説明 |
|-------------|---------|------|
| `OnReceiveOrder` | `application/on_receive_order.go` | `NewOrder` トピック受信時に注文を DB から取得し、WebSocket クライアントへ通知 |
| `OnUpdatedOrderStatus` | `application/on_updated_order_status.go` | `UpdatedOrderStatus` トピック受信時に注文ステータスを WebSocket クライアントへ通知 |
| `OnUpdatedOrderItemStatus` | `application/on_updated_order_item_status.go` | `UpdatedOrderItemStatus` トピック受信時にアイテムステータスを WebSocket クライアントへ通知 |

---

## 6. API エンドポイント

### gRPC（Connect-Go）

プロトコルは **Connect** プロトコル（HTTP/2 H2C）。`POST /orderlink.OrderLinkService/*` のパスで受け付ける。

| RPC | メソッド | 説明 |
|-----|---------|------|
| `PostOrder` | `PostOrderInput` → `Empty` | POS から注文を受信・保存。`logoregi-backend` が呼び出す |
| `ListOrders` | `Empty` → `ListOrdersResponse` | 全注文一覧を返す（`orderlink-frontend` の管理画面向け） |

**PostOrderInput の主なフィールド**

```protobuf
message PostOrderInput {
    string order_id   = 1;
    string order_at   = 2;        // ISO 8601
    repeated PostOrderItemInput items = 3;
    OrderType type    = 4;
    string ticket_id  = 5;
    string ticket_addr = 6;
    string seat_name  = 7;
}

message PostOrderItemInput {
    string product_id     = 1;
    string coffee_brew_id = 2;
    uint32 quantity       = 3;
    bool is_managing_order = 20;  // OrderLink で管理するか
    bool is_ol_kitchen    = 21;   // キッチンモニターに表示するか
}
```

### WebSocket（HTTP）

| パス | 説明 |
|-----|------|
| `GET /` | WebSocket 接続。接続後はイベント駆動で双方向通信 |

WebSocket のメッセージ形式（JSON）:

```json
{
  "Topic": "GetOrders",
  "Message": { ... }
}
```

**クライアントから送信できるトピック**

| Topic | Message 形式 | 説明 |
|-------|-------------|------|
| `GetOrders` | `{ "Status": 0 }` または `{}` | 注文一覧を要求。`Status` 省略時は未提供のみ返す |
| `UpdateOrderStatus` | `{ "Id": "...", "Status": 3 }` | 注文ステータス更新（`Cooked/2` → `Calling/3` など） |
| `UpdateOrderItemStatus` | `{ "Id": "...", "Status": 1 }` | 個別アイテムのステータス更新 |
| `ClientEventLog` | 任意 | クライアントログ（サーバーが標準出力に記録するのみ） |

**サーバーからプッシュされるトピック**

| Topic | Message 形式 | 説明 |
|-------|-------------|------|
| `Orders` | `GetOrdersOutput` | `GetOrders` の応答 |
| `NewOrder` | `NewOrderOutput` | 新規注文到着時 |
| `UpdatedOrderStatus` | `{ "Id": "...", "Status": 3 }` | 注文ステータス変更時 |
| `UpdatedOrderItemStatus` | `{ "Id": "...", "OrderId": "...", "Status": 2 }` | アイテムステータス変更時 |
| `TimeSignal` | Unix タイムスタンプ（秒）| 1 秒ごとに自動送信（時刻同期用） |

---

## 7. Pub/Sub メッセージング

本サービスは 2 種類の Pub/Sub を使い分けています。

### 7-1. S2S（Server-to-Server）Pub/Sub

**複数サーバーインスタンス間の同期**に使用。インターフェースは `repository.SrvToSrvPubSubService`。

```go
type SrvToSrvPubSubService interface {
    Publish(ctx context.Context, event model.Event) error
    Subscribe(ctx context.Context, topic string, f func(ctx context.Context, event model.Event)) error
}
```

| 環境 | 実装 | ファイル |
|------|------|---------|
| 開発（`DEV_MODE=1`）| Redis Pub/Sub | `infra/goredis/s2s_pubsub.go` |
| 本番（`DEV_MODE` 未設定）| GCP Cloud Pub/Sub | `infra/gcp/s2s_pubsub.go` |

**Redis 実装**
- `Publish`: `client.Publish(ctx, topic, id)` を呼ぶ
- `Subscribe`: `client.Subscribe(ctx, topic)` で受信ループ

**GCP Cloud Pub/Sub 実装**
- `Publish`: `topic.Publish(ctx, &pubsub.Message{Data: []byte(id)})` で発行
- `Subscribe`: サブスクリプション名は `{topic}-sub` の命名規則（例: `NewOrder-sub`）

**購読トピックと処理**

| Topic | Payload | 処理 |
|-------|---------|------|
| `NewOrder` | `orderId`（string）| `OnReceiveOrder` → DB から注文を取得 → WebSocket で `NewOrder` イベントを配信 |
| `UpdatedOrderStatus` | `orderId`（string）| `OnUpdatedOrderStatus` → DB から注文を取得 → WebSocket で `UpdatedOrderStatus` を配信 |
| `UpdatedOrderItemStatus` | `itemId`（string）| `OnUpdatedOrderItemStatus` → DB からアイテムを取得 → WebSocket で `UpdatedOrderItemStatus` を配信 |

### 7-2. S2C（Server-to-Client）Pub/Sub

**サーバーから WebSocket クライアントへのブロードキャスト**に使用。インターフェースは `repository.SrvToClientPubService`。

```go
type SrvToClientPubService interface {
    Publish(ctx context.Context, event model.Event) error
}
```

実装は `infra/websocket/s2c_pubsub.go`。接続中の全 WebSocket クライアント（`[]*OrderLinkWSClient`）に対して JSON で書き込む。書き込み失敗時は当該クライアントを自動的にリストから除外する。

`OrderLinkWSClient` は `sync.Mutex` を持つ `SafeWriteJSON` で並行書き込みを安全に処理。

### フロー図

```
logoregi-backend
    │
    │ gRPC PostOrder
    ▼
orderlink-backend (インスタンス A)
    │
    │ 1. DB に保存（トランザクション）
    │ 2. S2S Pub/Sub で "NewOrder" を発行
    ▼
Redis / Cloud Pub/Sub
    │
    │ 全インスタンスが "NewOrder" を受信
    ▼
orderlink-backend (インスタンス A, B, C, ...)
    │
    │ OnReceiveOrder → DB から注文取得
    │ S2C Pub/Sub で "NewOrder" を発行
    ▼
WebSocket クライアント（orderlink-frontend）
```

---

## 8. DB スキーマ / DAO

PostgreSQL の `orderlink` データベースを使用。ORM は `uptrace/bun`。

### テーブル一覧

#### `orders`

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | TEXT PK | ULID |
| `order_type` | UINT | `0=EatIn`, `1=TakeOut` |
| `order_at` | TIMESTAMP | 注文日時（UTC） |
| `status` | UINT | `0=NotYet` ～ `4=Provided` |
| `seat_name` | TEXT nullable | 座席名（EatIn のみ） |

リレーション（bun）:
- `has-many OrderItems` （`id = order_id`）
- `has-many OrderStatusHistories` （`id = order_id`）
- `has-one Ticket` （`id = order_id`）

#### `order_items`

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | TEXT PK | ULID |
| `order_id` | TEXT NOT NULL | orders への外部キー |
| `product_id` | TEXT NOT NULL | 商品 ID（logoregi-backend 参照） |
| `coffee_brew_id` | TEXT nullable | コーヒー抽出方法 ID |
| `status` | UINT NOT NULL | `0=NotYet`, `1=Cooking`, `2=Cooked` |

#### `order_tickets`

| カラム | 型 | 説明 |
|--------|-----|------|
| `order_id` | TEXT PK | orders への外部キー |
| `ticket_id` | TEXT NOT NULL | チケット番号 |
| `ticket_addr` | TEXT NOT NULL | ticket-backend のアドレス |

#### `order_status_histories`

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | TEXT PK | ULID |
| `order_id` | TEXT NOT NULL | orders への外部キー |
| `status` | UINT NOT NULL | ステータス値 |
| `created_at` | TIMESTAMP NOT NULL | ステータスになった日時 |

### Upsert 戦略

- `orders`: `ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`
- `order_items`: `ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`
- `order_tickets`: `INSERT OR IGNORE`（重複は無視）
- `order_status_histories`: 常に INSERT（履歴追記のみ）

### QueryService（CQRS）

読み取り専用の `OrderQueryService` を `application/query_service.go` で定義し、`infra/bundb/order.go` の `orderQueryServiceDb` が実装。クエリの最適化が必要な場合はここに実装を追加する。

---

## 9. 依存性注入の仕組み

`samber/do` ライブラリを使用したシンプルな DI コンテナ（`*do.Injector`）を `main.go` の `buildInjector` 関数で構築する。

### 登録順序（`buildInjector`）

```
1. 外部クライアント
   ├── *bun.DB
   ├── *[]*websocket.OrderLinkWSClient
   ├── *redis.Client
   └── *cloudpubsub.Client

2. リポジトリ実装
   ├── repository.OrderItemRepository     ← bundb.NewOrderItemRepositoryDb
   ├── repository.OrderTicketRepository   ← bundb.NewOrderTicketRepositoryDb
   ├── repository.OrderRepository         ← bundb.NewOrderRepositoryDb
   ├── repository.TxRepository            ← bundb.NewTxRepositoryDb
   ├── repository.SrvToClientPubService   ← websocket.NewServerToClientPubSubWS
   └── repository.SrvToSrvPubSubService
       ├── 本番: gcp.NewServerToServerPubSubCloudPubSub
       └── 開発: goredis.NewServerToServerPubSubRedis

3. QueryService
   └── application.OrderQueryService      ← bundb.NewOrderQueryServiceDb

4. ユースケース
   ├── application.GetOrders
   ├── application.OnReceiveOrder
   ├── application.OnUpdatedOrderItemStatus
   ├── application.OnUpdatedOrderStatus
   ├── application.PostOrderFromPos
   ├── application.UpdateOrderItemStatus
   ├── application.UpdateOrderStatus
   └── application.ListOrders
```

各コンストラクタは `func(i *do.Injector) (InterfaceType, error)` のシグネチャを持ち、`do.MustInvoke[T](i)` で依存を解決する。

### 利用例

```go
// ユースケースの解決
usecase := do.MustInvoke[application.GetOrders](r.i)

// リポジトリの解決（ユースケース内）
orderRepo := do.MustInvoke[repository.OrderRepository](i)
```

---

## 10. マイグレーション

`uptrace/bun/migrate` を使った Go ベースのマイグレーション。

### マイグレーションファイル

| ファイル | 内容 |
|---------|------|
| `20230920150302_init.go` | `orders`, `order_items`, `order_tickets` テーブル作成 |
| `20260205151600_order_history_status.go` | `order_status_histories` テーブル作成 |

### マイグレーションコマンド

```bash
# DB 初期化（初回のみ。bun_migrations テーブルを作成）
go run ./cmd/bin/main.go db init

# マイグレーション適用
go run ./cmd/bin/main.go db migrate

# 新しいマイグレーションファイル生成
go run ./cmd/bin/main.go db create <name>
```

Docker 本番環境では `entrypoint.sh` が起動時に自動的に `db init` と `db migrate` を実行する。

---

## 11. 開発時の起動方法

### 前提条件

- Docker / Docker Compose
- [aqua](https://aquaproj.github.io/) インストール済み
- `direnv` 設定済み

### 手順

```bash
# 1. リポジトリルートで依存インフラを起動
docker compose up -d db redis ticket-backend

# 2. DB 初期化（初回のみ）
task init:orderlink
# または直接:
# DATABASE_URL=postgres://postgres:password@localhost/orderlink?sslmode=disable \
#   go run ./cmd/bin/main.go db init

# 3. マイグレーション適用
task migrate:orderlink

# 4. ホットリロードで起動（.air.toml の設定が使われる）
cd orderlink-backend
aqua exec air
# または全サービス一括起動:
# task dev
```

### .air.toml の開発用環境変数

```toml
full_bin = "DATABASE_URL=postgres://postgres:password@localhost/orderlink?sslmode=disable \
  SENTRY_DSN=example PORT=8082 REDIS_URL=localhost:6379 DEV_MODE=1 ./tmp/main"
```

`DEV_MODE=1` が設定されると Redis Pub/Sub が使われる。未設定の場合は GCP Cloud Pub/Sub が使われる（本番）。

---

## 12. 環境変数

`.env.example` を参照。`.env` ファイルを作成するか、環境変数として設定する。

| 変数名 | 必須 | 説明 | 開発時の例 |
|--------|------|------|-----------|
| `DATABASE_URL` | 必須 | PostgreSQL 接続 DSN | `postgres://postgres:password@localhost/orderlink?sslmode=disable` |
| `REDIS_URL` | 必須 | Redis 接続先（ホスト:ポート）| `localhost:6379` |
| `PORT` | 必須 | HTTP サーバーのリッスンポート | `8082` |
| `GCP_PROJECT_ID` | 本番のみ | GCP プロジェクト ID（Cloud Pub/Sub 用）| `my-gcp-project` |
| `SENTRY_DSN` | 任意 | Sentry DSN（設定されない場合は Sentry を無効化）| `https://...@sentry.io/...` |
| `DEV_MODE` | 開発時 | 設定されていれば開発モード（Redis Pub/Sub を使用）| `1` |

### 環境変数のバリデーション

起動時（`main.go`）に以下のチェックが行われる。未設定の場合は `log.Fatalf` でプロセスが終了する。

```go
if _, ok := os.LookupEnv("DATABASE_URL"); !ok {
    log.Fatalf("DATABASE_URL is not set")
}
if _, ok := os.LookupEnv("REDIS_URL"); !ok {
    log.Fatalf("REDIS_URL is not set")
}
```

---

## 13. 主要な設計上の注意点

### OrderItem は数量分だけオブジェクトを生成する

`PostOrderFromPos` ユースケースでは `Quantity` の分だけ `NewOrderItem` を繰り返し呼び出す。これは LogoREGI の実装と異なる点。

### `IsManagingOrder` / `IsOlUseKitchen` フラグ

- `IsManagingOrder=false` のアイテムは OrderLink で管理しないためスキップされる
- `IsOlUseKitchen=false` のアイテムはキッチン不要とみなされ、初期ステータスが `Cooked` になる

### S2S Pub/Sub の切り替え

`main.go` の `buildInjector` で `isDev` フラグにより実装を切り替える。新しい Pub/Sub 実装を追加する場合は `domain/repository/s2s_pubsub.go` のインターフェースを実装し、`buildInjector` で登録する。

### WebSocket クライアントのスレッドセーフ性

`OrderLinkWSClient` は内部に `sync.Mutex` を持つ `SafeWriteJSON` を使用する。TimeSignal goroutine とユースケースからの並行書き込みがあるため、直接 `conn.WriteJSON` は呼ばないこと。

### ListOrders の `served_at`

`served_at` は `order_status_histories` から `status = Provided` の最新 `created_at` を取得する実装。現時点では `TicketId` / `TicketAddr` の返却は TODO（空文字列を返す）。
