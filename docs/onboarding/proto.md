# proto パッケージ オンボーディングガイド

## 概要

`proto/` ディレクトリは **cafelogos-grpc** と呼ばれる Protocol Buffers 共有定義パッケージです。

このパッケージは LogosOne モノリポ内のすべてのサービスが API 通信に使うスキーマ（メッセージ型・サービス定義）を一元管理し、`buf` ツールを使って **Go / TypeScript / Swift / Rust** 向けのクライアント・サーバコードを自動生成する役割を担います。

```
.proto ファイル（真のソース）
   │
   ├─ buf generate
   │
   ├── pkg/            → Go 生成コード（バックエンド）
   ├── scripts/        → TypeScript 生成コード（フロントエンド）
   ├── Sources/        → Swift 生成コード（iOS アプリ）
   └── src/ (cargo)    → Rust 生成コード（ticket-backend）
```

フロントエンドは bun ワークスペース（`workspace:*`）経由で `proto` パッケージを直接参照します。Go バックエンドは Go モジュールとして参照します（GitHub Packages または replace ディレクティブ）。

---

## ディレクトリ構成

```
proto/
├── proto/                          # .proto ソースファイル
│   ├── common/
│   │   └── common.proto            # 共通型（Empty など）
│   ├── pos/
│   │   └── pos_service.proto       # POS サービス定義
│   ├── orderlink/
│   │   └── orderlink_service.proto # OrderLink サービス定義
│   └── ticket/
│       └── ticket_service.proto    # チケット発番サービス定義
│
├── pkg/                            # 生成コード（Go）
│   ├── common/
│   │   └── common.pb.go
│   ├── pos/
│   │   ├── pos_service.pb.go       # メッセージ型
│   │   └── posconnect/
│   │       └── pos_service.connect.go  # クライアント/サーバインターフェース
│   ├── orderlink/
│   │   ├── orderlink_service.pb.go
│   │   └── orderlinkconnect/
│   │       └── orderlink_service.connect.go
│   └── ticket/
│       ├── ticket_service.pb.go
│       └── ticketconnect/
│           └── ticket_service.connect.go
│
├── scripts/                        # 生成コード（TypeScript）
│   ├── common/
│   │   ├── common_pb.ts            # メッセージ型
│   │   ├── common_pb.js
│   │   └── common_pb.d.ts
│   ├── pos/
│   │   ├── pos_service_pb.ts       # メッセージ型
│   │   ├── pos_service_connect.ts  # サービス定義（connect-es）
│   │   └── pos_service-PosService_connectquery.ts  # connect-query hooks
│   ├── orderlink/
│   │   ├── orderlink_service_pb.ts
│   │   ├── orderlink_service_connect.ts
│   │   └── orderlink_service-OrderLinkService_connectquery.ts
│   └── ticket/
│       ├── ticket_service_pb.ts
│       ├── ticket_service_connect.ts
│       └── ticket_service-TicketService_connectquery.ts
│
├── Sources/                        # 生成コード（Swift）
│   └── cafelogos-grpc/
│       ├── cafelogos_grpc.swift    # エントリポイント（空）
│       ├── common/
│       │   └── common.pb.swift
│       ├── pos/
│       │   ├── pos_service.pb.swift
│       │   └── pos_service.connect.swift
│       ├── orderlink/
│       │   ├── orderlink_service.pb.swift
│       │   └── orderlink_service.connect.swift
│       └── ticket/
│           ├── ticket_service.pb.swift
│           └── ticket_service.connect.swift
│
├── src/                            # 生成コード（Rust、cargo build で生成）
│   ├── lib.rs
│   ├── cafelogos.ticket.rs         # チケットサービスの Rust 実装
│   └── main.rs
│
├── buf.yaml                        # buf lint/breaking 設定
├── buf.gen.yaml                    # buf コード生成プラグイン設定
├── package.json                    # npm/bun パッケージ（TypeScript 向け）
├── go.mod                          # Go モジュール定義
├── Cargo.toml                      # Rust クレート定義
├── build.rs                        # Rust ビルドスクリプト（tonic-build）
└── tsconfig.json
```

