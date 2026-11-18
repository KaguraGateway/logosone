# orderlink-frontend オンボーディングガイド

## サービス概要

`orderlink-frontend` は、カフェロゴス向けの **スタッフ・キッチン向け注文モニター** アプリケーションです。Next.js 14 で実装されており、バックエンド（orderlink-backend）からリアルタイムで注文情報を受け取り、スタッフとキッチンスタッフが協力して注文を処理するための画面を提供します。

### 提供する画面

| 画面 | URL | 役割 |
|------|-----|------|
| **ホーム** | `/` | 各モニターへのナビゲーション |
| **スタッフモニター** | `/staff` | 注文の全体管理・呼び出し・提供完了処理 |
| **キッチンモニター** | `/kitchen` | 各調理アイテムの調理ステータス管理 |
| **カスタマーモニター** | `/customer` | 呼び出し番号表示（お客様向け大型モニター） |
| **過去の注文** | `/past-orders` | 過去注文の確認（未実装） |

### 各モニターの役割

**スタッフモニター (`/staff`)**
- 注文単位でカードを表示し、注文全体の状態を管理する
- テイクアウトの場合: 調理完了後に「呼び出し」を実行し、提供完了で完結
- イートインの場合: 調理完了後に直接「提供完了」を実行
- フィルター機能でテイクアウト/イートイン絞り込みや商品カテゴリ絞り込みが可能

**キッチンモニター (`/kitchen`)**
- 調理アイテム単位（OrderItem 単位）で表示し、個別に調理ステータスを進める
- 状態遷移: 未調理 → 調理開始 → 調理完了
- 「担当分表示」機能で自分が調理を開始したアイテムのみにフィルタリング可能
- コーヒーのブリューメソッドはローマ字頭文字で表示（例: エスプレッソ → E）

**カスタマーモニター (`/customer`)**
- お客様の目に触れる大型モニター用
- 左カラムに「調理中」の番号、右エリアに「呼出中」の番号を大きく表示
- 呼び出し中の番号が存在する場合に効果音が再生される

---

## 技術スタック

| 分類 | ライブラリ・ツール | バージョン | 用途 |
|------|-------------------|-----------|------|
| フレームワーク | Next.js | 14.2.x | App Router 採用 |
| 言語 | TypeScript | 5.6.x | 型安全な開発 |
| UI ライブラリ | Chakra UI | v2.x | コンポーネント・スタイリング |
| アニメーション | Framer Motion | v11.x | Chakra UI の依存 |
| 状態管理 | jotai | v2.x | グローバル状態管理 |
| gRPC 通信 | @connectrpc/connect-web | v1.4.x | バックエンドとの REST/gRPC 通信 |
| Proto 型定義 | @kaguragateway/cafelogos-grpc | v1.0.21 | gRPC サービス定義 |
| スキーマ検証 | zod | v3.x | WebSocket メッセージの型安全な検証 |
| 日付処理 | date-fns / date-fns-tz | v4.x / v3.x | 経過時間計算・タイムゾーン処理 |
| 音声再生 | use-sound | v4.x | 新着注文・呼び出し音 |
| アイコン | react-icons | v5.x | UI アイコン |
| Linter | Biome | v1.9.x | Lint + Formatter 統合ツール |
| パッケージ管理 | Bun | - | 依存関係管理・スクリプト実行 |

---

## ディレクトリ構成

