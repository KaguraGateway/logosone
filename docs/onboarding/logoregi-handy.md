# logoregi-handy オンボーディングガイド

## サービス概要

`logoregi-handy` は、カフェロゴスの**店員向けハンディ端末アプリ**です。iPad mini などのモバイルデバイスを使い、店員がイートイン（EatIn）の注文を受け付けるために使用します。

### ユースケース

- 店員がテーブル・カウンターの座席を選択する
- 商品カテゴリから注文内容を入力する
- コーヒー商品はドリップ方法（CoffeeBrew）を選択する
- 注文確認画面で内容を確認してバックエンドへ送信する
- 座席ごとの未払い注文履歴を確認し、追加注文を受け付ける

### イートインの注文フロー

```
ホーム (/home)
  └─ ホール業務ボタン押下
       └─ 担当者選択 (/staffSelection)
            ├─ ロゴスメンバー → ウェイター画面 (/waiter)
            └─ トレーニングモード → ウェイター画面 (/waiter)

ウェイター画面 (/waiter)
  ├─ [注文入力] ボタン → 注文入力画面 (/orderEntry)
  │    ├─ 座席未選択の場合 → TicketNumberInputModal で座席を選択
  │    ├─ 商品を選択・数量入力
  │    │    ├─ Coffee商品 → ChooseOptionModal でドリップ方法を選択
  │    │    └─ Other商品 → ProductQuantityControl で数量を直接入力
  │    ├─ [注文確認] ボタン → 注文確認画面（同一ページ内のstate切替）
  │    │    └─ [注文送信] → バックエンドへ postOrder → /waiter へリダイレクト
  │    └─ [戻る] ボタン → /waiter
  │
  └─ 座席ボタン (テーブル / カウンター) → 注文履歴 (/orderHistory?seatId=...)
       ├─ 未払い注文の一覧と合計金額を表示
       ├─ [追加注文] → /orderEntry?seatId=...
       └─ [戻る] → /waiter
```

> **補足**: `/orderEntry?seatId=xxx` のようにURLクエリで `seatId` を渡した場合、TicketNumberInputModal は表示されず、その座席が自動選択される。

---

## 技術スタック

| 分類 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js (App Router) | 14.2.24 |
| 言語 | TypeScript | ^5.6.3 |
| UI ライブラリ | Chakra UI | v2 (`@chakra-ui/react` ^2.10.2) |
| gRPC クライアント | Connect-Query / Connect-Web | ^1.4.0 |
| サーバー状態管理 | TanStack React Query | ^5.67.3 |
| クライアント状態管理 | jotai | ^2.10.0 |
| アニメーション | framer-motion | ^11.11.8 |
| アイコン | react-icons | ^5.3.0 |
| Proto 型定義 | @kaguragateway/cafelogos-grpc | v1.0.21 |
| パッケージマネージャ | Bun (npm 互換) | - |
| ビルドツール | Next.js webpack + @svgr/webpack | - |
| リンター/フォーマッター | Prettier | ^3.3.3 |

> **Chakra UI のバージョン注意**: `logoregi-admin` は v3 を使用しているが、`logoregi-handy` は **v2** を使用している。APIが異なる部分があるため混同しないよう注意。

---

## ディレクトリ構成