---

## 各 .proto ファイルの内容

### common/common.proto

パッケージ: `cafelogos.common`

| メッセージ型 | 説明 |
|-------------|------|
| `Empty`     | 引数・戻り値が不要な RPC で使用するプレースホルダ |

### pos/pos_service.proto

パッケージ: `cafelogos.pos`
Go パッケージ: `github.com/KaguraGateway/cafelogos-grpc/pkg/pos`

#### PosService の RPC 一覧

| RPC | リクエスト | レスポンス | 概要 |
|-----|-----------|-----------|------|
| `GetOrders` | `GetOrdersRequest` | `GetOrdersResponse` | 全注文一覧を取得 |
| `GetUnpaidOrdersBySeatId` | `GetUnpaidOrdersBySeatIdRequest` | `GetOrdersResponse` | 座席 ID で未払い注文を取得 |
| `PostOrder` | `PostOrderRequest` | `PostOrderResponse` | 注文を登録（品切れや未販売エラーコードあり） |
| `DeleteOrder` | `DeleteOrderRequest` | `common.Empty` | 注文を削除 |
| `PostPayment` | `PostPaymentRequest` | `PaymentResponse` | 支払いを登録 |
| `UpdatePayment` | `UpdatePaymentRequest` | `PaymentResponse` | 支払い情報を更新 |
| `GetExternalPayment` | `GetExternalPaymentRequest` | `GetExternalPaymentResponse` | 外部決済（Square）情報を取得 |
| `GetProducts` | `common.Empty` | `GetProductsResponse` | 商品一覧を取得 |
| `PostNewClient` | `PostNewClientRequest` | `PostNewClientResponse` | クライアント（端末）を新規登録 |
| `UpdateClient` | `UpdateClientRequest` | `common.Empty` | クライアント情報を更新 |
| `GetProductCategories` | `common.Empty` | `GetProductCategoriesResponse` | 商品カテゴリ一覧（管理者専用） |
| `PostProductCategory` | `PostProductCategoryRequest` | `common.Empty` | 商品カテゴリを登録（管理者専用） |
| `PostProduct` | `PostProductRequest` | `common.Empty` | 商品を登録（管理者専用） |
| `UpdateProduct` | `UpdateProductRequest` | `common.Empty` | 商品を更新（管理者専用） |
| `DeleteProduct` | `DeleteProductRequest` | `common.Empty` | 商品を削除（管理者専用） |
| `PostStock` | `PostStockRequest` | `common.Empty` | 在庫を登録 |
| `GetStocks` | `common.Empty` | `GetStocksResponse` | 在庫一覧を取得 |
| `UpdateStock` | `UpdateStockRequest` | `common.Empty` | 在庫を更新 |
| `PostCoffeeBean` | `PostCoffeeBeanRequest` | `common.Empty` | コーヒー豆を登録 |
| `GetCoffeeBeans` | `common.Empty` | `GetCoffeeBeansResponse` | コーヒー豆一覧を取得 |
| `DeleteAllOrders` | `common.Empty` | `common.Empty` | 全注文を削除 |
| `PostSeat` | `PostSeatRequest` | `common.Empty` | 座席を登録 |
| `UpdateSeat` | `UpdateSeatRequest` | `common.Empty` | 座席を更新 |
| `DeleteSeat` | `DeleteSeatRequest` | `common.Empty` | 座席を削除 |
| `GetSeats` | `common.Empty` | `GetSeatsResponse` | 座席一覧を取得 |
| `GetDiscounts` | `common.Empty` | `GetDiscountsResponse` | 割引一覧を取得 |
| `PostDiscount` | `PostDiscountRequest` | `common.Empty` | 割引を登録 |
| `GetDailySales` | `GetDailySalesRequest` | `GetDailySalesResponse` | 日別売上を取得（期間指定） |
| `GetProductSales` | `GetProductSalesRequest` | `GetProductSalesResponse` | 商品別売上を取得（期間指定） |
| `GetSalesByTimeSlot` | `GetSalesByTimeSlotRequest` | `GetSalesByTimeSlotResponse` | 時間帯別売上を取得（売上分析） |
| `GetSalesByPaymentType` | `GetSalesByPaymentTypeRequest` | `GetSalesByPaymentTypeResponse` | 支払い方法別売上を取得（売上分析） |

