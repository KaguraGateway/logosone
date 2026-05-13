# ticket-backend オンボーディングガイド

## サービス概要

`ticket-backend` は **チケット発番サービス** です。カフェロゴス POS システム（LogosOne）において、注文を受け付けた際に一意の呼出番号・引換券番号を発行・管理します。

### 発行されるチケットの形式

```
{接頭語}-{番号}
```

例: `A-1`, `A-2`, `B-1` など

接頭語（prefix）は呼び出し元（logoregi-backend）が指定します。同じ接頭語の中で番号が連番採番されます。

### システム内での位置づけ

```
logoregi-backend ──(gRPC)--> ticket-backend ──> PostgreSQL(ticket DB)
```

`logoregi-backend` が注文確定時に `IssueTicket` RPC を呼び出し、番号を払い出します。不要になったチケットは `RevokeTicket` RPC で削除します。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| 言語 | Rust (edition 2021) |
| 非同期ランタイム | tokio 1.40 |
| gRPC フレームワーク | tonic 0.12 |
| ORM | SeaORM 1.0（sqlx-postgres バックエンド） |
| 依存性注入 | shaku 0.6 |
| ID 生成 | cuid2 (cuid クレート) |
| 日時処理 | chrono 0.4 |
| エラー定義 | thiserror 1.0 |
| Proto 定義（外部リポジトリ） | [cafelogos-grpc](https://github.com/KaguraGateway/cafelogos-grpc) |
| DB | PostgreSQL 16 |

---

## ディレクトリ構成と各レイヤーの役割

```
ticket-backend/
├── src/
│   ├── main.rs                  # エントリポイント（run_server() を呼ぶだけ）
│   ├── lib.rs                   # サーバー起動・shaku モジュール定義
│   │
│   ├── domain/                  # ドメイン層 ── ビジネスルールの核心
│   │   └── ticket/
│   │       ├── mod.rs           #   DomainTickerError 定義
│   │       ├── model.rs         #   Ticket・TicketId エンティティ
│   │       └── repository.rs   #   TicketRepository トレイト（インターフェース）
│   │
│   ├── application/             # アプリケーション層 ── ユースケース
│   │   └── ticket/
│   │       ├── mod.rs           #   ApplicationTicketError 定義
│   │       ├── issue_ticket.rs  #   IssueTicket ユースケース
│   │       └── revoke_ticket.rs #   RevokeTicket ユースケース
│   │
│   ├── infra/                   # インフラ層 ── DB アクセスの実装
│   │   ├── dao/
│   │   │   ├── mod.rs           #   モジュール宣言
│   │   │   ├── prelude.rs       #   Ticket エンティティ再エクスポート
│   │   │   └── ticket.rs        #   SeaORM 生成 Entity（DB マッピング）
│   │   └── ticket/
│   │       └── db.rs            #   TicketRepository の DB 実装
│   │
│   └── presentation/            # プレゼンテーション層 ── gRPC ハンドラ
│       ├── mod.rs               #   TicketService トレイト実装・エラー変換
│       └── ticket/
│           ├── mod.rs           #   エラー→ Status 変換
│           ├── issue_ticket.rs  #   IssueTicket RPC のロジック
│           └── revoke_ticket.rs #   RevokeTicket RPC のロジック
│
├── migration/                   # SeaORM マイグレーション（独立クレート）
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs              #   CLI エントリポイント
│       ├── lib.rs               #   Migrator 定義
│       └── m20220101_000001_create_table.rs  # ticket テーブル作成
│
├── Cargo.toml                   # 依存関係定義（workspace 親）
├── Dockerfile                   # マルチステージなし・シングルステージビルド
├── entrypoint.sh                # コンテナ起動時にマイグレーションを自動実行
└── .env.example                 # 環境変数サンプル
```

### レイヤー間の依存方向

```
presentation --> application --> domain <-- infra
                                    ^
                                    |（トレイト経由で依存性逆転）
```

ドメイン層は他のレイヤーに一切依存しません。インフラ層はドメイン層のトレイトを実装することで依存性逆転を実現しています。

---

## ドメインモデル

### Ticket エンティティ（`src/domain/ticket/model.rs`）

```rust
pub struct Ticket {
    id: TicketId,           // CUID2 形式の一意 ID（文字列、24 文字）
    ticket_number: usize,   // 連番（1 始まり、同一 prefix 内で採番）
    ticket_prefix: String,  // 接頭語（例: "A", "B"）
    created_at: DateTime<Utc>,
}
```

- `Ticket::new(ticket_number, ticket_prefix)` ─ 新規作成（ID は自動生成）
- `Ticket::rebuild(id, ticket_number, ticket_prefix, created_at)` ─ DB から復元

### TicketId 値オブジェクト

```rust
pub struct TicketId {
    value: String,  // cuid::cuid2() で生成
}
```

ID には [CUID2](https://github.com/paralleldrive/cuid2) を使用し、衝突耐性のあるランダム文字列（24 文字）を採番します。

### TicketRepository トレイト（`src/domain/ticket/repository.rs`）

```rust
#[async_trait]
pub trait TicketRepository: Interface {
    async fn find_by_id(&self, id: String) -> Result<Option<Ticket>, DomainTickerError>;
    async fn find_last_ticket_by_prefix(&self, prefix: &str) -> Result<Option<Ticket>, DomainTickerError>;
    async fn save(&self, ticket: Ticket) -> Result<(), DomainTickerError>;
    async fn delete(&self, ticket: Ticket) -> Result<(), DomainTickerError>;
}
```

`find_last_ticket_by_prefix` で同一 prefix の最新番号を取得し、+1 して次の番号を決定します。

---

## gRPC API

Proto 定義は外部リポジトリ `cafelogos-grpc` で管理されています（`proto/proto/ticket/ticket_service.proto` にローカルコピーあり）。

```protobuf
package cafelogos.ticket;

service TicketService {
    rpc IssueTicket(RequestIssueTicket) returns (ResponseIssueTicket) {}
    rpc RevokeTicket(RequestRevokeTicket) returns (ResponseRevokeTicket) {}
}
```

### IssueTicket

チケットを新規発行します。

| 方向 | メッセージ | フィールド |
|------|-----------|-----------|
| Request | `RequestIssueTicket` | `prefix: string` ─ 接頭語（例: `"A"`） |
| Response | `ResponseIssueTicket` | `ticket: Ticket` |

`Ticket` メッセージ:
- `id: string` ─ チケットの一意 ID（CUID2）
- `ticket_addr: string` ─ `{prefix}-{number}` 形式（例: `A-1`）
- `created_at: string` ─ RFC3339 形式の生成日時

### RevokeTicket

チケットを削除（無効化）します。

| 方向 | メッセージ | フィールド |
|------|-----------|-----------|
| Request | `RequestRevokeTicket` | `id: string` ─ 削除するチケット ID |
| Response | `ResponseRevokeTicket` | （空） |

チケットが見つからない場合は `Status::NOT_FOUND` が返ります。

### エラーマッピング

```
ApplicationTicketError::TicketNotFound    --> gRPC Status NOT_FOUND
DomainTickerError::FailedToTicketDbOperation --> gRPC Status INTERNAL
```

---

## DB スキーマ / マイグレーション

### テーブル定義

`ticket` テーブル（PostgreSQL）:

| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | VARCHAR(24) | PK, NOT NULL | CUID2 形式 |
| `ticket_number` | INTEGER UNSIGNED | NOT NULL | 連番（prefix ごとに採番） |
| `ticket_prefix` | VARCHAR | NOT NULL | 接頭語（例: "A"） |
| `created_at` | TIMESTAMPTZ | NOT NULL | 作成日時（タイムゾーン付き） |

マイグレーションファイル: `migration/src/m20220101_000001_create_table.rs`

### マイグレーション操作

```bash
# 初回のみ: sea-orm-cli をインストール
cargo install sea-orm-cli

# マイグレーションを実行（未適用のものを適用）
sea-orm-cli migrate up
# または
cargo run -p migration

# 特定バージョンまでロールバック
sea-orm-cli migrate down

# テーブルをすべて削除して最初からやり直す
sea-orm-cli migrate fresh

# マイグレーション状態を確認
sea-orm-cli migrate status

# 新しいマイグレーションファイルを作成
sea-orm-cli migrate generate <マイグレーション名>

# DB スキーマから Entity ファイルを再生成（infra/dao/ を更新する場合）
sea-orm-cli generate entity -o src/infra/dao
```

### SeaORM Entity（`src/infra/dao/ticket.rs`）

```rust
#[sea_orm(table_name = "ticket")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    pub ticket_number: i32,
    pub ticket_prefix: String,
    pub created_at: DateTimeWithTimeZone,
}
```

このファイルは `sea-orm-cli generate entity` コマンドで自動生成されます。手動で編集した場合、再生成で上書きされるため注意してください。

---

## 依存性注入（shaku）の仕組み

`shaku` は Rust の DI コンテナライブラリです。本プロジェクトでは以下のように使用しています。

### モジュール定義（`src/lib.rs`）

```rust
module! {
    MyModule {
        components = [TicketRepositoryDb, IssueTicketUseCase, RevokeTicketUseCase],
        providers = []
    }
}
```

`MyModule` がすべての依存関係を管理するコンテナです。

### コンポーネントの登録

各クラスに `#[derive(Component)]` と `#[shaku(interface = トレイト名)]` を付けることで登録します。

```rust
// インフラ層: TicketRepository トレイトの実装を登録
#[derive(Component)]
#[shaku(interface = TicketRepository)]
pub struct TicketRepositoryDb {
    #[shaku(default)]
    db: DatabaseConnection,   // default = 後から手動注入する
}

// アプリケーション層: TicketRepository を自動注入
#[derive(Component)]
#[shaku(interface = IssueTicket)]
pub struct IssueTicketUseCase {
    #[shaku(inject)]
    repository: Arc<dyn TicketRepository>,  // inject = 自動解決
}
```

### サーバー起動時の組み立て（`src/lib.rs`）

```rust
let module: MyModule = MyModule::builder()
    .with_component_parameters::<TicketRepositoryDb>(
        TicketRepositoryDbParameters { db }  // DB接続を手動で渡す
    )
    .build();
```

### ハンドラでの使用（`src/presentation/mod.rs`）

```rust
impl TicketService for TicketServiceImpl {
    async fn issue_ticket(&self, request: Request<RequestIssueTicket>) -> ... {
        let usecase: &dyn IssueTicket = self.module.resolve_ref();
        // ...
    }
}
```

`resolve_ref()` で `MyModule` から該当トレイトの実装を取得します。依存グラフの解決は `shaku` が自動で行います。

---

## ビルド方法（Proto コンパイル含む）

### ローカルでのビルド

`ticket-backend` 自体は外部 git リポジトリ `cafelogos-grpc` から生成済みのコードを依存として取り込んでいます。Proto の再コンパイルは通常不要です。

```bash
cd ticket-backend

# 開発ビルド（デバッグ）
cargo build

# リリースビルド
cargo build --release

# 実行（.env が必要）
cp .env.example .env
# .env を編集して DATABASE_URL と PORT を設定
cargo run
```

### Proto の再生成が必要な場合

`cafelogos-grpc` の Proto 定義が更新された場合は `proto/` ディレクトリで以下を実行します。

```bash
cd proto
bun run generate  # buf で Go / TypeScript / Swift コードを生成
```

Rust 向けは `proto/build.rs` で `tonic_build` を使ってコンパイルします。

```rust
// proto/build.rs
tonic_build::configure()
    .include_file("lib.rs")
    .build_client(true)
    .build_server(true)
    .out_dir("src/")
    .compile(&["proto/ticket/ticket_service.proto"], &["proto/"])?;
```

`protoc`（Protocol Buffers コンパイラ）が必要です。Dockerfile では以下のように取得しています。

```dockerfile
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v25.3/protoc-25.3-linux-x86_64.zip"
RUN apt install unzip
RUN unzip -q protoc.zip bin/protoc 'include/*' -d /usr/local
```

ローカル macOS 環境では `brew install protobuf` でインストールできます。

---

## Docker での起動方法

### 開発環境（Docker Compose）

リポジトリルートの `compose.yml` を使用します。`ticket-backend` 単体と PostgreSQL を起動します。

```bash
# ticket-backend と DB のみ起動
docker compose up -d db ticket-backend

# ログを確認
docker compose logs -f ticket-backend
```

初回起動時、`entrypoint.sh` が自動でマイグレーションを実行します。

```bash
#!/bin/bash
set -e
sea-orm-cli migrate up  # 起動前にマイグレーションを適用
exec "$@"               # その後 CMD を実行
```

### 全サービス一括起動

```bash
# 開発環境（全サービス）
docker compose up -d

# 本番構成
docker compose -f compose.prod.yml up -d
```

### Dockerfile 概要

```dockerfile
FROM rust:1.92.0
WORKDIR /app
COPY . .
# protoc のインストール
RUN curl -Lo protoc.zip ".../protoc-25.3-linux-x86_64.zip"
RUN apt install unzip
RUN unzip -q protoc.zip bin/protoc 'include/*' -d /usr/local
# アプリケーションビルド
RUN cargo build --release --target-dir /app/target
# マイグレーション CLI インストール
RUN cargo install sea-orm-cli
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["/app/target/release/cafelogos-ticket-backend"]
```

ビルドは時間がかかります（依存クレートのコンパイルを含む）。キャッシュ効率化が必要な場合は `cargo-chef` などの導入を検討してください。

---

## 環境変数

| 変数名 | 必須 | デフォルト（.env.example） | 説明 |
|--------|------|--------------------------|------|
| `DATABASE_URL` | 必須 | `postgres://postgres:password@127.0.0.1/ticket` | PostgreSQL 接続 URL |
| `PORT` | 必須 | `8001` | gRPC サーバーのリスンポート（Docker では `8081` を使用） |

### 環境変数の読み込み順序

`src/lib.rs` の `run_server()` 関数:

```rust
if env::var("DATABASE_URL").is_err() {
    dotenv().ok();  // 環境変数が未設定の場合のみ .env を読み込む
}
```

コンテナ起動時は `compose.yml` の `environment` セクションで渡されるため `.env` は不要です。ローカル開発時は `.env` ファイルを使用します。

### ローカル開発用 .env 設定

```bash
cp .env.example .env
# .env を編集（デフォルト値で通常は動作する）
```

```
DATABASE_URL=postgres://postgres:password@127.0.0.1/ticket
PORT=8001
```

PostgreSQL の `ticket` データベースは `init/postgres/create_db.sql` で作成されます。`docker compose up -d db` 実行時に自動的に初期化されます。

---

## 開発時のよくある作業

### 新しいマイグレーションを追加する

```bash
cd ticket-backend

# ファイルを生成
sea-orm-cli migrate generate add_some_column

# migration/src/ に新ファイルが作成されるので編集
# migration/src/lib.rs の migrations() にも追加する

# 適用
sea-orm-cli migrate up

# Entity を再生成
sea-orm-cli generate entity -o src/infra/dao
```

### gRPC の動作確認

[grpcurl](https://github.com/fullstorydev/grpcurl) や [Postman](https://www.postman.com/) でテストできます。

```bash
# チケット発行
grpcurl -plaintext -d '{"prefix": "A"}' localhost:8081 cafelogos.ticket.TicketService/IssueTicket

# チケット削除
grpcurl -plaintext -d '{"id": "<ticket_id>"}' localhost:8081 cafelogos.ticket.TicketService/RevokeTicket
```

### Proto 定義の確認

`proto/proto/ticket/ticket_service.proto` を参照してください。

---

## 関連リンク

| リソース | URL / パス |
|----------|-----------|
| cafelogos-grpc（Proto 定義・生成コード） | https://github.com/KaguraGateway/cafelogos-grpc |
| SeaORM ドキュメント | https://www.sea-ql.org/SeaORM/ |
| shaku ドキュメント | https://docs.rs/shaku/ |
| tonic ドキュメント | https://docs.rs/tonic/ |
| プロジェクト全体のオンボーディング | `docs/onboarding/README.md` |
| ticket-backend README | `ticket-backend/README.md` |
| migration README | `ticket-backend/migration/README.md` |
