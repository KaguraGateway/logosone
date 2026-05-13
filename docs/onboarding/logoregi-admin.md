# logoregi-admin オンボーディングガイド

## サービス概要

`logoregi-admin` は **LogoREGI POS システムの管理ダッシュボード** です。カフェのオーナー・管理者が利用するバックオフィス画面で、以下の業務を Web ブラウザから操作できます。

- 商品マスタの管理（追加・編集・削除）
- 在庫の管理
- 注文履歴の閲覧
- 売上分析（総合・時間帯別・支払い方法別・商品別）
- 座席マスタの管理
- 割引券の管理

モノレポ `logosone` の一部として動作し、バックエンドは `logoregi-backend`（Go 製 gRPC サーバー、デフォルト `:8080`）と通信します。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript 5 |
| パッケージマネージャ | Bun 1.2.5 |
| UI ライブラリ | Chakra UI v3 (`@chakra-ui/react@3`) |
| gRPC クライアント | Connect-Query v2 (`@connectrpc/connect-query`) |
| サーバー通信プロトコル | Connect Protocol (HTTP/1.1 + Protocol Buffers) |
| サーバー状態管理 | TanStack Query v5 (`@tanstack/react-query`) |
| Protobuf ランタイム | `@bufbuild/protobuf` v2 |
| フォント | Noto Sans JP (Google Fonts) |
| 日付処理 | `date-fns` v4 + `date-fns-tz` v3 |
| アニメーション | Framer Motion v12 |
| アイコン | React Icons v5 |

---

## ディレクトリ構成と各ディレクトリの役割

