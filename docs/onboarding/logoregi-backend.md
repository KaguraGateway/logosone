# logoregi-backend オンボーディングガイド

## サービス概要

`logoregi-backend` は **カフェロゴス専用 POS システム（LogoREGI）のコアバックエンド**です。

主な責務:
- 商品・在庫・コーヒー豆の管理
- 注文の作成・管理・削除
- 会計処理（現金 / Square Terminal 外部決済）
- 座席・クライアント（iPad 端末）管理
- 割引管理
- 売上分析（日別・商品別・時間帯別・支払い方法別）
- OrderLink バックエンドへの注文連携
- Ticket バックエンドへの呼び出し番号発番依頼

### 他サービスとの関係

```
フロントエンド (logoregi-handy / logoregi-togo / logoregi-admin)
        ↓ Connect-Go (gRPC over HTTP/2)
  logoregi-backend  :8080
        ↓ gRPC                   ↓ gRPC                   ↓ REST Webhook (受信)
  ticket-backend :8081    orderlink-backend :8082    Square Terminal API
        ↑
  PostgreSQL (pos DB)
```

---

## 技術スタック

| 種別 | 技術 | バージョン / 詳細 |
|------|------|------------------|
| 言語 | Go | 1.24 |
| DB | PostgreSQL | bun ORM (uptrace/bun) |
| API | Connect-Go | connectrpc.com/connect v1.17.0 |
| Proto 定義 | cafelogos-grpc | KaguraGateway/cafelogos-grpc |
| DI | samber/do | v1.6.0 |
| ユーティリティ | samber/lo | v1.47.0 |
| 時刻型 | Code-Hex/synchro | v0.5.2 (UTC 固定) |
| ID 生成 | oklog/ulid/v2 | v2.1.0 |
| 環境変数 | joho/godotenv | v1.5.1 |
| エラーハンドリング | cockroachdb/errors | v1.11.3 |
| ホットリロード (開発) | air | .air.toml 設定済み |
| デプロイ | Docker / Azure Container Apps | Dockerfile 提供済み |

---

## ディレクトリ構成

```
logoregi-backend/
├── main.go                   # エントリーポイント: DI 構築・サーバー起動
├── Dockerfile                # コンテナビルド定義
├── entrypoint.sh             # DB init/migrate → アプリ起動
├── .air.toml                 # ホットリロード設定
├── .env.example              # 環境変数のサンプル
│
├── domain/                   # ドメイン層（最内層・ビジネスロジックの核）
│   ├── model/                #   エンティティ・値オブジェクト
│   ├── repository/           #   リポジトリインターフェース（I/F のみ・実装なし）
│   ├── domain_event/         #   ドメインイベント定義・ディスパッチャ
│   └── domain_service/       #   複数エンティティにまたがるドメインサービス
│
├── application/              # アプリケーション層（ユースケース）
│   ├── service.go            #   クエリサービスインターフェース
│   ├── sales_query_service.go#   売上分析クエリサービスI/F
│   ├── param.go              #   ユースケース入力パラメータ型定義
│   ├── const.go              #   共通定数 (タイムアウト等)
│   ├── error.go              #   アプリケーション層エラー定義
│   ├── dto/                  #   データ転送オブジェクト
│   └── *.go                  #   各ユースケース実装
│
├── infra/                    # インフラ層（外側の詳細実装）
│   ├── bundb/                #   PostgreSQL リポジトリ実装
│   │   ├── dao/              #     DB テーブルマッピング構造体 (DAO)
│   │   ├── *.go              #     リポジトリ・クエリサービス実装
│   │   └── tx.go             #     トランザクション実装
│   ├── square/               #   Square Terminal API クライアント
│   ├── ticket_server/        #   ticket-backend gRPC クライアント実装
│   └── orderlink_server/     #   orderlink-backend gRPC クライアント実装
│
├── presentation/             # プレゼンテーション層（最外層）
│   ├── grpc_server/          #   Connect-Go gRPC ハンドラ
│   │   ├── server.go         #     GrpcServer 構造体定義
│   │   ├── to.go             #     ドメインモデル ↔ Proto 変換関数
│   │   └── *.go              #     各 RPC メソッドハンドラ
│   └── http_server/          #   HTTP ハンドラ (Square Webhook 受信)
│
└── cmd/                      # CLI コマンド
    └── bin/
        ├── main.go           #   マイグレーション CLI エントリーポイント
        └── migrations/       #   マイグレーションファイル群
```