```
logoregi-handy/
├── app/                          # Next.js App Router のルートディレクトリ
│   ├── layout.tsx                # ルートレイアウト（メタデータ設定・Providers 適用）
│   ├── providers.tsx             # ChakraProvider / TransportProvider / QueryClientProvider
│   ├── ipadmini.reset.css        # iPad mini 向けリセット CSS
│   ├── favicon.ico / apple-icon.png
│   └── (handy)/                  # ハンディ端末全体のルートグループ
│       ├── layout.tsx            # Header + ErrorModal を含むレイアウト
│       ├── page.tsx              # / → /home の内容を表示
│       ├── (header)/             # ヘッダー付きレイアウトグループ
│       │   ├── layout.tsx        # Header + padding を付与するレイアウト
│       │   ├── home/
│       │   │   └── page.tsx      # ホーム画面（「ホール業務」ボタン）
│       │   └── waiter/
│       │       ├── page.tsx      # ウェイター画面（座席一覧・注文入力）
│       │       └── _components/
│       │           ├── TicketSelectButton.tsx  # 座席選択ボタン
│       │           └── WorkEndModal.tsx        # ホール業務終了確認モーダル
│       └── (noHeader)/           # ヘッダーなしレイアウトグループ
│           ├── _components/
│           │   └── ProductInfoCard.tsx         # 注文確認画面の商品カード
│           ├── orderEntry/
│           │   ├── page.tsx      # 注文入力・注文確認画面（state で切替）
│           │   ├── usecase.tsx   # 注文入力のビジネスロジック（カスタムフック）
│           │   ├── utils/
│           │   │   └── productUtils.tsx        # 商品・CoffeeBrew の検索ユーティリティ
│           │   └── _components/
│           │       ├── CategorySelectButton.tsx    # カテゴリ選択ボタン（左サイドバー）
│           │       ├── ChooseOptionModal.tsx       # コーヒードリップ方法選択モーダル
│           │       ├── ProductInfoButton.tsx       # 商品ボタン（在庫・数量バッジ付き）
│           │       ├── ProductQuantityControl.tsx  # 商品ボタン + 数量セレクター複合
│           │       ├── QuantitySelector.tsx        # 数量操作ボタン（+/-/削除）
│           │       └── TicketNumberInputModal.tsx  # 座席選択モーダル
│           ├── orderHistory/
│           │   └── page.tsx      # 注文履歴画面（未払い注文・合計金額表示）
│           └── staffSelection/
│               └── page.tsx      # 担当者選択画面
│
├── jotai/                        # jotai アトム定義
│   ├── clientId.tsx              # クライアントID（自動登録・localStorage永続化）
│   └── errorModal.tsx            # エラーモーダルの表示状態
│
├── query/                        # バックエンドとの通信（connect-query ラッパー）
│   ├── transport.ts              # Connect トランスポート生成
│   ├── getProducts.tsx           # 商品一覧取得
│   ├── getSeats.tsx              # 座席一覧取得
│   ├── getUnpaidOrders.tsx       # 未払い注文取得（座席ID指定）
│   └── postOrder.tsx             # 注文送信（Mutation）
│
├── ui/                           # 共通UIコンポーネント
│   ├── Header.tsx                # ヘッダー（ロゴ表示・/waiter へリンク）
│   ├── NavBar.tsx                # ナビバー（戻るボタン付き・汎用）
│   └── ErrorModal.tsx            # エラーモーダル
│
├── svg/
│   └── header_logo.svg           # ヘッダーロゴ（@svgr/webpack で React コンポーネントに変換）
│
├── public/                       # 静的ファイル
├── next.config.js                # Next.js 設定（SVG の webpack ルール）
├── tsconfig.json                 # TypeScript 設定（@/* パスエイリアス）
├── .env.example                  # 環境変数のサンプル
├── .prettierrc                   # Prettier 設定
├── Dockerfile                    # 本番用 Docker イメージ（bun ベース）
└── README.md                     # Next.js デフォルト README
```

---

## 主要な機能・ページ一覧

| URL | ページ名 | 概要 |
|-----|---------|------|
| `/` または `/home` | ホーム | 「ホール業務（注文・配膳）」ボタン。`/staffSelection` へ遷移 |
| `/staffSelection` | 担当者選択 | 「ロゴスメンバー」または「トレーニングモード」を選択して `/waiter` へ遷移 |
| `/waiter` | ウェイター | 注文入力ボタン・座席（テーブル/カウンター/その他）一覧を表示。座席タップで注文履歴へ遷移 |
| `/orderEntry` | 注文入力 | カテゴリ左サイドバー + 商品リストで注文を入力。確認画面への遷移・送信を管理 |
| `/orderEntry?seatId=xxx` | 注文入力（座席指定） | 座席選択モーダルをスキップして直接注文入力 |
| `/orderHistory?seatId=xxx` | 注文履歴 | 指定座席の未払い注文一覧と合計金額を表示。追加注文ボタンあり |

