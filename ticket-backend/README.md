# cafelogos-ticket-backend
## 概要
一意の呼出番号および引換券番号を発行するシステム

発行形式
```
接頭語-番号
```

## 技術スタック
- Rust 1.72.0
- SeaORM
- shaku
- Tonic
- PostgreSQL 15
- gRPC

## 関連リンク
[cafelogos-grpc | GitHub](https://github.com/KaguraGateway/cafelogos-grpc)

## Init
```
cp .env.example .env
docker compose up
docker compose exec web cargo run -p migration
```

## マイグレーション
migrationでマイグレーションファイルを作成することでテーブル作成、カラム追加・削除などを行えます。
```
# 初回のみ
cargo install sea-orm-cli

# マイグレーションファイルを作成
sea-orm-cli migrate generate [マイグレーション名]

# マイグレーションを実行
sea-orm-cli migrate up

# DBのテーブル削除して、すべてのマイグレーションを再実行
sea-orm-cli migrate fresh

# DBスキーマからentityファイルを生成
sea-orm-cli generate entity -o src/infra/dao
```