### オニオンアーキテクチャのレイヤー説明

```
          [presentation]
               ↓ 呼び出し
          [application]
               ↓ 呼び出し
            [domain]
               ↑ 実装 (依存逆転)
            [infra]
```

- **domain 層**: 外部依存ゼロ。ビジネスルールの純粋な表現。
- **application 層**: ユースケースを orchestrate する。domain の repository インターフェースに依存する（実装には依存しない）。
- **infra 層**: domain のインターフェースを実装する。DB・外部 API の詳細を隠蔽。
- **presentation 層**: Proto ↔ ドメインモデルの変換と、ユースケースの呼び出しのみ担当。

---

## ドメインモデル一覧と関連

### エンティティ一覧

| モデル | ファイル | 概要 |
|--------|---------|------|
| `Product` | `domain/model/product.go` | 商品。Coffee / Other の 2 種 |
| `ProductCategory` | `domain/model/product_category.go` | 商品カテゴリ |
| `ProductCoffeeBrew` | `domain/model/product_coffee_brew.go` | コーヒーの抽出方法と価格 |
| `CoffeeBean` | `domain/model/coffee_bean.go` | コーヒー豆 |
| `Stock` | `domain/model/stock.go` | 在庫（Other 商品のみ紐付く） |
| `Order` | `domain/model/order.go` | 注文。OrderItem と Discount を保持 |
| `OrderItem` | `domain/model/order_item.go` | 注文明細（商品 + 数量 + 抽出方法） |
| `OrderDiscount` | `domain/model/order_discount.go` | 注文に適用された割引 |
| `OrderTicket` | `domain/model/order_ticket.go` | 呼び出し番号チケット（ticket-backend から取得） |
| `Payment` | `domain/model/payment.go` | 決済情報（複数注文をまとめて決済可能） |
| `PaymentExternal` | `domain/model/payment_external.go` | Square Terminal 外部決済の状態管理 |
| `Discount` | `domain/model/discount.go` | 割引マスタ |
| `Seat` | `domain/model/seat.go` | 座席 |
| `Client` | `domain/model/client.go` | クライアント端末（iPad 等） |
| `CallNumber` | `domain/model/call_number.go` | 呼び出し番号値オブジェクト |

### 列挙型

| 型 | 値 | 説明 |
|----|----|------|
| `OrderType` | `EatIn(0)`, `TakeOut(1)` | イートイン / テイクアウト |
| `PaymentType` | `Cash(0)`, `External(1)` | 現金 / 外部決済 (Square) |
| `PaymentStatus` | `Pending`, `Success` | 受取金額が不足か否かで決まる |
| `DiscountType` | `Price(0)` | 割引タイプ（現在は固定金額のみ） |
| `ProductType` | `Coffee(0)`, `Other(1)` | 商品タイプ |

### エンティティ関連図

```
ProductCategory ←── Product ──→ CoffeeBean
                        │
                        ├──→ ProductCoffeeBrew[] (Coffee のみ)
                        └──→ Stock              (Other のみ)

Order ──→ OrderItem[] ──→ Product
   │  └──→ OrderDiscount[] ──→ Discount
   │
   ↓ (Order : Payment は order_payments 中間テーブルで多対多)
Payment ──→ PaymentExternal (External 決済時のみ)
   │
OrderTicket (ticket-backend が発番、order_tickets テーブルに保存)

Client ←── Order (clientId で参照)
Seat   ←── Order (seatId で参照)
```

### Product モデルの特記事項

```go
// Coffee タイプ: 価格は CoffeeBrew ごとに設定
type Product struct {
    ProductType     ProductType
    CoffeeBean      *CoffeeBean           // Coffee のみ
    CoffeeBrews     []*ProductCoffeeBrew  // Coffee のみ（各抽出法の価格）
    amount          uint64                 // Other のみ（非公開フィールド）
    Stock           *Stock                 // Other のみ
    IsManagingOrder bool  // OrderLink で注文管理するか
    IsOlUseKitchen  bool  // キッチンモニターに表示するか
}
```

### PaymentExternal のライフサイクル

