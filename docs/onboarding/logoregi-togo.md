# logoregi-togo オンボーディングガイド

## サービス概要

`logoregi-togo` は **テイクアウト用セルフ注文アプリ** です。店頭に設置された iPad などのタブレット端末上でお客様自身が操作し、テイクアウト注文を行います。

### このアプリが担うフロー

1. お客様がトップ画面から「注文入力」を選択する
2. カテゴリ・商品を選んで数量を設定する（コーヒーはドリップ方法も選択）
3. 注文確認画面で内容を確認し「注文送信」を押す
4. バックエンドが注文を受け付け、**呼び出し番号（callNumber）** が返される
5. 完了画面で呼び出し番号を表示し、調理の完了を待つ
6. 「受け取り完了」を押すとトップ画面に戻る

### システム内での位置づけ

```
お客様 (iPad)
    │
    ▼
logoregi-togo  (このアプリ, ポート 3003)
    │
    │ Connect/gRPC (HTTP/1.1 + Protocol Buffers)
    ▼
logoregi-backend  (POS コアバックエンド, ポート 8080)
    │
    ├─▶ orderlink-backend  (注文管理・キッチン連携)
    └─▶ ticket-backend     (呼び出し番号発番)
```

---

## 技術スタック

| 分類 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js (App Router) | 14.2.24 |
| 言語 | TypeScript | ^5.6.3 |
| UI ライブラリ | Chakra UI v2 | ^2.10.2 |
| アニメーション | Framer Motion | ^11.11.8 |
| 状態管理 | jotai | ^2.10.0 |
| gRPC クライアント | @connectrpc/connect-query | ^1.4.0 |
| データフェッチ | TanStack Query (React Query) | ^5.67.3 |
| Proto 定義 | @kaguragateway/cafelogos-grpc | v1.0.21 |
| アイコン | react-icons | ^5.3.0 |
| パッケージマネージャ | bun | - |
| コンテナ | Docker (oven/bun) | - |

> Chakra UI は **v2** を使用しています（logoregi-admin が v3 であることに注意）。

---

## ディレクトリ構成と各ディレクトリの役割

```
logoregi-togo/
├── app/                          # Next.js App Router のルートディレクトリ
│   ├── layout.tsx                # ルートレイアウト（メタデータ定義・Providers ラップ）
│   ├── providers.tsx             # 全体プロバイダー設定（Chakra, Connect, ReactQuery）
│   ├── ipadmini.reset.css        # iPad mini 向けリセット CSS
│   ├── favicon.ico / apple-icon.png
│   └── (togo)/                   # テイクアウト機能のルートグループ
│       ├── layout.tsx            # (togo) 共通レイアウト（未使用・将来の拡張用）
│       ├── page.tsx              # ルート "/" → home ページにリダイレクト
│       ├── (header)/             # ヘッダーあり画面グループ
│       │   ├── layout.tsx        # Header + ErrorModal を配置するレイアウト
│       │   ├── home/page.tsx     # トップ画面（来店ありがとう + 注文入力ボタン）
│       │   └── orderComplete/    # 注文完了画面
│       │       ├── page.tsx      # 呼び出し番号表示・受け取り完了ボタン
│       │       └── _components/
│       │           └── TakeConfirmModal.tsx  # 受け取り完了確認モーダル
│       └── (noHeader)/           # ヘッダーなし画面グループ
│           ├── _components/
│           │   └── ProductInfoCard.tsx       # 注文確認用商品カード（表示専用）
│           └── orderEntry/       # 注文入力画面
│               ├── page.tsx      # 注文入力 / 注文確認の 2 状態を管理するメインページ
│               ├── usecase.tsx   # ビジネスロジック（Hook: useOrderEntryUseCase）
│               ├── utils/
│               │   └── productUtils.tsx     # 商品検索ユーティリティ
│               └── _components/
│                   ├── CategorySelectButton.tsx  # カテゴリ選択サイドバーボタン
│                   ├── ChooseOptionModal.tsx      # コーヒードリップ方法選択モーダル
│                   ├── ProductInfoButton.tsx      # 商品ボタン（バッジ・在庫表示）
│                   ├── ProductQuantityControl.tsx # 商品ボタン + 数量セレクタの複合
│                   └── QuantitySelector.tsx       # +/- ボタンと削除ボタン
│
├── jotai/                        # jotai アトム定義
│   ├── clientId.tsx              # クライアント ID の取得・保存
│   └── errorModal.tsx            # エラーモーダルの状態管理
│
├── query/                        # バックエンド通信層
│   ├── transport.ts              # Connect Transport の生成
│   ├── getProducts.tsx           # 商品一覧取得 Query
│   └── postOrder.tsx             # 注文送信 Mutation
│
├── ui/                           # 汎用 UI コンポーネント
│   ├── Header.tsx                # 固定ヘッダー（ロゴ）
│   ├── NavBar.tsx                # ナビバー（戻るボタン付き）※現状未使用
│   └── ErrorModal.tsx            # エラーモーダル
│
├── svg/
│   └── header_logo.svg           # ヘッダーロゴ（SVGR で React コンポーネントとして import）
│
├── public/                       # 静的ファイル
├── next.config.js                # Next.js 設定（SVGR Webpack 設定）
├── tsconfig.json                 # TypeScript 設定（パスエイリアス @/* → ./*）
├── Dockerfile                    # 本番ビルド用 Dockerfile
└── package.json                  # 依存関係定義
```

