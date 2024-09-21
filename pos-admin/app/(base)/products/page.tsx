import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service_connect';
import { cache } from 'react';

import { createTransport } from '@/app/transport';
import { toProductFromProto } from '@/types/Product';
import { Table } from '@/ui/table/Table';
import { TableHeader } from '@/ui/table/TableHader';
import { Tbody } from '@/ui/table/Tbody';
import { Th } from '@/ui/table/Th';

import { ProductAddButton } from './_components/ProductAddButton';
import { ProductItem } from './_components/ProductItem';

const getProducts = cache(async () => {
  const transport = createTransport();
  const client = createPromiseClient(PosService, transport);
  const data = await client.getProducts({});
  return data.products.map((product) => {
    return toProductFromProto(product);
  });
});

export default async function Products() {
  const products = await getProducts();

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