#### 主要なメッセージ型

| 型 | 概要 |
|----|------|
| `Product` | 商品（COFFEE / OTHER の 2 種類。Coffee はコーヒー豆・抽出方法を持つ） |
| `ProductParam` | 商品作成・更新パラメータ |
| `ProductCategory` | 商品カテゴリ |
| `ProductType` (enum) | `COFFEE = 0`, `OTHER = 1` |
| `CoffeeBean` | コーヒー豆（名前・グラム数） |
| `CoffeeBrew` | コーヒー抽出方法（名前・豆使用量・価格） |
| `Stock` | 在庫（名前・数量） |
| `Order` | 注文（注文品・割引・注文タイプ・呼び出し番号・座席名） |
| `OrderParam` | 注文作成パラメータ |
| `OrderItem` | 注文品（商品ID・数量・金額・コーヒー抽出方法ID） |
| `OrderType` (enum) | `EatIn = 0`, `TakeOut = 1` |
| `OrderDiscount` | 注文に適用された割引 |
| `Discount` | 割引マスタ |
| `DiscountType` (enum) | `PRICE = 0`（価格割引） |
| `Payment` | 支払い（種別・受取金額・支払金額・お釣り） |
| `PaymentParam` | 支払い作成・更新パラメータ（`cash` / `external` の oneof） |
| `PaymentCashParam` | 現金支払いパラメータ（フィールドなし） |
| `PaymentExternalParam` | 外部決済パラメータ（Square など） |
| `PaymentExternal` | 外部決済情報 |
| `Seat` | 座席（ID・名前） |
| `DailySale` | 日別売上データ |
| `ProductSale` | 商品別売上データ |
| `TimeSlotSale` | 時間帯別売上データ |
| `PaymentTypeSale` | 支払い方法別売上データ |

`PostOrderResponse.Code` 列挙型:

| コード | 意味 |
|--------|------|
| `OK = 0` | 正常 |
| `SOLD_OUT_PRODUCT = 1` | 品切れ |
| `NOT_SOLD_PRODUCT = 2` | 未販売商品 |
| `OTHER = 3` | その他エラー |

### orderlink/orderlink_service.proto

パッケージ: `cafelogos.orderlink`
Go パッケージ: `github.com/KaguraGateway/cafelogos-grpc/pkg/orderlink`

#### OrderLinkService の RPC 一覧

| RPC | リクエスト | レスポンス | 概要 |
|-----|-----------|-----------|------|
| `PostOrder` | `PostOrderInput` | `common.Empty` | OrderLink に注文を登録 |
| `ListOrders` | `common.Empty` | `ListOrdersResponse` | 提供済みオーダーの一覧を取得 |

#### 主要なメッセージ型

| 型 | 概要 |
|----|------|
| `Order` | OrderLink の注文（注文タイプ・チケット情報・座席名・ステータス） |
| `Order.OrderType` (enum) | `EAT_IN = 0`, `TAKE_OUT = 1` |
| `Order.OrderStatus` (enum) | `NotYet → Cooking → Cooked → Calling → Served` の 5 段階 |
| `PostOrderInput` | 注文登録パラメータ（チケット ID・アドレスを含む） |
| `PostOrderItemInput` | 注文品パラメータ（注文管理フラグ・キッチンフラグ付き） |
| `ListOrdersResponse` | 注文一覧レスポンス |

### ticket/ticket_service.proto