---

## 主要な機能・ページ一覧

### ページルーティング

| URL | ファイル | 説明 |
|-----|---------|------|
| `/` または `/home` | `app/(togo)/page.tsx` → `(header)/home/page.tsx` | トップ画面 |
| `/orderEntry` | `app/(togo)/(noHeader)/orderEntry/page.tsx` | 注文入力・確認画面 |
| `/orderComplete?isSendSuccess=true&callNumber=XX` | `app/(togo)/(header)/orderComplete/page.tsx` | 注文完了画面 |

### ルートグループの使い分け

- `(header)`: 固定ヘッダー（ロゴバー）と `ErrorModal` が表示される
- `(noHeader)`: ヘッダーなし（注文入力画面は全画面で商品一覧を表示するため）

### 各画面の詳細

#### トップ画面 (`/home`)

- 「ご来店ありがとうございます」のテキスト
- 「注文入力」ボタン（`/orderEntry` へ遷移）

#### 注文入力・確認画面 (`/orderEntry`)

2 つの状態（`state: 0 | 1`）を 1 つのページで管理しています。

**state = 0: 注文入力**

- 左側 30%: カテゴリ選択サイドバー（固定）
- 右側 70%: 選択カテゴリ内の商品一覧
  - `ProductType.COFFEE`: `ProductInfoButton` をタップ → `ChooseOptionModal` でドリップ方法を選択
  - `ProductType.OTHER`: `ProductQuantityControl` で直接数量を増減
- フッター: 「戻る」ボタン（`/home` へ）、「注文確認」ボタン（state を 1 へ）

**state = 1: 注文確認**

- 選択した商品一覧を `ProductInfoCard` で表示
- フッター: 「戻る」ボタン（state を 0 へ）、「注文送信」ボタン（gRPC で注文送信）

#### 注文完了画面 (`/orderComplete`)

- URL クエリパラメータで注文結果を受け取る
  - `isSendSuccess=true`: 送信成功のアラートを表示
  - `callNumber=XX`: 呼び出し番号を大きく表示
- 「受け取り完了」ボタンで `TakeConfirmModal` を開く
- 確認後、`/home` に戻る

---

## バックエンドとの通信方法

### 通信プロトコル

Connect Protocol（gRPC over HTTP/1.1）を使用します。Protocol Buffers でシリアライズされたメッセージをやり取りします。

### 設定 (`query/transport.ts`)

```typescript
import { createConnectTransport } from '@connectrpc/connect-web';

export function createTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_POS_GRPC ?? 'http://localhost:8080',
  });
}
```

環境変数 `NEXT_PUBLIC_POS_GRPC` でバックエンドの URL を指定します。未設定の場合は `http://localhost:8080` にフォールバックします。

### プロバイダー設定 (`app/providers.tsx`)

```typescript
<TransportProvider transport={transport}>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</TransportProvider>
```

`TransportProvider` が Connect Transport をコンテキスト経由で提供し、`connect-query` の各フックがそれを利用します。

### 使用する RPC メソッド

| Hook | RPC メソッド | 説明 |
|------|------------|------|
| `useProductQuery()` | `PosService.GetProducts` | 全商品・カテゴリ一覧を取得 |
| `usePostOrderMutation()` | `PosService.PostOrder` | 注文を送信（`OrderType.TakeOut` 固定） |
| `useClientId()` (内部) | `PosService.PostNewClient` | 新規クライアント ID を取得・保存 |

### 注文送信の詳細

```typescript
orderMutate.mutateAsync({
  order: {
    items: orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      amount: BigInt(item.amount),        // uint64 なので BigInt を使用
      coffeeBrewId: item.coffeeBrewId,   // コーヒーの場合のみ
    })),
    orderType: OrderType.TakeOut,         // テイクアウト固定
    orderAt: new Date().toISOString(),
    clientId: clientId ?? '',
  },
});
```

