import { FaPlus } from "react-icons/fa6";

import { css } from "@/panda/css";
import { Table } from "@/ui/table/Table";
import { TableHeader } from "@/ui/table/TableHader";
import { Tbody } from "@/ui/table/Tbody";
import { Th } from "@/ui/table/Th";

import { ProductItem } from "./_components/ProductItem";
import { Product } from "./type";



const mockProducts: Product[] = [
  {
    name: "ハレノヒブレンド",
    amount: 0,
    type: "コーヒー",
    category: "コーヒー",
    isNowSales: true,
    coffeeBrews: [
      {
        name: "ネル",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "サイフォン",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "ペーパー",
        amount: 500,
        coffeeBeanQuantity: 40,
      }
    ]
  },
  {
    name: "ハレノヒブレンド",
    amount: 0,
    type: "コーヒー",
    category: "コーヒー",
    isNowSales: true,
    coffeeBrews: [
      {
        name: "ネル",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "サイフォン",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "ペーパー",
        amount: 500,
        coffeeBeanQuantity: 40,
      }
    ]
  },
  {
    name: "ハレノヒブレンド",
    amount: 0,
    type: "コーヒー",
    category: "コーヒー",
    isNowSales: false,
    coffeeBrews: [
      {
        name: "ネル",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "サイフォン",
        amount: 500,
        coffeeBeanQuantity: 40,
      },
      {
        name: "ペーパー",
        amount: 500,
        coffeeBeanQuantity: 40,
      }
    ]
  },
  {
    name: "レモネード",
    amount: 100,
    type: "その他",
    category: "ドリンク",
    isNowSales: true,
  },
  {
    name: "カルピス",
    amount: 100,
    type: "その他",
    category: "ドリンク",
    isNowSales: true,
  }
];

export default function Products() {
  return (
    <div>
      <Table>
        <TableHeader>
          <Th>商品名</Th>
          <Th>価格</Th>
          <Th>種類</Th>
          <Th>カテゴリ名</Th>
          <Th>公開設定</Th>
          <Th>必要な豆g</Th>
          <Th>編集 / 削除</Th>
        </TableHeader>
        <Tbody>
          {
            mockProducts.map((product) => <ProductItem key={product.name} product={product} />)
          }
        </Tbody>
      </Table>
      <button className={css({ display: "flex", alignItems: "center", gap: "2", border: "1px solid", borderColor: "gray.400", px: "4", py: "2" })}>
        <FaPlus />
        <span>商品を追加</span>
      </button>
    </div>
  )
}