```
logoregi-admin/
├── app/                          # Next.js App Router のエントリポイント
│   ├── layout.tsx                # ルートレイアウト（フォント・プロバイダー設定）
│   ├── providers.tsx             # クライアントサイドプロバイダーの集約
│   ├── transport.ts              # Connect トランスポート（gRPC 接続設定）
│   ├── globals.css               # グローバルスタイル（背景色のみ）
│   ├── favicon.ico               # ファビコン
│   └── (base)/                   # ベースレイアウトグループ（ヘッダー＋サイドバー付き）
│       ├── layout.tsx            # ベースレイアウト（ヘッダー・サイドバー・メインエリア）
│       ├── page.tsx              # トップページ（/）
│       ├── _components/          # ベースレイアウト共有コンポーネント
│       │   └── StockForm.tsx     # 在庫追加・編集フォーム（ダイアログ付き）
│       ├── products/             # 商品管理ページ（/products）
│       │   ├── page.tsx
│       │   └── _components/      # 商品ページ専用コンポーネント
│       ├── stock/                # 在庫管理ページ（/stock）
│       │   ├── page.tsx
│       │   └── _components/
│       ├── orders/               # 注文履歴ページ（/orders）
│       │   └── page.tsx
│       ├── analysis/             # 売上分析ページ（/analysis）
│       │   ├── page.tsx
│       │   └── _components/      # 各分析セクションコンポーネント
│       ├── seats/                # 座席管理ページ（/seats）
│       │   ├── page.tsx
│       │   └── _components/
│       └── discounts/            # 割引券管理ページ（/discounts）
│           ├── page.tsx
│           └── _components/
│
├── components/
│   └── ui/                       # Chakra UI スニペット（CLI 生成品）
│       ├── avatar.tsx
│       ├── checkbox.tsx
│       ├── close-button.tsx
│       ├── color-mode.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── field.tsx
│       ├── input-group.tsx
│       ├── popover.tsx
│       ├── provider.tsx          # ChakraProvider ラッパー
│       ├── radio.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       └── tooltip.tsx
│
├── query/                        # バックエンド通信フック（Connect-Query）
│   ├── getProducts.tsx           # 商品一覧取得
│   ├── addProduct.tsx            # 商品追加（Mutation）
│   ├── updateProduct.tsx         # 商品更新（Mutation）
│   ├── deleteProduct.tsx         # 商品削除（Mutation）
│   ├── getCategories.tsx         # 商品カテゴリ一覧
│   ├── addCategory.tsx           # カテゴリ追加
│   ├── getCoffeeBeans.tsx        # コーヒー豆一覧
│   ├── addCoffeeBean.tsx         # コーヒー豆追加
│   ├── getStocks.tsx             # 在庫一覧
│   ├── addStock.tsx              # 在庫追加
│   ├── updateStock.tsx           # 在庫更新
│   ├── getOrders.tsx             # 注文履歴一覧
│   ├── getSeats.tsx              # 座席一覧
│   ├── addSeat.tsx               # 座席追加
│   ├── getDiscounts.tsx          # 割引券一覧
│   ├── addDiscount.tsx           # 割引券追加
│   └── sales/                    # 売上分析クエリ群
│       ├── formatDate.ts         # 日付フォーマットユーティリティ
│       ├── getDailySales.tsx     # 日別売上取得
│       ├── getProductSales.tsx   # 商品別売上取得
│       ├── getSalesByPaymentType.tsx # 支払い方法別売上取得
│       └── getSalesByTimeSlot.tsx    # 時間帯別売上取得
│
├── types/                        # TypeScript 型定義 + Proto 変換関数
│   ├── Product.ts                # Product 型 + toProductFromProto()
│   ├── Category.ts               # Category 型
│   ├── CoffeeBean.ts             # CoffeeBean 型
│   ├── CoffeeBrews.ts            # CoffeeBrew 型 + toCoffeeBrewFromProto()
│   ├── Order.ts                  # Order / OrderItem 型 + toOrderFromProto()
│   ├── Discount.ts               # Discount 型 + toDiscountFromProto()
│   ├── Seat.ts                   # Seat 型 + toSeatFromProto()
│   └── Stock.ts                  # Stock 型
│
├── ui/                           # プロジェクト独自の汎用 UI コンポーネント
│   ├── theme/
│   │   ├── theme.ts              # Chakra UI カスタムシステム定義
│   │   └── tokens.ts             # カラートークン定義
│   ├── form/
│   │   ├── Button.tsx            # ボタン（Chakra Button ラッパー）
│   │   ├── Input.tsx             # ラベル付きテキスト入力
│   │   ├── LoadingButton.tsx     # ローディング状態付きボタン
│   │   ├── SelectWithAdd.tsx     # 選択 + 新規追加ボタン付きセレクト
│   │   ├── Switch.tsx            # オン/オフスイッチ（チェックボックスベース）
│   │   └── SwitchRadioGroup.tsx  # スイッチ風ラジオグループ（タブ切り替え UI）
│   ├── nav/
│   │   ├── Sidebar.tsx           # サイドバーナビゲーション
│   │   └── NavItem.tsx           # ナビゲーションアイテム（アクティブ状態付き）
│   ├── table/
│   │   ├── Table.tsx             # テーブルコンテナ（横スクロール対応）
│   │   ├── TableHader.tsx        # テーブルヘッダー行
│   │   ├── Tbody.tsx             # テーブル本体
│   │   ├── Tr.tsx                # テーブル行（flex レイアウト）
│   │   ├── Th.tsx                # テーブルヘッダーセル
│   │   ├── Td.tsx                # テーブルデータセル（flex grow 制御）
│   │   └── TCollectionItem.tsx   # テーブル行グループ（下線区切り）
│   └── dialog/
│       └── DeleteConfirmDialog.tsx # 削除確認ダイアログ
│
├── public/
│   └── logo.svg                  # LogoREGI ロゴ
│
├── .env                          # 環境変数（後述）
├── next.config.js                # Next.js 設定（standalone 出力）
├── tsconfig.json                 # TypeScript 設定（パスエイリアス @/* → ./*）
├── .prettierrc                   # Prettier 設定
├── .vscode/settings.json         # VSCode 設定（保存時フォーマット等）
└── package.json                  # 依存関係・スクリプト定義
```

### ディレクトリの命名規則

- `(base)/` --- Next.js のルートグループ。URL には影響しないが、このグループ配下のページはヘッダー＋サイドバー付きレイアウトを共有する
- `_components/` --- 各ページ固有のコンポーネント（ルーティング対象外の Next.js 規約）
- `query/` --- すべての gRPC 通信ロジックを集約。UI コンポーネントから直接 `@connectrpc/connect-query` を呼ばず、必ずここのカスタムフックを経由する
- `types/` --- Proto 生成型をアプリ独自型に変換する関数を同梱。`toXxxFromProto()` という命名規則
- `ui/` --- 複数ページで使いまわすカスタム UI コンポーネント（Chakra UI のラッパー群）

---

## 主要な機能・ページ一覧

| URL | ページ名 | 機能概要 |
|-----|----------|----------|
| `/` | トップ | ダッシュボードトップ（現在は開発中） |
| `/products` | 商品管理 | 商品一覧表示・追加・編集・削除。コーヒー商品はコーヒー豆・抽出方法（コーヒーブリュー）の管理も含む |
| `/stock` | 在庫管理 | 在庫一覧・追加・編集（在庫名・個数） |
| `/orders` | 注文履歴 | 全注文の履歴表示（注文時間・タイプ・商品・合計金額） |
| `/analysis` | 売上分析 | タブ形式で4種類の集計を表示（総合・時間帯別・支払い方法別・商品別） |
| `/seats` | 座席管理 | 座席一覧・追加（イートイン用テーブル番号等） |
| `/discounts` | 割引券管理 | 割引券一覧・追加（名前・割引価格） |

