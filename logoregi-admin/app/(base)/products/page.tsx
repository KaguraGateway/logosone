'use client';

import {toProductFromProto} from '@/types/Product';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { Th } from '@/ui/table/Th';

import { ProductAddButton } from './_components/ProductAddButton';
import { ProductItem } from './_components/ProductItem';
import {useQueryProducts} from "@/query/getProducts";

export default function Products() {
  const { data } = useQueryProducts();
  const products = data?.products?.map((product) => {
    return toProductFromProto(product);
  }) ?? [];

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
          {products.map((product) => (
            <ProductItem key={product.name} product={product} />
          ))}
        </Tbody>
      </Table>
      <ProductAddButton />
    </div>
  );
}