成功時はレスポンスの `callNumber`（呼び出し番号）を URL クエリパラメータに乗せて `/orderComplete` へ遷移します。

### Proto 定義の参照先

型定義は `@kaguragateway/cafelogos-grpc` パッケージから import します。このパッケージは GitHub の tarball として直接インストールされます。

```typescript
import { Product, ProductType, CoffeeBrew, OrderType } from
  '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';
import { getProducts, postOrder } from
  '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { PosService } from
  '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';
```

proto の定義ファイル本体はモノレポ内の `proto/proto/pos/pos_service.proto` にあります。

---

## 状態管理（jotai）の方針とアトム一覧

### 基本方針

- グローバルに共有が必要な状態だけを jotai アトムで管理します
- 画面固有のローカル状態（注文アイテム、モーダルの開閉など）は `useState` / `useDisclosure` で管理します
- アトムは `jotai/` ディレクトリに集約し、アトムを直接 export するのではなく **カスタム Hook** を export するパターンを採用しています

### アトム一覧

#### `jotai/clientId.tsx`

```typescript
const clientIdAtom = atom(async () => {
  // localStorage から clientId を取得
  // 未登録の場合は PostNewClient RPC を呼び出して新規登録し、localStorage に保存
  ...
});

export function useClientId(): string | null
```

- **役割**: このタブレット端末固有のクライアント ID を管理します
- **初期化**: `localStorage` に `clientId` がなければ `PostNewClient` RPC でバックエンドに登録し、取得した ID を保存します
- **非同期アトム**: `atom(async () => ...)` を使っているため、初回ロード時に非同期で値が解決されます
- **注意**: `window` が存在しない SSR 環境では空文字を返します

#### `jotai/errorModal.tsx`

```typescript
const errorTitleAtom = atom('');
const errorMessageAtom = atom('');

export function useErrorModal(): {
  errorTitle: string;
  errorMessage: string;
  isErrorModalOpen: boolean;    // title と message が両方非空のときに true
  onErrorModalClose: () => void;
  onErrorModalOpen: (title: string, message: string) => void;
}
```

- **役割**: アプリ全体で使用するエラーモーダルの表示状態を管理します
- **開閉ロジック**: `isErrorModalOpen` は `errorTitle` と `errorMessage` が両方とも非空文字列のときに `true` になります（専用の boolean アトムを持たずに派生させています）
- **使用箇所**: `(togo)/layout.tsx` でモーダル本体をレンダリングし、`useOrderEntryUseCase` 内でエラー発生時に `onErrorModalOpen` を呼び出します

---

## UI コンポーネント設計

### Chakra UI カスタムテーマ

`app/providers.tsx` でテーマを拡張しています。

```typescript
const theme = extendTheme({
  styles: {
    global: {
      body: { backgroundColor: 'gray.100' },  // アプリ全体の背景色
    },
  },
  components: {
    Button: {
      sizes: {
        logos: { w: '450px', h: '128px', fontSize: '6xl' },  // 独自サイズ定義
      },
    },
  },
});
```

### コンポーネント階層

```
ui/Header.tsx              汎用ヘッダー（ロゴクリックでトップへ）
ui/NavBar.tsx              ナビバー（戻るボタン + 任意コンテンツ）※現在未使用
ui/ErrorModal.tsx          エラーモーダル（グローバル）

app/(togo)/(header)/orderComplete/_components/
  TakeConfirmModal.tsx     受け取り完了確認モーダル

app/(togo)/(noHeader)/_components/
  ProductInfoCard.tsx      注文確認画面の商品カード（表示専用）

app/(togo)/(noHeader)/orderEntry/_components/
  CategorySelectButton.tsx  カテゴリサイドバーのボタン
  ProductInfoButton.tsx     商品の基本ボタン（バッジ・在庫数表示）
  QuantitySelector.tsx      数量変更 UI（削除・マイナス・プラスの 3 ボタン）
  ProductQuantityControl.tsx ProductInfoButton + QuantitySelector の複合コンポーネント
  ChooseOptionModal.tsx     コーヒーのドリップ方法選択モーダル
```

### コンポーネント設計の特徴

- **Props による制御**: コンポーネントは表示ロジックに特化し、状態は親（`usecase.tsx`）から Props で渡します
- **`_components/` ディレクトリ**: ページ固有のコンポーネントはそのページ配下の `_components/` に配置します（Next.js の Route Group 規約に準拠）
- **`ui/` ディレクトリ**: 複数のページで共有する汎用コンポーネントをここに配置します
- **タブレット向け UI**: ボタンは最小高さ 80px 以上に設定し、タッチ操作しやすいサイズを確保しています