### 商品ページの詳細

商品は **コーヒー（Coffee）** と **その他（Other）** の 2 種類があります。

**コーヒー商品**
- 使用するコーヒー豆を選択（豆名・在庫グラム数）
- 抽出方法（コーヒーブリュー）を複数登録（淹れ方名・必要豆量 g・価格）
- 価格は抽出方法ごとに設定

**その他商品**
- 固定価格を設定
- 在庫と紐付け可能

**共通フラグ**
- `isNowSales`: 販売中 / 非公開の切り替え
- `isManagingOrder`: OrderLink（注文管理システム）で注文管理を行うか
- `isOlUseKitchen`: OrderLink のキッチンモニターに表示するか

---

## バックエンドとの通信方法

### 通信プロトコル

バックエンド（`logoregi-backend`）とは **Connect Protocol** で通信します。Connect は gRPC 互換の HTTP/1.1 ベースのプロトコルで、ブラウザから直接呼び出せます。

### トランスポートの設定

`app/transport.ts` でトランスポートを生成します：

```typescript
// app/transport.ts
import { createConnectTransport } from '@connectrpc/connect-web';

export function createTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_GRPC_HOST ?? 'http://localhost:8080',
  });
}
```

### プロバイダーの構成

`app/providers.tsx` でアプリ全体に対してトランスポートと TanStack Query クライアントを注入します：

```typescript
// app/providers.tsx
const queryClient = new QueryClient();
const transport = createTransport();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <TransportProvider transport={transport}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TransportProvider>
    </ChakraProvider>
  );
}
```

### クエリフック（データ取得）

`query/` ディレクトリに各 API 呼び出しに対応するカスタムフックを用意しています。`@connectrpc/connect-query` の `useQuery` を使います：

```typescript
// query/getProducts.tsx
import { getProducts } from 'proto/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useQueryProducts() {
  return useQuery(getProducts, undefined, { throwOnError: false });
}
```

### ミューテーションフック（データ更新）

データの作成・更新・削除には `useMutation` を使います。成功後に `queryClient.invalidateQueries()` で関連データを再取得します：

```typescript
// query/addProduct.tsx
export function useMutationAddProduct() {
  const queryClient = useQueryClient();
  const transport = useTransport();
  return useMutation(postProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: createConnectQueryKey({
          schema: PosService.method.getProducts,
          transport: transport,
          cardinality: "finite"
        })
      });
    }
  });
}
```

### Proto 定義と生成コード

API のスキーマはモノレポの `proto/` パッケージで一元管理されています。

- Proto ファイル: `proto/proto/pos/pos_service.proto`
- 生成された TypeScript: `proto/scripts/pos/pos_service_pb.ts`（型定義）
- 生成された Connect-Query フック: `proto/scripts/pos/pos_service-PosService_connectquery.ts`

`package.json` の `"proto": "workspace:*"` により Bun ワークスペース経由で参照しています。

### 利用可能な API メソッド一覧

`proto/scripts/pos/pos_service-PosService_connectquery.ts` で公開されている主なメソッド：

| メソッド名 | 用途 |
|-----------|------|
| `getOrders` | 注文一覧取得 |
| `getProducts` | 商品一覧取得 |
| `postProduct` | 商品追加 |
| `updateProduct` | 商品更新 |
| `deleteProduct` | 商品削除 |
| `getProductCategories` | 商品カテゴリ一覧 |
| `postProductCategory` | カテゴリ追加 |
| `getStocks` | 在庫一覧 |
| `postStock` | 在庫追加 |
| `updateStock` | 在庫更新 |
| `getCoffeeBeans` | コーヒー豆一覧 |
| `postCoffeeBean` | コーヒー豆追加 |
| `getSeats` | 座席一覧 |
| `postSeat` | 座席追加 |
| `getDiscounts` | 割引券一覧 |
| `postDiscount` | 割引券追加 |
| `getDailySales` | 日別売上取得（期間指定） |
| `getProductSales` | 商品別売上取得（期間指定） |
| `getSalesByTimeSlot` | 時間帯別売上取得（日付指定） |
| `getSalesByPaymentType` | 支払い方法別売上取得（期間指定） |

---

## 状態管理の方針

`logoregi-admin` ではグローバルな状態管理ライブラリ（Jotai 等）を使用していません。状態は以下の 2 層に分けて管理します。