パッケージ: `cafelogos.ticket`
Go パッケージ: `github.com/KaguraGateway/cafelogos-grpc/pkg/ticket`

#### TicketService の RPC 一覧

| RPC | リクエスト | レスポンス | 概要 |
|-----|-----------|-----------|------|
| `IssueTicket` | `RequestIssueTicket` | `ResponseIssueTicket` | チケットを発行（prefix 指定） |
| `RevokeTicket` | `RequestRevokeTicket` | `ResponseRevokeTicket` | チケットを無効化 |

#### 主要なメッセージ型

| 型 | 概要 |
|----|------|
| `Ticket` | チケット（ID・`ticket_addr`（prefix+番号の結合）・作成日時） |
| `RequestIssueTicket` | チケット発行リクエスト（`prefix` 文字列） |
| `ResponseIssueTicket` | チケット発行レスポンス（`Ticket` を含む） |
| `RequestRevokeTicket` | チケット無効化リクエスト（ID 指定） |
| `ResponseRevokeTicket` | チケット無効化レスポンス（空） |

---

## buf の設定と使い方

### buf.yaml

```yaml
version: v2
modules:
  - path: proto      # .proto ファイルのルートディレクトリ
lint:
  use:
    - DEFAULT        # デフォルトのすべての lint ルールを有効化
breaking:
  use:
    - FILE           # ファイルレベルの破壊的変更を検出
```

**主要な buf コマンド:**

```bash
cd proto

# コード生成
bun run generate    # buf generate の別名

# lint（proto ファイルの文法・命名規則チェック）
bun run lint        # buf lint の別名

# 破壊的変更の検出（既存コードとの互換性チェック）
buf breaking --against .git#branch=main
```

### buf.gen.yaml

コード生成プラグインの設定ファイルです。`buf generate` を実行すると以下の 6 プラグインが順番に動作します。

```yaml
version: v2
plugins:
  # Go: メッセージ型の生成
  - local: protoc-gen-go
    out: pkg
    opt: paths=source_relative

  # Go: Connect-Go クライアント/サーバインターフェースの生成
  - local: protoc-gen-connect-go
    out: pkg
    opt: paths=source_relative

  # TypeScript: メッセージ型の生成（.ts / .js / .d.ts の 3 形式）
  - local: protoc-gen-es
    out: scripts
    opt: target=ts+js+dts

  # TypeScript: connect-query hooks の生成（.ts / .js / .d.ts の 3 形式）
  - local: protoc-gen-connect-query
    out: scripts
    opt: target=ts+js+dts

  # Swift: Connect クライアント（async/await + callback 両対応）
  - remote: buf.build/connectrpc/swift
    opt:
      - GenerateAsyncMethods=true
      - GenerateCallbackMethods=true
      - Visibility=Public
    out: Sources/cafelogos-grpc

  # Swift: SwiftProtobuf メッセージ型
  - remote: buf.build/apple/swift
    opt: Visibility=Public
    out: Sources/cafelogos-grpc
```

Swift のみ `remote` プラグイン（buf.build レジストリ）を使用するため、インターネット接続が必要です。Go と TypeScript は `local`（ローカルインストール済みのバイナリ）を使います。

---

## コード生成の仕組み

### 初回セットアップ（ツールのインストール）

```bash
# proto ツール
brew install protobuf
brew install bufbuild/buf/buf

# Go プラグイン
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest

# Swift プラグイン（macOS のみ）
brew install swift-protobuf grpc-swift

# Node.js / TypeScript プラグイン
cd proto
bun install
# @bufbuild/protoc-gen-es と @connectrpc/protoc-gen-connect-query がインストールされる
```

### Go / TypeScript / Swift コードの生成

```bash
cd proto

# Go の bin に PATH を通す（protoc-gen-go などを使うため）
export PATH="$PATH:$(go env GOPATH)/bin"

# 生成実行
bun run generate
# 内部で "buf generate" を実行し、
# pkg/（Go）、scripts/（TypeScript）、Sources/（Swift）に出力する
```