---

## バックエンドとの通信方法

### 通信プロトコル

バックエンド（`logoregi-backend`、ポート 8080）との通信は **Connect プロトコル（gRPC-Web 互換）** を使用します。

### トランスポート設定

`query/transport.ts` でトランスポートを生成し、`app/providers.tsx` で `TransportProvider` に渡します。

```ts
// query/transport.ts
import { createConnectTransport } from '@connectrpc/connect-web';

export function createTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_POS_GRPC ?? 'http://localhost:8080',
  });
}
```

```tsx
// app/providers.tsx（抜粋）
<TransportProvider transport={transport}>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</TransportProvider>
```

### クエリ・ミューテーション一覧

| ファイル | 関数名 | 種別 | gRPC メソッド | 用途 |
|---------|--------|------|--------------|------|
| `query/getProducts.tsx` | `useProductQuery()` | Query | `getProducts` | 商品一覧の取得 |
| `query/getSeats.tsx` | `useSeatQuery()` | Query | `getSeats` | 座席一覧の取得 |
| `query/getUnpaidOrders.tsx` | `useUnpaidOrdersQuery(seatId)` | Query | `getUnpaidOrdersBySeatId` | 座席の未払い注文一覧 |
| `query/postOrder.tsx` | `usePostOrderMutation()` | Mutation | `postOrder` | 注文の送信 |

### Proto 型定義

型定義は `@kaguragateway/cafelogos-grpc` パッケージ（GitHub Packages）から取得します。主な型は以下の通りです。

```ts
import { Product, ProductType, CoffeeBrew, OrderType } from
  '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_pb';

import { getProducts, getSeats, postOrder, getUnpaidOrdersBySeatId } from
  '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
```

### 注文送信時のペイロード

```ts
orderMutate.mutateAsync({
  order: {
    items: [{ productId, quantity, amount: BigInt(amount), coffeeBrewId }],
    orderType: OrderType.EatIn,   // イートインのみ
    orderAt: new Date().toISOString(),
    clientId: clientId,           // jotai で管理する端末ID
    seatId: currentSeatId,        // 選択した座席ID
  },
});
```

---

## 状態管理（jotai）の方針とアトム一覧

### 方針

- **サーバー状態**（商品・座席・注文など）は TanStack Query（connect-query）で管理する
- **クライアント状態**でグローバルに共有が必要なものだけ jotai を使用する
- ページ内の局所的な状態は `useState` で管理する（jotai は使わない）

### アトム一覧

#### `jotai/clientId.tsx` - クライアントID

```ts
const clientIdAtom = atom(async () => { ... });
```

| 項目 | 説明 |
|------|------|
| 型 | `Atom<Promise<string>>` |
| 用途 | ハンディ端末を識別する一意のクライアントID |
| 初期化 | `localStorage` に保存済みIDがあればそれを使用。なければバックエンドの `postNewClient` を呼び出して新規登録し localStorage に保存 |
| 利用箇所 | `orderEntry/usecase.tsx` で注文送信時の `clientId` フィールドに使用 |

```ts
// 使い方
export function useClientId() {
  const [clientId] = useAtom(clientIdAtom);
  return clientId; // Promise<string> を jotai が自動解決する
}
```

#### `jotai/errorModal.tsx` - エラーモーダル

```ts
const errorTitleAtom = atom('');
const errorMessageAtom = atom('');
```

| アトム | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| `errorTitleAtom` | `string` | `''` | エラーモーダルのタイトル |
| `errorMessageAtom` | `string` | `''` | エラーモーダルの本文 |

モーダルの開閉は文字列の有無で制御します（両方が非空文字の場合に表示）。