### サーバー状態: TanStack Query + Connect-Query

バックエンドのデータはすべて TanStack Query のキャッシュで管理します。

- **取得**: `useQuery` フックが自動的にキャッシュし、再マウント時には不要なリクエストをスキップ
- **更新後の再取得**: Mutation 成功後に `queryClient.invalidateQueries()` を呼び出してキャッシュを無効化し、自動的に再取得する
- エラーは `throwOnError: false` で握りつぶし、コンポーネント側で `error` プロパティを使って処理する

### ローカル状態: React useState

ダイアログの開閉・フォームの入力値など、UI ローカルの状態は各コンポーネント内の `useState` で管理します。外部ライブラリや Context は使用していません。

**典型的なパターン（ダイアログの開閉）:**

```typescript
const [isOpenEdit, setIsOpenEdit] = useState(false);

// JSX 内
<Box as="button" onClick={() => setIsOpenEdit(true)}>
  <AiOutlineEdit />
</Box>
<ProductEditFormDialog isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)} product={product} />
```

### ローディング状態

フォーム送信中のローディング状態はフォームコンポーネント内の `useState` で管理し、`LoadingButton` コンポーネントに渡します：

```typescript
const [isLoading, setIsLoading] = useState(false);

mutate.mutateAsync(data, {
  onSuccess: () => { /* ... */ },
  onSettled: () => { setIsLoading(false); }
});
```

---

## UI コンポーネント設計

### Chakra UI v3

Chakra UI v3 を使用しています（v2 からの重大な変更あり）。以下の点に注意してください。

- **カスタムシステム**: `ui/theme/theme.ts` で `createSystem(defaultConfig, {...})` を作成し、`ChakraProvider` に `value={system}` として渡す
- **カラートークン**: `ui/theme/tokens.ts` でニュートラルカラーとセマンティックトークン（テキスト・背景・ボーダー）を定義
- **カラーモード**: `next-themes` と `ColorModeProvider` を組み合わせてダークモードに対応する準備あり（現状は未使用）

### カスタム UI コンポーネント（`ui/` ディレクトリ）

Chakra UI を直接使わず、`ui/` 配下のラッパーを優先して使います：

| コンポーネント | 用途 |
|--------------|------|
| `ui/form/Button` | 標準ボタン（デフォルト `variant=solid`） |
| `ui/form/Input` | ラベル付きインプット |
| `ui/form/LoadingButton` | 送信中はカラーグラデーション表示するボタン |
| `ui/form/SelectWithAdd` | ドロップダウン選択 + 「追加する」ボタン内蔵のセレクト |
| `ui/form/Switch` | トグルスイッチ（CSS カスタム実装） |
| `ui/form/SwitchRadioGroup` | セグメントコントロール風ラジオグループ |
| `ui/nav/Sidebar` | サイドバーナビゲーション（アクティブ状態の自動検出） |
| `ui/nav/NavItem` | ナビゲーションアイテム（`usePathname` でアクティブ判定） |
| `ui/table/Table` 他 | カスタムテーブルコンポーネント群（flex レイアウト） |
| `ui/dialog/DeleteConfirmDialog` | 削除確認ダイアログ |

### テーブルコンポーネントの構造

標準の `<table>` タグを使わず、flex レイアウトベースのカスタム実装です：

```tsx
<Table>
  <TableHeader>
    <Th>商品名</Th>
    <Th grow="64px">削除</Th>  {/* grow で列幅を固定 */}
  </TableHeader>
  <Tbody>
    <TCollectionItem>  {/* 行グループ（下線付き） */}
      <Tr>
        <Td>値</Td>
        <Td grow="64px">...</Td>
      </Tr>
    </TCollectionItem>
  </Tbody>
</Table>
```

`Td` の `grow` prop で個別の列幅を制御できます。省略時はデフォルトの `flex: 1 0 100px` が適用されます。

### ダイアログの実装パターン

Chakra UI の `Dialog` コンポーネントは使わず、独自実装のオーバーレイパターンを採用しています。

```tsx
// フォームコンポーネントとダイアログコンポーネントを同一ファイルに定義する慣習
export function ProductEditForm(props: Props) { /* ... */ }

export function ProductEditFormDialog(props: DialogProps) {
  if (!props.isOpen) return null;
  return (
    <Box position="fixed" /* ... */ bg="rgba(0, 0, 0, 0.4)" onClick={props.onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        {/* フォームコンテンツ */}
      </Box>
    </Box>
  );
}
```

### レイアウト構造

ベースレイアウト（`app/(base)/layout.tsx`）は CSS Grid で構成されています：