### Rust コードの生成

Rust は buf ではなく `cargo build` 時に `tonic-build` が自動的に生成します。

```bash
cd proto
cargo build
```

`build.rs` が `tonic_build` を使って `proto/ticket/ticket_service.proto` を処理し、`src/` 以下に Rust コードを出力します。現在は **TicketService のみ** Rust 向けに生成されています。

---

## 生成コードの利用方法

### Go バックエンド

#### 依存関係の追加

**logoregi-backend / orderlink-backend** では `go.mod` でモノリポ内の `proto` モジュールを参照します。

- `orderlink-backend` ではローカルモジュールとして参照:
  ```
  require github.com/KaguraGateway/logosone/proto v0.0.0-...
  ```

- `logoregi-backend` では外部パッケージとして参照（旧バージョン互換）:
  ```
  require github.com/KaguraGateway/cafelogos-grpc v1.7.1-...
  ```

#### サーバ側（ハンドラ実装）

```go
import (
    "connectrpc.com/connect"
    posconnect "github.com/KaguraGateway/logosone/proto/pkg/pos/posconnect"
    pos "github.com/KaguraGateway/logosone/proto/pkg/pos"
)

// サーバハンドラの実装
type PosHandler struct{}

func (h *PosHandler) GetProducts(
    ctx context.Context,
    req *connect.Request[pos.Empty],
) (*connect.Response[pos.GetProductsResponse], error) {
    // ビジネスロジック...
    return connect.NewResponse(&pos.GetProductsResponse{
        Products: []*pos.Product{...},
    }), nil
}

// マウント
mux := http.NewServeMux()
path, handler := posconnect.NewPosServiceHandler(&PosHandler{})
mux.Handle(path, handler)
```

#### クライアント側（サービス間通信）

```go
import (
    "connectrpc.com/connect"
    orderlinkconnect "github.com/KaguraGateway/logosone/proto/pkg/orderlink/orderlinkconnect"
    orderlink "github.com/KaguraGateway/logosone/proto/pkg/orderlink"
)

client := orderlinkconnect.NewOrderLinkServiceClient(
    http.DefaultClient,
    "http://orderlink-backend:8082",
)

resp, err := client.PostOrder(ctx, connect.NewRequest(&orderlink.PostOrderInput{
    OrderId: "...",
    Items:   [...],
}))
```

### TypeScript フロントエンド

#### 依存関係の追加

**logoregi-admin** はモノリポのワークスペース依存として `proto` を直接参照します:

```json
// logoregi-admin/package.json
{
  "dependencies": {
    "proto": "workspace:*"
  }
}
```

**旧フロントエンド**（logoregi-handy, orderlink-frontend）は GitHub Packages からの tarball を参照:
```json
"@kaguragateway/cafelogos-grpc": "https://github.com/KaguraGateway/cafelogos-grpc/archive/refs/tags/v1.0.21.tar.gz"
```

#### connect-query を使った API 呼び出し（推奨パターン）

`scripts/` 配下の `*_connectquery.ts` ファイルが TanStack Query と統合された React hooks を提供します。

```typescript
import { useQuery, useMutation } from "@connectrpc/connect-query";
import { getProducts, postOrder } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { create } from "@bufbuild/protobuf";
import { PostOrderRequestSchema } from "proto/scripts/pos/pos_service_pb";

// クエリ（データ取得）
function ProductList() {
  const { data, isLoading } = useQuery(getProducts);
  // data.products が Product[] として型安全に参照できる
}

// ミューテーション（更新系）
function OrderForm() {
  const mutation = useMutation(postOrder);

  const handleSubmit = () => {
    mutation.mutate(create(PostOrderRequestSchema, {
      order: { items: [...] },
      option: { isPostOrderlink: true },
    }));
  };
}
```

#### connect クライアントのセットアップ

アプリのルートで `TransportProvider` を設定します:

```typescript
import { createConnectTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
});
const queryClient = new QueryClient();

export default function App({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TransportProvider transport={transport}>
        {children}
      </TransportProvider>
    </QueryClientProvider>
  );
}
```

### Swift（iOS / macOS アプリ）

Swift パッケージとしてモノリポルートの `Package.swift` に登録されています。
`Sources/cafelogos-grpc/` 配下の生成ファイルを直接参照します。

```swift
import Connect

// クライアントの初期化
let client = Cafelogos_Pos_PosServiceClient(
    client: ProtocolClient(
        httpClient: URLSessionHTTPClient(),
        config: ProtocolClientConfig(
            host: "https://api.example.com",
            networkProtocol: .connect
        )
    )
)

// async/await でのリクエスト（iOS 13+）
let response = await client.getProducts(
    request: Cafelogos_Common_Empty(),
    headers: [:]
)
if let products = response.message?.products {
    // 型安全に利用できる
}

// コールバックスタイル
client.getOrders(
    request: Cafelogos_Pos_GetOrdersRequest(),
    headers: [:]
) { response in
    // response.message?.orders
}
```

---

## 新しい API を追加する際の手順

新しい RPC エンドポイントを追加する場合、以下の順序で作業します。

### Step 1: .proto ファイルを編集する

```protobuf
// proto/proto/pos/pos_service.proto 内に追加する例

service PosService {
    // ...（既存の RPC）...

    // 新しいエンドポイントを追加
    rpc GetReservations(GetReservationsRequest) returns (GetReservationsResponse) {}
}

// リクエスト/レスポンスのメッセージ型を追加
message GetReservationsRequest {
    string date = 1; // ISO8601形式 (YYYY-MM-DD)
}

message GetReservationsResponse {
    repeated Reservation reservations = 1;
}

message Reservation {
    string id = 1;
    string seat_id = 2;
    string reserved_at = 3;
}
```

**命名規則（buf lint のデフォルトルール）:**
- メッセージ名: `PascalCase`
- フィールド名: `snake_case`
- RPC 名: `PascalCase`
- パッケージ名: `lower.snake_case`

### Step 2: buf lint で検証する

```bash
cd proto
bun run lint
```

エラーがなければ次のステップへ進みます。

### Step 3: コードを生成する

```bash
cd proto
export PATH="$PATH:$(go env GOPATH)/bin"
bun run generate
```

成功すると以下のファイルが更新・追加されます:
- `pkg/pos/pos_service.pb.go` — 新しいメッセージ型が追加される
- `pkg/pos/posconnect/pos_service.connect.go` — 新しい RPC メソッドが追加される
- `scripts/pos/pos_service_pb.ts` — TypeScript メッセージ型が追加される
- `scripts/pos/pos_service_connect.ts` — サービス定義が追加される
- `scripts/pos/pos_service-PosService_connectquery.ts` — connect-query の export が追加される
- `Sources/cafelogos-grpc/pos/pos_service.pb.swift` — Swift 型が追加される
- `Sources/cafelogos-grpc/pos/pos_service.connect.swift` — Swift クライアントに新メソッドが追加される

### Step 4: バックエンドでハンドラを実装する

Go バックエンドの `presentation/grpc_server/` に新しい RPC のハンドラを実装します。

```go
// logoregi-backend/presentation/grpc_server/pos_handler.go

func (h *PosHandler) GetReservations(
    ctx context.Context,
    req *connect.Request[pos.GetReservationsRequest],
) (*connect.Response[pos.GetReservationsResponse], error) {
    // ユースケース層を呼び出す
    reservations, err := h.getReservationsUseCase.Execute(ctx, req.Msg.Date)
    if err != nil {
        return nil, connect.NewError(connect.CodeInternal, err)
    }
    return connect.NewResponse(&pos.GetReservationsResponse{
        Reservations: toProtoReservations(reservations),
    }), nil
}
```

### Step 5: フロントエンドから新しい API を使う