```
orderlink-frontend/
├── app/                          # Next.js App Router のルートディレクトリ
│   ├── layout.tsx                # ルートレイアウト（Providers ラップ、メタデータ設定）
│   ├── providers.tsx             # Chakra UI プロバイダ設定（テーマ拡張）
│   ├── manifest.ts               # PWA マニフェスト定義
│   ├── ipadmini.reset.css        # iPad mini 向けリセット CSS
│   ├── favicon.ico               # ファビコン
│   ├── apple-icon.png            # iOS ホーム画面アイコン
│   └── (base)/                   # Route Group: WebSocket接続・SW登録を担うレイアウト
│       ├── layout.tsx            # WebSocketProvider を配置、ServiceWorker 登録
│       ├── page.tsx              # ホーム画面（モニター選択）
│       └── (coreapp)/            # Route Group: SpinnerModal・ServerTime を共通表示
│           ├── layout.tsx        # SpinnerModal（WS切断時のオーバーレイ）、ServerTime
│           ├── _components/      # coreapp 共通コンポーネント
│           │   ├── ServerTime.tsx      # 画面右下に表示するサーバー時刻
│           │   └── SpinnerModal.tsx    # WS 未接続時のスピナーオーバーレイ
│           ├── kitchen/          # キッチンモニター
│           │   ├── page.tsx      # キッチン画面
│           │   ├── usecase.tsx   # キッチン業務ロジック（useKitchen フック）
│           │   └── _components/
│           │       ├── ItemInfoCard.tsx       # 調理アイテムカード
│           │       ├── CookingStatusButton.tsx # 調理ステータスボタン群
│           │       ├── FilterModal.tsx        # 絞り込みモーダル
│           │       └── FilterText.tsx         # 絞り込み状態テキスト表示
│           ├── staff/            # スタッフモニター
│           │   ├── page.tsx      # スタッフ画面
│           │   ├── use.tsx       # スタッフ業務ロジック（useStaff フック）
│           │   └── _components/
│           │       ├── ItemCard.tsx    # 注文カード（提供管理）
│           │       ├── OrderBadge.tsx  # テイクアウト/イートインバッジ
│           │       └── FilterModal.tsx # 絞り込みモーダル（注文タイプ含む）
│           ├── customer/         # カスタマーモニター
│           │   ├── page.tsx      # カスタマー画面
│           │   ├── usecase.tsx   # カスタマー業務ロジック（useCustomer フック）
│           │   └── _components/
│           │       ├── CallingOrderCard.tsx  # 呼び出し中番号カード
│           │       └── CookingOrderCard.tsx  # 調理中番号カード
│           └── past-orders/
│               └── page.tsx      # 過去の注文一覧（未実装）
│
├── jotai/                        # Jotai アトム・フック定義
│   ├── websocket.tsx             # WebSocket クライアント実装・Context・Provider
│   ├── orderlink.tsx             # 注文状態アトム・WebSocket イベントハンドラ
│   ├── product.tsx               # 商品情報アトム（gRPC で初期取得）
│   ├── myTasks.tsx               # 自担当アイテムアトム（sessionStorage 永続化）
│   ├── serverTime.tsx            # サーバー時刻アトム
│   └── updateTimer.tsx           # 経過時間表示用の1分タイマーアトム
│
├── query/                        # gRPC クエリ関数
│   ├── transport.tsx             # Connect トランスポート生成（NEXT_PUBLIC_GRPC_HOST 使用）
│   └── getProducts.tsx           # 商品一覧取得（PosService.getProducts）
│
├── ui/                           # 汎用 UI コンポーネント
│   ├── HeaderBase.tsx            # 各モニター共通ヘッダー（戻るボタン付き）
│   ├── MainBox.tsx               # 各モニター共通メインコンテンツ領域
│   ├── ElapsedMinTime.tsx        # 注文からの経過分表示
│   ├── FilterAccordion.tsx       # 絞り込みアコーディオン（カテゴリ/商品/ブリュー3階層）
│   ├── IconCheckbox.tsx          # アイコン付きチェックボックス
│   └── CancelButton.tsx          # ステータス巻き戻しボタン（確認モーダル付き）
│
├── usecase/                      # ドメインロジック
│   └── Filter.tsx                # フィルターアイテム型定義・操作フック（useFilterItem）
│
├── utils/                        # ユーティリティ
│   ├── romazi.ts                 # カタカナ→ローマ字変換（コーヒーブリュー頭文字表示用）
│   └── rebuildMap.ts             # Map の参照を更新する（React 再レンダリング用）
│
├── zod/                          # Zod スキーマ定義（WebSocket メッセージ型）
│   ├── event.ts                  # WebSocket イベント基本型 { Topic, Message }
│   ├── orders.ts                 # Order 型・OrderStatus 列挙
│   ├── order_items.ts            # OrderItem 型・OrderItemStatus 列挙
│   ├── to_client.ts              # サーバー→クライアント メッセージ型
│   ├── to_server.ts              # クライアント→サーバー メッセージ型
│   └── my_tasks.ts               # 自担当タスク型
│
├── svg/                          # SVG アセット（SVGR で React コンポーネントとして使用）
│   ├── logo.svg                  # OrderLink ロゴ
│   ├── logo_unit.svg             # コンパクトロゴ
│   ├── logos_logo.svg            # カフェロゴスロゴ
│   └── powered_by.svg            # Powered by LOGOS Systems
│
├── public/                       # 静的ファイル
│   ├── orderlink_sound.mp3       # 新着注文効果音
│   ├── orderlink_customer.mp3    # 呼び出し効果音
│   ├── sw.js                     # ServiceWorker（現在は最小実装）
│   └── icon-{128,256,512}x*.png  # PWA アイコン
│
├── middleware.ts                 # Next.js ミドルウェア（BASIC 認証コメントアウト済み）
├── next.config.js                # Next.js 設定（SVGR, standalone output）
├── tsconfig.json                 # TypeScript 設定（`@/*` エイリアス）
├── biome.json                    # Biome Lint/Format 設定
├── .env.example                  # 環境変数サンプル
└── .prettierrc                   # Prettier 設定（Biome と併用）
```

---

## 主要な機能・ページ一覧

### ホーム画面 (`/`)

モニターを選択するためのシンプルなランディングページです。スタッフ / キッチン / カスタマーモニターへのボタンが表示されます。WebSocket 接続の確立はこの階層の `(base)/layout.tsx` で行われます。

### スタッフモニター (`/staff`)

**表示内容:**
- 注文カード（`ItemCard`）を一覧表示（1 カード = 1 注文 = 1 `TicketAddr`）
- カードに注文番号・座席番号・待ち時間・注文タイプ・注文アイテムを表示
- アイテムごとに調理済み（緑チェック）/ 未調理（赤バツ）のアイコン表示

**操作:**
- テイクアウトの場合: 全アイテム確認済みで「呼び出し」ボタンが出現 → 「提供完了」
- イートインの場合: 全アイテム確認済みで直接「提供完了」ボタンが出現
- 「テイクアウト全件表示」「イートイン全件表示」「提供済表示」クイックフィルター
- 「高度な絞り込み」でカテゴリ/商品/ブリュー単位の詳細フィルタリング

**ステータスカウンター:** ヘッダー下に「提供可能: N」「調理中: N」「未調理: N」を表示

### キッチンモニター (`/kitchen`)

**表示内容:**
- 調理アイテムカード（`ItemInfoCard`）を縦に一覧表示（1 カード = 1 OrderItem）
- 各カードに: 注文番号 / 商品名 / ブリュー種別 / ローマ字頭文字プレフィックス / 待ち時間 / 調理ステータスバッジ
- カードの背景色: 未調理(白) / 調理中(オレンジ) / 調理済(緑)

**操作:**
- カードをタップ → 次の調理ステータスへ進める（未調理 → 調理開始 → 調理完了）
- 「戻す」ボタン（`CancelButton`）をタップ → 確認モーダル経由でステータスを 1 つ戻す
- 「担当分表示」トグル → 自分がタッチしたアイテムのみ表示（`myTasksAtom` 参照）
- 「絞り込み」モーダルでカテゴリ/商品/ブリュー単位のフィルタリング

**ステータスカウンター:** 「調理中: N」「未調理: N」を表示

### カスタマーモニター (`/customer`)

- お客様が見るための画面（大型ディスプレイを想定）
- 左エリア（幅 25%）に調理中の注文番号を縦に一覧表示
- 右エリア（幅 75%）に呼び出し中の注文番号を大きく表示
- 呼び出し中注文が存在する間 `orderlink_customer.mp3` をループ再生

---

## バックエンドとの通信方法

### 1. gRPC（商品情報取得）

商品マスタデータの初期取得に **Connect Protocol** （gRPC over HTTP/1.1）を使用します。

```
フロントエンド → logoregi-backend (port: 8080)
```

**実装場所:** `query/transport.tsx`, `query/getProducts.tsx`

```typescript
// transport.tsx
import { createConnectTransport } from '@connectrpc/connect-web';

export function createTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_GRPC_HOST ?? 'http://localhost:8080',
  });
}

// getProducts.tsx
import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';

const client = createPromiseClient(PosService, createTransport());
const data = await client.getProducts({});
```

- Proto 定義は外部パッケージ `@kaguragateway/cafelogos-grpc`（GitHub tarball）から取得
- `jotai/product.tsx` の `productsAtom` で非同期アトムとして管理（Suspense 対応）
- 商品情報はアプリ起動時に一度だけ取得し、フィルター UI の初期化やアイテムカード表示に使用

### 2. WebSocket（注文のリアルタイム通信）

注文のリアルタイム状態更新に WebSocket を使用します。

```
フロントエンド ←→ orderlink-backend (port: 8082 / env: NEXT_PUBLIC_WEBSOCKET_API)
```

**通信フォーマット:**

全メッセージは以下の統一フォーマットで JSON シリアライズされます。

```typescript
// zod/event.ts
type Event = {
  Topic: string;   // メッセージ種別
  Message: any;    // メッセージ本文（Topic 別に型が異なる）
};
```

---

## WebSocket によるリアルタイム更新の仕組み

### クラス構成

`jotai/websocket.tsx` の `WebSocketClient` クラスが WebSocket 接続を管理します。

**主な機能:**
- 接続・切断・メッセージ受信のイベントリスナーをカスタムで実装
- 切断時の自動再接続（3 回まで即座に再試行、それ以降は 5 秒待機）
- メッセージ受信時に Zod でパース・型検証

```
WebSocketProvider（(base)/layout.tsx）
  └── WebSocketContext（isConnected, client を提供）
        ├── useOrderLink（jotai/orderlink.tsx）
        │     注文イベントをサブスクライブし、ordersAtom を更新
        └── useServerTime（jotai/serverTime.tsx）
              TimeSignal イベントをサブスクライブし、時刻を更新
```

### イベント一覧

#### サーバー → クライアント（受信）

| Topic | Message 型 | 説明 |
|-------|-----------|------|
| `Orders` | `{ Orders: Order[] }` | 全注文の初期取得レスポンス |
| `NewOrder` | `NewOrder` | 新しい注文の追加通知 |
| `UpdatedOrderStatus` | `{ Id, Status }` | 注文ステータスの更新通知 |
| `UpdatedOrderItemStatus` | `{ Id, OrderId, Status }` | 注文アイテムステータスの更新通知 |
| `TimeSignal` | `number` (Unix timestamp) | サーバー時刻の定期通知 |

#### クライアント → サーバー（送信）

| Topic | Message 型 | 説明 |
|-------|-----------|------|
| `GetOrders` | `{}` | 全注文の取得リクエスト |
| `UpdateOrderStatus` | `{ Id, Status }` | 注文ステータスの更新リクエスト |
| `UpdateOrderItemStatus` | `{ Id, Status }` | 注文アイテムステータスの更新リクエスト |
| `ClientEventLog` | `string` | クライアントイベントログの送信 |

### 接続フロー

```
1. (base)/layout.tsx がマウント
2. WebSocketProvider が WebSocketClient を生成
3. WebSocketClient.connect() で NEXT_PUBLIC_WEBSOCKET_API に接続
4. 接続成功 → isConnected = true → SpinnerModal が非表示に
5. useOrderLink の onOpen コールバックが発火 → GetOrders を送信
6. サーバーが Orders イベントで全注文を返す → ordersAtom を更新
7. 以降はリアルタイムでイベントを受信し続ける
```

### 切断時の挙動

- `SpinnerModal` が全画面オーバーレイとして表示される（接続中であることを示す）
- `WebSocketClient` が自動再接続を試みる

---

## 状態管理（jotai）の方針とアトム一覧

### 方針

- グローバル状態は `jotai` のアトムで管理する
- 各 `jotai/*.tsx` ファイルにアトム定義とそれを扱うカスタムフックをまとめる
- コンポーネントからは直接アトムを参照せず、カスタムフックを経由する
- ローカルの UI 状態（フィルター設定、モーダル開閉）は `useState` で管理する

### アトム一覧

| ファイル | アトム名 | 型 | 保存場所 | 説明 |
|----------|----------|-----|----------|------|
| `jotai/orderlink.tsx` | `ordersAtom` | `Order[]` | メモリ | 現在の全注文リスト。WebSocket イベントで更新される |
| `jotai/product.tsx` | `productsAtom` | `Product[]`（async） | メモリ | 全商品情報。gRPC で非同期取得（Suspense 対応） |
| `jotai/myTasks.tsx` | `myTasksAtom` | `OrderItemId[]` | sessionStorage | 自分が「調理開始」したアイテムの ID リスト |
| `jotai/serverTime.tsx` | `lastServerTimeSignalAtom` | `number` | メモリ | サーバーからの最新 TimeSignal（Unix timestamp） |
| `jotai/updateTimer.tsx` | `lastUpdateAtAtom` | `Date` | メモリ | 経過時間表示を更新するための1分タイマー基準時刻 |

### カスタムフック一覧

| フック | 提供するもの |
|--------|------------|
| `useOrderLink()` | `orders`, `fetchOrders`, `UpdateOrderStatus`, `UpdateOrderItemStatus`, `SendClientEventLog` |
| `useProduct()` | `products`, `getProductByProductId`, `getCoffeeBrew`, `getProductCategoriesWithProducts`, `getDefaultFilterItems` |
| `useMyTasks()` | `myTasks`, `isMyTask(id)`, `setMyTask(id)` |
| `useServerTime()` | `lastServerTimeSignal` |
| `useUpdateTimerWhenMin()` | `lastUpdateAt`, `Update()` |

### `myTasksAtom` について

キッチンスタッフが「調理開始」ボタンを押したアイテムの ID を `sessionStorage` に保存します。これにより、タブリロード後も担当アイテムが保持されます（ただし、別タブ・別ブラウザとは共有されません）。「担当分表示」機能はこのアトムを参照しています。

---

## UI コンポーネント設計

### Chakra UI v2 カスタムテーマ

`app/providers.tsx` で以下のカスタムサイズを定義しています。

| コンポーネント | サイズ名 | 内容 |
|--------------|----------|------|
| Button | `logos` | `w: 450px, h: 128px, fontSize: 6xl`（ホーム画面の大型ボタン） |
| Spinner | `2xl` | `w: 6rem, h: 6rem` |
| Checkbox | `xl` | `control: 1.5rem × 1.5rem` |

### 共通 UI コンポーネント（`ui/` ディレクトリ）

| コンポーネント | 説明 | 主な Props |
|--------------|------|-----------|
| `HeaderBase` | 各モニター共通の固定ヘッダー（高さ 80px） | `name: string`, `children`（ボタン等） |
| `MainBox` | ヘッダー下のメインコンテンツ領域（`mt: 80px`） | Chakra `Box` の全 Props |
| `ElapsedMinTime` | 注文からの経過分を表示（1分ごとに更新） | `dateISO: string` |
| `FilterAccordion` | 3階層チェックボックス絞り込み UI | `tempFilter`, 各 `onCheckChange` コールバック |
| `IconCheckbox` | アイコン付きチェックボックス | `leftIcon`, Checkbox Props |
| `CancelButton` | 確認モーダル付き「戻す」ボタン（50×65px） | `onCancel: () => void` |

### ページ固有コンポーネント

**キッチン (`kitchen/_components/`)**

| コンポーネント | 説明 |
|--------------|------|
| `ItemInfoCard` | 調理アイテムカード（高さ 93px）。ステータスに応じて背景色変化。二重送信防止に `isSubmittable` ローカル状態を持つ |
| `CookingStatusButton` / `CookingStartBox` / `CookingDoneBox` / `CookingTakingBox` | 調理ステータスに応じたアクションボタン表示 |
| `FilterModal` | キッチン用絞り込みモーダル（カテゴリ/商品/ブリュー） |
| `FilterText` | 現在の絞り込み状態テキスト表示 |

**スタッフ (`staff/_components/`)**

| コンポーネント | 説明 |
|--------------|------|
| `ItemCard` | 注文カード（幅 364px）。アイテムを商品ごとにグルーピング表示。チェックボックスで確認状態を管理し、全確認後に操作ボタンを表示 |
| `OrderBadge` | テイクアウト（オレンジ）/イートイン（ティール）バッジ |
| `FilterModal` | スタッフ用絞り込みモーダル（注文タイプ + カテゴリ/商品/ブリュー） |

**カスタマー (`customer/_components/`)**

| コンポーネント | 説明 |
|--------------|------|
| `CallingOrderCard` | 呼び出し中の注文番号カード（277×124px、ティール枠） |
| `CookingOrderCard` | 調理中の注文番号カード（177×62px） |

### SVG の使用方法

`next.config.js` で `@svgr/webpack` を設定しており、SVG ファイルを React コンポーネントとして import できます。

```typescript
import LogoSvg from '@/svg/logo.svg';

// JSX 内で直接使用
<LogoSvg />
```

---

## 開発時の起動方法

### 前提条件

- Bun がインストールされていること
- orderlink-backend（port: 8082）が起動していること
- logoregi-backend（port: 8080）が起動していること

### 手順

```bash
# orderlink-frontend ディレクトリに移動
cd orderlink-frontend

# 依存関係インストール
bun install

# 環境変数ファイルを作成
cp .env.example .env.local

# 開発サーバー起動（port: 3001）
bun run dev
```

### スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `bun run dev` | 開発サーバー起動（ホットリロード対応） |
| `bun run build` | 本番ビルド（standalone モード） |
| `bun run start` | 本番サーバー起動 |
| `bun run lint` | Biome によるコードチェック |
| `bun run lint:fix` | Biome によるコードチェック + 自動修正 |
| `bun run format` | Biome によるフォーマット確認 |
| `bun run format:fix` | Biome によるフォーマット自動修正 |

### プロジェクト全体の起動（推奨）

リポジトリルートから Taskfile を使って全サービスをまとめて起動できます。

```bash
# リポジトリルートで
task dev
```

---

## 環境変数

`.env.example` を参照して `.env.local` を作成してください。

```env
PORT=3001
NEXT_PUBLIC_WEBSOCKET_API="ws://localhost:8000/"
NEXT_PUBLIC_GRPC_HOST="http://localhost:8080"
```

| 変数名 | デフォルト値 | 説明 |
|--------|------------|------|
| `PORT` | `3001` | Next.js 開発サーバーのポート番号 |
| `NEXT_PUBLIC_WEBSOCKET_API` | `ws://localhost:8000/` | orderlink-backend の WebSocket エンドポイント URL |
| `NEXT_PUBLIC_GRPC_HOST` | `http://localhost:8080` | logoregi-backend の Connect/gRPC エンドポイント URL |

> `NEXT_PUBLIC_` プレフィックスが付いた変数はブラウザからも参照可能です。機密情報を含めないように注意してください。

---

## ドメインモデルと状態遷移

### Order ステータス

```
NotYet(0) → Cooking(1) → Cooked(2) → Calling(3) → Provided(4)
```

| 状態 | 説明 |
|------|------|
| `NotYet` | 注文受付直後、調理未開始 |
| `Cooking` | いずれかの OrderItem が調理中 |
| `Cooked` | 全 OrderItem の調理完了 |
| `Calling` | スタッフがお客様を呼び出し中（テイクアウトのみ） |
| `Provided` | 提供完了 |

### OrderItem ステータス

```
NotYet(0) → Cooking(1) → Cooked(2)
```

| 状態 | 説明 |
|------|------|
| `NotYet` | 調理未開始 |
| `Cooking` | 調理中（キッチンスタッフが開始） |
| `Cooked` | 調理完了 |

### 操作と状態遷移の対応

| 操作 | 誰が操作 | WebSocket メッセージ |
|------|---------|-------------------|
| 調理開始（キッチン） | キッチンスタッフ | `UpdateOrderItemStatus` (NotYet→Cooking) |
| 調理完了（キッチン） | キッチンスタッフ | `UpdateOrderItemStatus` (Cooking→Cooked) |
| 呼び出し（スタッフ） | スタッフ | `UpdateOrderStatus` (Cooked→Calling) |
| 呼び出し取消（スタッフ） | スタッフ | `UpdateOrderStatus` (Calling→Cooked) |
| 提供完了（スタッフ） | スタッフ | `UpdateOrderStatus` (Calling or Cooked→Provided) |

---

## その他の実装メモ

### PWA 対応

- `app/manifest.ts` で PWA マニフェストを定義
- `(base)/layout.tsx` で ServiceWorker (`/sw.js`) を登録
- `sw.js` は現在ほぼ最小実装（install/activate/fetch のログのみ）
- `metadata` に `appleWebApp` 設定あり（iOS ホーム画面追加対応）

### iPad mini 対応

- `app/ipadmini.reset.css` に `box-sizing: border-box` と `p { margin: 0 }` のリセット CSS
- 主要ターゲットデバイスが iPad mini であるため、タッチ操作しやすいボタンサイズ設計

### 二重送信防止（`ItemInfoCard`）

調理ステータスボタンタップ時に `isSubmittable` を `false` にして、次の WebSocket レスポンスで `cookingStatus` が変わるまでボタンを無効化します。

### フィルター機能のデータ構造

フィルターアイテムは 3 階層のツリー構造です。

```
FilterItem (カテゴリ)
  └── FilterItem[] (商品)
        └── FilterItem[] (コーヒーブリュー)
```

`usecase/Filter.tsx` の `useFilterItem` フックで操作します。`getDefaultFilterItems()` で全チェック済みの初期フィルターを生成します。

### BASIC 認証

`middleware.ts` に BASIC 認証のコードがコメントアウトされています（`TODO: Active BASIC AUTH`）。本番環境への展開時に有効化が必要になる可能性があります。

### Biome の設定

| 設定 | 値 |
|------|-----|
| インデント | スペース 2 文字 |
| 行幅 | 100 文字 |
| クォート | シングルクォート |
| トレイリングカンマ | ES5 準拠 |
| セミコロン | あり |

---

## 関連ドキュメント

| ドキュメント | 説明 |
|------------|------|
| `docs/onboarding/README.md` | プロジェクト全体のオンボーディングガイド |
| `orderlink-frontend/README.md` | クイックスタート（bun install / bun run dev） |
| `.clinerules` | アーキテクチャ・コーディング規約の詳細 |