```
PENDING → IN_PROGRESS → COMPLETED  (決済成功 → PaymentSuccessEvent 発火)
                     └→ CANCELED   (キャンセル)
                     └→ CANCEL_REQUESTED
```

---

## ユースケース一覧

`application/` ディレクトリに各ユースケースが実装されています。

### 商品管理

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `GetProducts` | `application/get_products.go` | 全商品一覧取得 |
| `PostProduct` | `application/post_product.go` | 商品新規作成（Coffee / Other 両対応） |
| `UpdateProduct` | `application/update_product.go` | 商品更新 |
| `DeleteProduct` | `application/delete_product.go` | 商品削除 |
| `GetProductCategories` | `application/get_product_categories.go` | 商品カテゴリ一覧取得 |
| `PostProductCategory` | `application/post_product_category.go` | 商品カテゴリ作成 |
| `GetCoffeeBeans` | `application/get_coffee_beans.go` | コーヒー豆一覧取得 |
| `PostCoffeeBean` | `application/post_coffee_bean.go` | コーヒー豆作成 |

### 在庫管理

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `GetStocks` | `application/get_stocks.go` | 在庫一覧取得 |
| `PostStock` | `application/post_stock.go` | 在庫作成 |
| `UpdateStock` | `application/update_stock.go` | 在庫更新 |

### 注文管理

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `GetOrders` | `application/get_orders.go` | 全注文一覧取得 |
| `GetUnpaidOrdersBySeatId` | `application/get_unpaid_orders_by_seat_id.go` | 指定座席の未払い注文取得 |
| `PostOrder` | `application/post_order.go` | 注文作成（在庫減算・Ticket 発番・OrderLink 連携含む） |
| `DeleteOrder` | `application/delete_order.go` | 注文削除 |

### 会計・決済

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `SavePayment` | `application/save_payment.go` | 決済処理（注文と同時作成も可）。外部決済の場合は Square API 呼び出し |
| `GetExternalPayment` | `application/get_external_payment.go` | 外部決済状態の取得 |

### 座席・クライアント管理

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `GetSeats` | `application/get_seats.go` | 座席一覧取得 |
| `PostSeat` | `application/post_seat.go` | 座席作成 |
| `UpdateSeat` | `application/update_seat.go` | 座席更新 |
| `PostClient` | `application/post_client.go` | クライアント端末登録 |

### 割引管理

| ユースケース | インターフェース / 型 | 処理概要 |
|------------|---------------------|---------|
| `GetDiscounts` | `application/get_discounts.go` | 割引一覧取得 |
| `PostDiscount` | `application/post_discount.go` | 割引作成 |

### 売上分析

| ユースケース | 型 | 処理概要 |
|------------|-----|---------|
| `GetDailySales` | `application/get_daily_sales.go` | 指定期間の日別売上 |
| `GetProductSales` | `application/get_product_sales.go` | 指定期間の商品別売上 |
| `GetSalesByTimeSlot` | `application/get_sales_by_time_slot.go` | 指定日の 30 分単位時間帯別売上 |
| `GetSalesByPaymentType` | `application/get_sales_by_payment_type.go` | 指定期間の支払い方法別売上 |

### PostOrder ユースケースの詳細フロー

`PostOrder` は最も複雑なユースケースの一つです。

```
1. OrderItem ごとに ProductQueryService で商品取得・価格検証
2. コーヒーは CoffeeBrewRepository で抽出方法取得
3. Other 商品は在庫チェック（不足時は ErrProductStockShortage）
4. Discount ごとに DiscountRepository で価格検証
5. [トランザクション開始]
   a. OrderRepository.SaveTx で注文保存
   b. OrderItemRepository.SaveTx で注文明細保存
   c. OrderDiscountRepository.SaveTx で注文割引保存
   d. StockRepository.SaveTx で在庫減算
   e. OrderTicketRepository.Create で ticket-backend に Ticket 発番依頼
   f. IsPostOrderLink=true の場合、OrderHookRepository.PostOrder で orderlink-backend に通知
6. [トランザクション終了]
```

---

## API エンドポイント一覧

### Connect-Go (gRPC) エンドポイント

サービス定義: `posconnect.PosServiceHandler`
マウントパス: `/{posconnect のパス}` (Connect-Go が自動生成)
ポート: `8080`

Proto 定義: `github.com/KaguraGateway/cafelogos-grpc/pkg/pos`

