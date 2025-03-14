## 重要
日本語で返答してください。

## コンポーネント概要
### 1. LogoREGI システム
- **logoregi-backend**: POSシステムのコアバックエンド（Golang）
  - DDD（ドメイン駆動設計）+オニオンアーキテクチャを採用
  - uptrace/bunを使用したDB操作
  - gRPC/Connect-goによるAPI提供
  - 注文管理、商品管理、在庫管理などの機能
  - 技術スタック
    - Golang
    - uptrace/bun
    - gRPC/connect-go
    - PostgreSQL

- **logoregi-admin**: 管理者向けダッシュボード
  - PandaCSSを使用したUIデザイン
  - connect-queryでバックエンドと通信
  - 商品管理、カテゴリ管理、在庫管理などの機能を提供
  - 技術スタック
    - TypeScript
    - Next.js (Page Router)
    - PandaCSS
    - connect-query

- **logoregi-handy**: 店員用モバイルアプリケーション
  - イートイン向けのシステム
  - 店内のお客様から注文を聞き取り、ウェイターがスマホやタブレットから注文を送信してキッチンに注文を伝達させる
  - 技術スタック
    - TypeScript
    - Next.js (Page Router)
    - ChakraUI
    - connect-query

- **logoregi-togo**: テイクアウト用フロントエンド（Next.js）
  - お客さん自らテイクアウト注文するためのサービス
  - 技術スタック
    - TypeScript
    - Next.js (Page Router)
    - ChakraUI
    - connect-query

### 2. OrderLink システム
- **orderlink-backend**: 注文管理バックエンド
  - Redis Pub/Subを使った非同期通信
  - WebSocketによるリアルタイム通知
  - 技術スタック
    - Golang
    - uptrace/bun
    - WebSocket
    - gRPC/connect-go
    - PostgreSQL
    - Redis Pub/Sub

- **orderlink-frontend**: 注文管理フロントエンド
  - 注文状況の表示・管理
  - 技術スタック
    - TypeScript
    - Next.js (Page Router)
    - ChakraUI
    - connect-query
    - WebSocket

- **orderlink-webcall**: 注文管理のお客さん用フロントエンド
  - 注文番号から自分の注文が調理中か完成済みかを確認するためのサービス
  - 技術スタック
    - TypeScript
    - Vite + React
    - ChakraUI
    - WebSocket

### 3. Ticket システム
- **ticket-backend**: チケット管理バックエンド
  - 注文チケットの生成・管理
  - 技術スタック
    - Rust