### 商品タイプによる表示の分岐

```typescript
if (product.productType === ProductType.COFFEE) {
  // ProductInfoButton → タップで ChooseOptionModal（ドリップ方法選択）
} else {
  // ProductQuantityControl → その場で数量増減
}
```

コーヒーはドリップ方法（`CoffeeBrew`）によって金額が異なるため、モーダルで選択させます。その他の商品は在庫がある場合のみ注文可能で、`stock === 0` のとき `isDisabled` になります。

---

## 開発時の起動方法

### 前提条件

- bun がインストール済みであること
- logoregi-backend（ポート 8080）が起動済みであること

### 単体起動

```bash
cd logoregi-togo

# 依存関係のインストール（初回のみ）
bun install

# 開発サーバー起動
bun run dev
```

ブラウザで `http://localhost:3000` を開きます（Next.js のデフォルトポート）。

### モノレポ全体からの起動

プロジェクトルートから `task dev` を実行すると全サービスが起動します。その場合 logoregi-togo は **ポート 3003** で起動します。

```bash
# プロジェクトルートで
task dev
```

### Docker でのビルド・起動

```bash
# 本番イメージのビルド（環境変数を build-arg で渡す）
docker build \
  --build-arg NEXT_PUBLIC_POS_GRPC=http://logoregi-backend:8080 \
  -t logoregi-togo .

# コンテナ起動（ポート 3003 を公開）
docker run -p 3003:3003 logoregi-togo
```

Dockerfile は `oven/bun:latest` ベースで、`bun install --frozen-lockfile` → `bun run build` → `bun start` の手順でビルドします。

### 利用可能なスクリプト

| コマンド | 内容 |
|---------|------|
| `bun run dev` | 開発サーバー起動（ホットリロード有効） |
| `bun run build` | 本番ビルド |
| `bun run start` | 本番サーバー起動 |
| `bun run lint` | ESLint による Lint チェック |

---

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `NEXT_PUBLIC_POS_GRPC` | logoregi-backend の URL | `http://localhost:8080` |

`NEXT_PUBLIC_` プレフィックスがついているため、ブラウザ側のコードに埋め込まれます。本番環境ではビルド時に `--build-arg` で渡すか、`.env.local` ファイルに記述します。

```bash
# .env.local（ローカル開発用）
NEXT_PUBLIC_POS_GRPC=http://localhost:8080
```

```bash
# .env.production（本番環境用）
NEXT_PUBLIC_POS_GRPC=https://api.your-domain.example.com
```

---

## 開発時の注意点

### iPad mini での動作確認

このアプリは iPad mini での使用を前提としています。`app/ipadmini.reset.css` に iPad mini 2 で Chrome と同等の表示にするためのリセット CSS が適用されています。

デベロッパーツールでデバイスを iPad mini に設定して確認することを推奨します。

### clientId について

`useClientId()` は初回アクセス時に `PostNewClient` RPC を呼び出し、取得した ID を `localStorage` に保存します。`localStorage` はブラウザのセッション間で保持されるため、同じ端末であれば再起動後も同じ `clientId` が使われます。開発中に `clientId` をリセットしたい場合は、ブラウザの DevTools > Application > Local Storage で `clientId` キーを削除してください。

### 非同期アトムの扱い

`clientIdAtom` は非同期アトムのため、初回レンダリング時は `useClientId()` が `null`（または未解決の Promise の値）を返す場合があります。注文送信時に `clientId ?? ''` で空文字列にフォールバックしていますが、実際の注文はユーザーが操作するまで発生しないため問題になりません。

### Proto パッケージの更新

`@kaguragateway/cafelogos-grpc` は GitHub の tarball から直接インストールされます。新しいバージョンに更新する場合は `package.json` の URL を変更して `bun install` を再実行します。

```json
"@kaguragateway/cafelogos-grpc": "https://github.com/KaguraGateway/cafelogos-grpc/archive/refs/tags/v1.0.XX.tar.gz"
```

---

## 関連ドキュメント

| ドキュメント | 内容 |
|------------|------|
| `docs/onboarding/README.md` | モノレポ全体のアーキテクチャ・開発セットアップ |
| `proto/proto/pos/pos_service.proto` | POS サービスの API 定義 |
| `logoregi-handy/` | 店員ハンディ端末アプリ（同じ技術スタック、構造が類似） |