| RPC メソッド | ハンドラファイル | 対応ユースケース |
|-------------|----------------|-----------------|
| `GetProducts` | `get_products.go` | `GetProducts` |
| `PostProduct` | `post_product.go` | `PostProduct` |
| `UpdateProduct` | `update_product.go` | `UpdateProduct` |
| `DeleteProduct` | `delete_product.go` | `DeleteProduct` |
| `GetProductCategories` | `get_product_categories.go` | `GetProductCategories` |
| `PostProductCategory` | `post_product_category.go` | `PostProductCategory` |
| `GetCoffeeBeans` | `get_coffee_beans.go` | `GetCoffeeBeans` |
| `PostCoffeeBean` | `post_coffee_bean.go` | `PostCoffeeBean` |
| `GetStocks` | `get_stocks.go` | `GetStocks` |
| `PostStock` | `post_stock.go` | `PostStock` |
| `UpdateStock` | `update_stock.go` | `UpdateStock` |
| `GetOrders` | `get_orders.go` | `GetOrders` |
| `GetUnpaidOrdersBySeatId` | `get_unpaid_orders_by_seat_id.go` | `GetUnpaidOrdersBySeatId` |
| `PostOrder` | `post_order.go` | `PostOrder` |
| `DeleteOrder` | `delete_order.go` | `DeleteOrder` |
| `DeleteAllOrders` | `delete_all_orders.go` | （全注文削除） |
| `PostPayment` | `post_payment.go` | `SavePayment` |
| `UpdateOrderPayment` | `update_order_payment.go` | （注文の決済情報更新） |
| `GetExternalPayment` | `get_external_payment.go` | `GetExternalPayment` |
| `GetSeats` | `get_seats.go` | `GetSeats` |
| `PostSeat` | `post_seat.go` | `PostSeat` |
| `UpdateSeat` | `update_seat.go` | `UpdateSeat` |
| `DeleteSeat` | `delete_seat.go` | （座席削除） |
| `GetDiscounts` | `get_discounts.go` | `GetDiscounts` |
| `PostDiscount` | `post_discount.go` | `PostDiscount` |
| `PostNewClient` | `post_new_client.go` | `PostClient` |
| `UpdateClient` | `update_client.go` | （クライアント更新） |
| `GetDailySales` | `get_daily_sales.go` | `GetDailySales` |
| `GetProductSales` | `get_product_sales.go` | `GetProductSales` |
| `GetSalesByTimeSlot` | `get_sales_by_time_slot.go` | `GetSalesByTimeSlot` |
| `GetSalesByPaymentType` | `get_sales_by_payment_type.go` | `GetSalesByPaymentType` |

### HTTP エンドポイント

| メソッド | パス | ハンドラ | 概要 |
|---------|------|---------|------|
| `POST` | `/api/v1/webhooks/square/terminal` | `SquareTerminalWebhooks.Handle` | Square Terminal からの決済状態通知を受信 |

---

## 外部サービス連携

### 1. Square Terminal

**用途**: キャッシュレス決済端末との連携
**実装**: `infra/square/`

#### Square API 呼び出し

| 操作 | エンドポイント | タイミング |
|-----|-------------|----------|
| チェックアウト作成 | `POST https://connect.squareup.com/v2/terminals/checkouts` | `SavePayment` で `External` タイプ選択時 |
| チェックアウト状態取得 | `GET https://connect.squareup.com/v2/terminals/checkouts/{id}` | ポーリング（3 秒間隔）および Webhook 処理時 |

#### ポーリング処理

起動時に `squarePaymentExternalService.Polling` が goroutine で開始され、`PENDING` / `IN_PROGRESS` 状態の `PaymentExternal` を 3 秒間隔で Square API に問い合わせ、ステータスを更新する。

#### Webhook 受信フロー

```
Square Terminal → POST /api/v1/webhooks/square/terminal
      ↓
SquareTerminalWebhooks.Handle
      ↓
type == "terminal.checkout.updated" をチェック
      ↓
PaymentExternalRepository.FindById (ReferenceId でルックアップ)
      ↓
PaymentExternal.SetStatus(status)  ← COMPLETED 時に PaymentSuccessEvent を発火
      ↓
PaymentExternalRepository.Save
```

#### 必要な環境変数