```ts
// 使い方
export function useErrorModal() {
  const isErrorModalOpen = errorTitle.length != 0 && errorMessage.length != 0;
  const onErrorModalOpen = (title: string, message: string) => { ... };
  const onErrorModalClose = () => { setErrorTitle(''); setErrorMessage(''); };
  return { isErrorModalOpen, onErrorModalOpen, onErrorModalClose, errorTitle, errorMessage };
}
```

エラーモーダルは `app/(handy)/layout.tsx` に常時マウントされており、アプリ全体から `onErrorModalOpen` を呼び出せます。

---

## UIコンポーネント設計

### Chakra UI テーマ（カスタマイズ）

`app/providers.tsx` でグローバルテーマを拡張しています。

```ts
const theme = extendTheme({
  styles: { global: { body: { backgroundColor: 'gray.100' } } },
  components: {
    Button: {
      sizes: { logos: { w: '450px', h: '128px', fontSize: '6xl' } },
    },
  },
});
```

カラーパレットとして主にオレンジ系（`orange.700`）・グレー系を使用します。

### レイアウト構造

```
RootLayout (app/layout.tsx)
  └─ Providers（Chakra / Connect / QueryClient）
       └─ HandyLayout (app/(handy)/layout.tsx)
            ├─ Header（固定ヘッダー・高さ60px）
            ├─ <Box mt="60px"> ... children ... </Box>
            └─ ErrorModal（グローバルエラー表示）
```

`(header)` グループと `(noHeader)` グループでレイアウトを切り替えています。

- `(header)/layout.tsx`: Header + `padding: 1.5rem` を付与する（ウェイター・ホーム画面）
- `(noHeader)/` グループ: ページ側でフルスクリーンレイアウトを自前で組む（注文入力・注文履歴）

### 共通 UI コンポーネント

| コンポーネント | ファイル | 役割 |
|-------------|---------|------|
| `Header` | `ui/Header.tsx` | ロゴ表示・タップで `/waiter` へ遷移。高さ 60px の固定ヘッダー |
| `NavBar` | `ui/NavBar.tsx` | 戻るボタン付きナビバー（現在は未使用・汎用目的で用意） |
| `ErrorModal` | `ui/ErrorModal.tsx` | エラータイトル・メッセージを表示するモーダル。`closeOnOverlayClick={false}` |

### ページ内コンポーネント

| コンポーネント | ファイル | 役割 |
|-------------|---------|------|
| `TicketSelectButton` | `waiter/_components/` | 座席ボタン（灰色ベース） |
| `WorkEndModal` | `waiter/_components/` | ホール業務終了確認モーダル |
| `ProductInfoCard` | `(noHeader)/_components/` | 注文確認画面での商品+数量カード（読み取り専用） |
| `CategorySelectButton` | `orderEntry/_components/` | カテゴリ選択ボタン（選択中はオレンジ・非選択は白） |
| `ProductInfoButton` | `orderEntry/_components/` | 商品名・注文数バッジ・在庫数を表示するボタン |
| `ProductQuantityControl` | `orderEntry/_components/` | `ProductInfoButton` + `QuantitySelector` の複合コンポーネント |
| `QuantitySelector` | `orderEntry/_components/` | 数量を増減・削除する操作ボタン群（+/-/ゴミ箱） |
| `ChooseOptionModal` | `orderEntry/_components/` | コーヒードリップ方法を選択するモーダル |
| `TicketNumberInputModal` | `orderEntry/_components/` | 座席選択モーダル（テーブル/カウンター/その他でラジオ切替） |

### 商品タイプ別の UI

```
ProductType.COFFEE
  → ProductInfoButton（タップで ChooseOptionModal が開く）
    → ChooseOptionModal 内に ProductQuantityControl（ドリップ方法ごとに数量制御）

ProductType.OTHER
  → ProductQuantityControl（直接タップで +1、QuantitySelector で細かく制御）
```

