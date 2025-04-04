'use client';
import { Box, Flex } from '@chakra-ui/react';
import { DeleteProductRequestSchema } from 'proto/scripts/pos/pos_service_pb';
import { create } from '@bufbuild/protobuf';
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaInternetExplorer, FaRegEyeSlash, FaRegTrashAlt } from 'react-icons/fa';

import { useMutationDeleteProduct } from '@/query/deleteProduct';
import { Product } from '@/types/Product';
import { DeleteConfirmDialog } from '@/ui/dialog/DeleteConfirmDialog';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { Td } from '@/ui/table/Td';
import { Tr } from '@/ui/table/Tr';

import { CoffeeBrewsTable } from './CoffeeBrewsTable';
import { ProductEditFormDialog } from './ProductEditForm';

export function ProductItem({ product }: { product: Product }) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const deleteMutation = useMutationDeleteProduct();
  const onCloseDelete = () => setIsOpenDelete(false);
  const onDelete = () => {
    setIsOpenDelete(false);
    deleteMutation.mutate(create(DeleteProductRequestSchema, { productId: product.id }));
  };
  const onCloseEdit = () => setIsOpenEdit(false);

  return (
    <TCollectionItem>
      <Tr>
        <Td>{product.name}</Td>
        <Td>
          {product.amount != null && product.type !== 'coffee'
            && product.amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
        </Td>
        <Td>{product.type === 'coffee' ? 'コーヒー' : 'その他'}</Td>
        <Td>{product.categoryName}</Td>
        <Td color={product.isNowSales ? 'green.600' : undefined}>
          {product.isNowSales ? (
            <>
              <FaInternetExplorer />
              <span>公開</span>
            </>
          ) : (
            <>
              <FaRegEyeSlash />
              <span>非表示</span>
            </>
          )}
        </Td>
        <Td></Td>
        <Td>
          <Flex gap={2}>
            <Box as="button" onClick={() => setIsOpenEdit(true)}>
              <AiOutlineEdit />
            </Box>
            <span>/</span>
            <Box as="button" color="red.500" onClick={() => setIsOpenDelete(true)}>
              <FaRegTrashAlt />
            </Box>
          </Flex>
        </Td>
      </Tr>
      {product.coffeeBrews && (
        <Box pt={2}>
          <CoffeeBrewsTable coffeeBrews={product.coffeeBrews} />
        </Box>
      )}
      <DeleteConfirmDialog
        targetName={product.name}
        isOpen={isOpenDelete}
        onDelete={onDelete}
        onClose={onCloseDelete}
      />
      <ProductEditFormDialog isOpen={isOpenEdit} onClose={onCloseEdit} product={product} />
    </TCollectionItem>
  );
}