```
SQUARE_API_TOKEN=<Square API トークン>
```

### 2. orderlink-backend

**用途**: 注文をキッチンスタッフのモニターに連携する
**実装**: `infra/orderlink_server/order_hook.go`
**プロトコル**: Connect-Go (gRPC)
**環境変数**: `ORDERLINK_GRPC=http://localhost:8000`

#### 連携タイミング

- `PostOrder` ユースケースで `IsPostOrderLink=true` の場合（テイクアウト注文の受付時）
- テイクアウト外部決済の場合は決済完了（`PaymentSuccessEvent`）後に連携

#### 送信データ

```
OrderId, OrderAt, Items[], OrderType, TicketId, TicketAddr, SeatName
```

`IsManagingOrder=false` の商品は OrderLink 側で注文管理から除外される。
`IsOlUseKitchen=false` の商品はキッチンモニターに表示されない。

### 3. ticket-backend

**用途**: 呼び出し番号チケットの発番
**実装**: `infra/ticket_server/order_ticket.go`
**プロトコル**: gRPC (`ticketconnect.TicketServiceClient`)
**環境変数**: `TICKET_GRPC=http://localhost:8001`

#### 動作

`OrderTicketRepository.Create` が呼ばれると:
1. ticket-backend の `IssueTicket` RPC を呼び出し（Prefix: `"L"`）
2. 返却された `TicketId` / `TicketAddr` を `order_tickets` テーブルに保存
3. `OrderTicket` ドメインオブジェクトを返す

`TicketAddr` が呼び出し番号の表示文字列（例: `L001`）となり、フロントエンドに返される。

---

## DB スキーマ / DAO

### テーブル一覧

| テーブル | DAO 構造体 | 概要 |
|---------|-----------|------|
| `clients` | `dao.Client` | クライアント端末 |
| `coffee_beans` | `dao.CoffeeBean` | コーヒー豆 |
| `discounts` | `dao.Discount` | 割引マスタ |
| `denominations` | `dao.Denomination` | 金種（client ごとの両替管理） |
| `orders` | `dao.Order` | 注文 |
| `order_discounts` | `dao.OrderDiscount` | 注文に適用された割引 |
| `order_items` | `dao.OrderItem` | 注文明細 |
| `order_payments` | `dao.OrderPayment` | 注文と決済の中間テーブル |
| `order_tickets` | `dao.OrderTicket` | 注文と呼び出し番号チケットの紐付け |
| `payments` | `dao.Payment` | 決済情報 |
| `payment_externals` | `dao.PaymentExternal` | Square Terminal 外部決済状態 |
| `products` | `dao.Product` | 商品 |
| `product_categories` | `dao.ProductCategory` | 商品カテゴリ |
| `product_coffee_brews` | `dao.ProductCoffeeBrew` | コーヒー抽出方法と価格 |
| `seats` | `dao.Seat` | 座席 |
| `stocks` | `dao.Stock` | 在庫 |

### 主要テーブルのカラム定義

#### orders

```sql
id          TEXT PRIMARY KEY      -- ULID
order_type  INT NOT NULL          -- 0=EatIn, 1=TakeOut
order_at    TIMESTAMP NOT NULL
client_id   TEXT NOT NULL         -- → clients.id
seat_id     TEXT                  -- → seats.id (nullable)
```

#### order_items

```sql
order_id       TEXT PK  -- → orders.id
product_id     TEXT PK  -- → products.id
coffee_brew_id TEXT PK  -- → product_coffee_brews.id (Other は空文字)
quantity       BIGINT NOT NULL
amount         BIGINT NOT NULL  -- 単価スナップショット
```

#### payments

```sql
id              TEXT PRIMARY KEY  -- ULID
payment_type    INT NOT NULL      -- 0=Cash, 1=External
receive_amount  BIGINT NOT NULL
payment_amount  BIGINT NOT NULL
change_amount   BIGINT NOT NULL
payment_at      TIMESTAMP NOT NULL
updated_at      TIMESTAMP NOT NULL
```

#### payment_externals