```
┌──────────────────────────────────────────┐
│  ヘッダー（ロゴ）              全幅       │
│  ブランドカラーライン（茶色グラデーション）│
├────────────┬─────────────────────────────┤
│  サイドバー │  メインコンテンツエリア      │
│  （16rem）  │  （白背景・角丸カード）      │
└────────────┴─────────────────────────────┘
```

---

## 開発時の起動方法

### 前提条件

- [Bun](https://bun.sh/) がインストールされていること
- `logoregi-backend` が起動しているか、接続先の gRPC エンドポイントが利用可能なこと

### 単体起動（logoregi-admin のみ）

```bash
# モノレポルートで依存関係インストール（初回のみ）
bun install

# logoregi-admin ディレクトリに移動して起動
cd logoregi-admin
bun run dev
# → http://localhost:3000 でアクセス可能
```

### モノレポ全体からの起動

モノレポルートの `Taskfile.yml` を使ってバックエンド含めた全サービスを一括起動できます：

```bash
# モノレポルートで実行
task dev
```

### ビルド

```bash
cd logoregi-admin
bun run build
bun run start
```

本番ビルドは `next.config.js` の `output: "standalone"` 設定により、スタンドアロン形式（`.next/standalone/`）で出力されます。Docker での本番デプロイに適した形式です。

### コードフォーマット

```bash
bun run prettier   # Prettier でファイルを整形
bun run lint       # ESLint でコードチェック
```

---

## 環境変数

`.env` ファイルに定義します。Next.js の `NEXT_PUBLIC_` プレフィックスがあるため、**ブラウザ側のコードからも参照可能**です。

| 変数名 | デフォルト値 | 説明 |
|--------|------------|------|
| `NEXT_PUBLIC_GRPC_HOST` | `http://localhost:8080` | バックエンド（`logoregi-backend`）の URL |

### `.env` ファイルの例

```
NEXT_PUBLIC_GRPC_HOST="http://localhost:8080"
```

### 本番環境

本番（Cloud Run）では Docker コンテナの環境変数として設定します。`compose.prod.yml` を参照してください。

---

## Proto コードの更新フロー

API スキーマを変更する場合は `proto/` パッケージで作業します。

```bash
# proto ディレクトリに移動
cd proto

# Go ツールのパスを通す（必要に応じて）
export PATH="$PATH:$(go env GOPATH)/bin"

# TypeScript / Go / Swift コードを再生成
bun run generate
```

生成されたコードは `proto/scripts/pos/` に出力されます。`logoregi-admin` は Bun ワークスペーク経由でこのコードを参照しているため、再生成後は即座に利用可能です。

---

## よくある開発パターン

### 新しいページを追加する

1. `app/(base)/` 配下にディレクトリを作成（例: `app/(base)/settings/`）
2. `page.tsx` を作成（`'use client'` ディレクティブを付ける）
3. `ui/nav/Sidebar.tsx` の `navigations` 配列にナビゲーション項目を追加

### 新しい API 呼び出しを追加する

1. `query/` ディレクトリに新しいファイルを作成
2. `proto/scripts/pos/pos_service-PosService_connectquery` からメソッドをインポート
3. `useQuery` または `useMutation` でラップしたカスタムフックをエクスポート
4. Mutation の場合は `onSuccess` で `queryClient.invalidateQueries()` を呼び出す

### Proto の型をアプリ型に変換する

`types/` 配下に型定義ファイルを作成し、`toXxxFromProto()` 変換関数を実装します：

```typescript
// types/MyEntity.ts
import { MyEntity as ProtoMyEntity } from 'proto/scripts/pos/pos_service_pb';

export type MyEntity = {
  id: string;
  name: string;
};

export function toMyEntityFromProto(proto: ProtoMyEntity): MyEntity {
  return {
    id: proto.id,
    name: proto.name,
  };
}
```

---

## 既知の課題・注意事項

- **トップページ（`/`）は未実装**: `page.tsx` に「あつあつ」というプレースホルダーのみ
- **在庫削除は未実装**: `StockItem.tsx` の `onDelete` ハンドラは「将来的に実装」とコメントされている
- **サイドバーのアイコン**: 一部のナビゲーション項目のアイコンが内容と一致していない（例: 商品に `FaJava`、在庫に `FaReact`）
- **型安全性**: `BigInt` を使用する箇所（割引価格等）は `Number()` への変換時に精度損失の可能性あり
- **Chakra UI バージョン差異**: モノレポ内の他フロントエンドアプリ（`logoregi-handy` 等）は Chakra UI v2 を使用しているが、`logoregi-admin` は v3 を使用しており API が異なる点に注意