### フローティングフッター

注文入力・注文履歴・ウェイター画面では、画面下部に固定フッターとして「戻る」「送信/確認」ボタンを配置するパターンを共通使用しています。

```tsx
<Flex position="fixed" bottom="0" left="0" right="0" ...>
  <Button flex={1} colorScheme="red">戻る</Button>
  <Button flex={3} colorScheme="green">注文送信</Button>
</Flex>
```

---

## 開発時の起動方法

### 単独起動

```bash
cd logoregi-handy

# 依存関係のインストール（初回のみ）
bun install

# 開発サーバー起動（http://localhost:3002）
bun run dev
```

> `package.json` の `scripts.dev` は `next dev` を実行します。ポートは `.env` の `PORT=3002` で設定されます。

### プロジェクト全体での起動

モノレポルートから Taskfile を使用して全サービスをまとめて起動できます。

```bash
# モノレポルートで
task dev
```

バックエンド（`logoregi-backend`）が起動していない場合、gRPC 通信がすべて失敗するため、必ずバックエンドも同時に起動してください。

### ビルド

```bash
bun run build   # 本番ビルド
bun run start   # 本番サーバー起動
```

### Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_POS_GRPC=http://localhost:8080 \
  -t logoregi-handy .
docker run -p 3000:3000 logoregi-handy
```

---

## 環境変数

`.env.example` に定義されている環境変数の一覧です。

| 変数名 | デフォルト値 | 説明 |
|--------|------------|------|
| `PORT` | `3002` | 開発サーバーが使用するポート番号 |
| `NEXT_PUBLIC_POS_GRPC` | `http://localhost:8080` | `logoregi-backend`（POSコアバックエンド）の gRPC エンドポイント URL |

設定方法:

```bash
cp .env.example .env.local
# .env.local を編集
```

> `NEXT_PUBLIC_` プレフィックスがあるため、この変数はクライアントサイド（ブラウザ）でも参照できます。本番環境では Docker ビルド引数（`--build-arg NEXT_PUBLIC_POS_GRPC=...`）として渡します。

---

## 開発上の注意点

### iPad mini 向け最適化

このアプリは iPad mini 2 以降での動作を想定して設計されています。`app/ipadmini.reset.css` にデバイス固有のリセット CSS が含まれており、Chrome と同等の表示になるよう調整しています。

### SVG の扱い

`.svg` ファイルは `@svgr/webpack` によって React コンポーネントとして import できます。

```tsx
import Logo from '@/svg/header_logo.svg';
// <Logo /> として使用可能
```

`next.config.js` で以下のように設定済みです:

```js
config.module.rules.push({ test: /\.svg$/i, use: ['@svgr/webpack'] });
```

### パスエイリアス

`tsconfig.json` で `@/*` がルートディレクトリを指すように設定されています。

```ts
import { createTransport } from '@/query/transport';
import { useErrorModal } from '@/jotai/errorModal';
```

### usecase パターン

`orderEntry/usecase.tsx` の `useOrderEntryUseCase()` は、注文入力ページの全ビジネスロジックをカスタムフックとして分離しています。`page.tsx` はこのフックの戻り値を受け取り、表示コンポーネントにプロップスとして展開するだけの薄いレイヤーとして設計されています。

```tsx
// page.tsx
export default function Page() {
  const usecase = useOrderEntryUseCase();
  if (usecase.state === 0) return <OrderEntry {...usecase} />;
  return <OrderCheck {...usecase} />;
}
```

### トレーニングモード

`staffSelection` 画面の「トレーニングモード」ボタンは現在 `/waiter` へ遷移するだけで、注文送信をブロックする機能は実装されていません（UI は用意済み）。

---

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `docs/onboarding/README.md` | LogosOne 全体のアーキテクチャ・開発環境セットアップ |
| `logoregi-backend/` | POSコアバックエンド（Go）の実装 |
| `proto/` | Protocol Buffers 定義・コード生成手順 |