```sql
id                  TEXT PRIMARY KEY  -- ULID
payment_id          TEXT NOT NULL     -- → payments.id
payment_type        TEXT NOT NULL     -- Square の決済方式文字列
status              TEXT NOT NULL     -- PENDING/IN_PROGRESS/CANCEL_REQUESTED/CANCELED/COMPLETED
external_service_id TEXT NOT NULL     -- Square の checkout ID
external_device_id  TEXT              -- Square デバイス ID
created_at          TIMESTAMP NOT NULL
updated_at          TIMESTAMP NOT NULL
paid_at             TIMESTAMP         -- COMPLETED 時に設定
```

#### products

```sql
id               TEXT PRIMARY KEY  -- ULID
name             TEXT NOT NULL
category_id      TEXT NOT NULL     -- → product_categories.id
product_type     INT NOT NULL      -- 0=Coffee, 1=Other
color            TEXT NOT NULL     -- UI 表示用カラーコード
is_now_sales     BOOL NOT NULL
coffee_bean_id   TEXT              -- → coffee_beans.id (Coffee のみ)
amount           BIGINT            -- Other のみ
stock_id         TEXT              -- → stocks.id (Other のみ)
is_managing_order BOOL NOT NULL    -- OrderLink 管理対象か
is_ol_use_kitchen BOOL NOT NULL    -- キッチンモニター表示対象か
created_at       TIMESTAMP NOT NULL
updated_at       TIMESTAMP NOT NULL
```

### CQRS: Repository vs QueryService

logoregi-backend では書き込みと読み取りの責務を分離しています。

| 種別 | インターフェース例 | 実装 |
|-----|-----------------|------|
| **Repository** (書き込み) | `OrderRepository`, `ProductRepository` | `bundb/order.go`, `bundb/product.go` |
| **QueryService** (読み取り) | `OrderQueryService`, `ProductQueryService` | `bundb/order.go` 内の `orderQueryServiceDb` |
| **SalesQueryService** (集計) | `SalesQueryService` | `bundb/sales_query_service.go` |

Repository は `Save` / `Delete` などの書き込みのみ担当し、複雑なリレーション読み込みは QueryService が担当します。

---

## 依存性注入の仕組み

`samber/do` ライブラリを使用した DI コンテナを採用しています。

### インジェクター構築 (`main.go` の `buildInjector`)

```go
func buildInjector(db *bun.DB, ...) *do.Injector {
    i := do.New()

    // 1. インフラ依存 (DB, 外部クライアント) を登録
    do.Provide(i, func(i *do.Injector) (*bun.DB, error) { return db, nil })
    do.Provide(i, func(i *do.Injector) (ticketconnect.TicketServiceClient, error) { ... })

    // 2. Repository 実装を登録 (infra/bundb/*.go)
    do.Provide(i, bundb.NewOrderDb)          // → repository.OrderRepository
    do.Provide(i, bundb.NewProductDb)        // → repository.ProductRepository

    // 3. QueryService 実装を登録
    do.Provide(i, bundb.NewOrderQueryServiceDb)   // → application.OrderQueryService
    do.Provide(i, bundb.NewSalesQueryServiceDb)   // → application.SalesQueryService

    // 4. 外部サービスクライアント実装を登録
    do.Provide(i, ticket_server.NewOrderTicketServer)
    do.Provide(i, orderlink_server.NewOrderHookOrderLink)
    do.Provide(i, square.NewSquarePaymentExternalService)

    // 5. ユースケースを登録
    do.Provide(i, application.NewPostOrderUseCase)   // → application.PostOrder
    do.Provide(i, application.NewSavePaymentUseCase) // → application.SavePayment
    ...

    return i
}
```

### ハンドラでの使い方

```go
// presentation/grpc_server/*.go
func (s *GrpcServer) PostOrder(...) {
    // 必要なユースケースを遅延解決
    usecase := do.MustInvoke[application.PostOrder](s.i)
    usecase.Execute(ctx, param)
}
```

### ドメインイベント登録

起動時に `registerDomainEventHandler` で `PaymentSuccessEvent` のハンドラを登録。
Square Terminal 決済完了時に `PaymentExternal.SetStatus("COMPLETED")` → `PaymentSuccessEvent` 発火 → ハンドラで orderlink-backend へ注文通知。

---

## DB マイグレーション

### ツール

`uptrace/bun/migrate` を使用した Go マイグレーション。

### コマンド