```typescript
// logoregi-admin/query/reservations.ts
import { getReservations } from "proto/scripts/pos/pos_service-PosService_connectquery";
import { useQuery } from "@connectrpc/connect-query";

export function useReservations(date: string) {
  return useQuery(getReservations, { date });
}
```

### Step 6: 変更をコミットする

**重要**: 生成コード（`pkg/`, `scripts/`, `Sources/`, `src/`）も必ずコミットに含めてください。
チームメンバーが `bun run generate` を実行しなくても最新のコードを利用できるようにするためです。

```bash
git add proto/proto/ proto/pkg/ proto/scripts/ proto/Sources/
git commit -m "feat(proto): GetReservations RPC を追加"
```

---

## 開発フロー

### 日常的な開発サイクル

```
.proto ファイルを編集
    ↓
bun run lint          # 文法・命名規則をチェック
    ↓
bun run generate      # コードを再生成（Go / TS / Swift）
    ↓                 # （Rust は cargo build で自動生成）
バックエンドでハンドラを実装（Go / Rust）
    ↓
フロントエンドで新しいメソッドを使用（TypeScript）
    ↓
生成コードを含めて git commit
```

### 破壊的変更への注意

以下の変更は既存クライアントを壊す可能性があります:

| 変更内容 | 影響 |
|----------|------|
| フィールド番号の変更 | シリアライズ互換性が失われる |
| フィールドの削除 | 既存クライアントがエラーになる可能性 |
| RPC の削除 | 既存クライアントがエラーになる |
| メッセージ型の改名 | コンパイルエラー（生成コード変更必要） |

`buf breaking` で事前に検出できます:

```bash
buf breaking --against .git#branch=main
```

### package.json のスクリプト一覧

```bash
bun run generate   # buf generate（全言語のコードを生成）
bun run lint       # buf lint（.proto の文法・規約チェック）
```

### npm パッケージとしての公開（TypeScript）

`proto` パッケージは GitHub Packages レジストリ（`https://npm.pkg.github.com/`）にも公開できます。

```json
// package.json
{
  "name": "proto",
  "version": "1.7.0",
  "files": ["scripts/"],      // TypeScript 生成コードのみ公開
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  }
}
```

旧来のフロントエンド（logoregi-handy, orderlink-frontend）はこのパッケージを `@kaguragateway/cafelogos-grpc` という名前の tarball で参照しています。新しいフロントエンド（logoregi-admin）はワークスペース参照（`workspace:*`）を使うため、公開は不要です。

---

## トラブルシューティング

### `protoc-gen-go: program not found` エラー

```bash
# Go の bin ディレクトリを PATH に追加
export PATH="$PATH:$(go env GOPATH)/bin"

# それでも見つからない場合は再インストール
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
```

### Swift 生成が失敗する

Swift プラグインは `remote`（buf.build API）を使うためインターネット接続が必要です。
また、初回は buf のリモートプラグインキャッシュを構築するため時間がかかります。

```bash
# buf の認証（必要な場合）
buf registry login
```

### Rust の生成コードが古い

Rust は `cargo build` 時に `build.rs` が自動的に `.proto` から Rust コードを生成します。手動で再生成する場合:

```bash
cd proto
cargo clean
cargo build
```

### `buf lint` でエラーが出る

よくある原因と対処:

| エラー | 原因 | 対処 |
|--------|------|------|
| `FIELD_NAMES_LOWER_SNAKE_CASE` | フィールド名が snake_case でない | `myField` → `my_field` に修正 |
| `MESSAGE_NAMES_UPPER_CAMEL_CASE` | メッセージ名が PascalCase でない | `myMessage` → `MyMessage` に修正 |
| `PACKAGE_DEFINED` | `package` 宣言がない | ファイル先頭に `package cafelogos.xxx;` を追加 |
| `RPC_REQUEST_STANDARD_NAME` | リクエスト型の命名が不正 | `{RpcName}Request` の形式にする |
| `RPC_RESPONSE_STANDARD_NAME` | レスポンス型の命名が不正 | `{RpcName}Response` の形式にする |