```bash
# マイグレーションテーブルの初期化（初回のみ）
go run ./cmd/bin/main.go db init

# 未適用マイグレーションの実行
go run ./cmd/bin/main.go db migrate

# 新規マイグレーションファイルの作成
go run ./cmd/bin/main.go db create <name>
```

### マイグレーションファイル

| ファイル | 内容 |
|--------|------|
| `20230914143706_init.go` | 初期テーブル作成（全テーブル） |
| `20231014175609_add_coffee_brew_id_to_pkey_in_order_items.go` | order_items の主キーに coffee_brew_id 追加 |
| `20241018222113_add_ol_flag_to_products.go` | products に `is_managing_order`, `is_ol_use_kitchen` カラム追加 |
| `20241210044830_add_payment_external.go` | `payment_externals`, `order_tickets` テーブル追加 |

### Docker 起動時の自動マイグレーション

`entrypoint.sh` により、コンテナ起動時に自動的に `db init` → `db migrate` が実行される。

---

## 開発時の起動方法

### ローカル開発（air ホットリロード）

`.air.toml` の `full_bin` に記載の環境変数でそのまま起動できます。

```bash
# 依存ツールインストール（aqua 使用時）
aqua install -l

# PostgreSQL 起動（Docker）
docker compose up -d db

# 初回マイグレーション
go run ./cmd/bin/main.go db init
go run ./cmd/bin/main.go db migrate

# air でホットリロード起動
air
```

air は以下の環境変数で起動します（`.air.toml` の `full_bin` 参照）:

```
DATABASE_URL=postgres://postgres:password@localhost/pos?sslmode=disable
PORT=8080
TICKET_GRPC=http://localhost:8081
ORDERLINK_GRPC=http://localhost:8082
DEV_MODE=1
```

### 通常起動

```bash
go run . \
  -port 8080
```

環境変数は別途設定が必要です（後述）。

### Docker ビルド・起動

```bash
docker build -t logoregi-backend .
docker run -p 8080:8080 \
  -e DATABASE_URL=postgres://... \
  -e TICKET_GRPC=http://ticket-backend:8081 \
  -e ORDERLINK_GRPC=http://orderlink-backend:8082 \
  logoregi-backend
```

### モノレポの Taskfile を使う場合

プロジェクトルートの `Taskfile.yml` から:

```bash
task dev     # 全サービス一括起動
task migrate # DB マイグレーション
```

---

## 環境変数

| 変数名 | 必須 | デフォルト | 説明 |
|-------|-----|----------|------|
| `DATABASE_URL` | 必須 | - | PostgreSQL 接続 DSN。例: `postgres://postgres:password@127.0.0.1/pos?sslmode=disable` |
| `TICKET_GRPC` | 必須 | - | ticket-backend の URL。例: `http://localhost:8001` |
| `ORDERLINK_GRPC` | 必須 | - | orderlink-backend の URL。例: `http://localhost:8000` |
| `PORT` | 任意 | `8080` (flag) | HTTP サーバーのポート番号（`-port` フラグでも設定可） |
| `DEV_MODE` | 任意 | 未設定 | 設定されている場合、`.env` ファイルを自動ロードし、ticket-backend への HTTP/2 接続で TLS を無効化 |
| `SQUARE_API_TOKEN` | Square 連携時に必須 | - | Square API のアクセストークン |

### `.env.example`

```env
DATABASE_URL=postgres://postgres:password@127.0.0.1/pos?sslmode=disable
TICKET_GRPC=http://localhost:8001
ORDERLINK_GRPC=http://localhost:8000
PORT=8080
DEV_MODE=true
```

`DEV_MODE` が設定されている場合のみ `.env` ファイルが読み込まれます。本番環境では環境変数を直接設定してください。

---

## CORS 設定

Connect-Go 対応の CORS ヘッダーを全オリジンに許可しています（`main.go` の `withCORS`）。
本番環境では `AllowedOrigins` を適切に制限することを検討してください。

---

## テスト

```bash
go test ./...
```

---

## デプロイ (CI/CD)

`.github/workflows/cafelogos-pos-backend-AutoDeployTrigger-*.yml` により、`main` ブランチへの push で Azure Container Apps に自動デプロイされます。

```
push to main
    ↓
GitHub Actions
    ↓
docker build & push → Azure Container Registry (ca908167131cacr.azurecr.io)
    ↓
Azure Container Apps (cafelogos-pos-backend) にデプロイ
```
