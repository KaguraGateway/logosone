'use client';

import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';

import { Stock } from '@/types/Stock';
import { Td } from '@/ui/table/Td';
import { Tr } from '@/ui/table/Tr';
import { TCollectionItem } from '@/ui/table/TCollectionItem';
import { StockFormDialog } from '@/app/(base)/_components/StockForm';
import { DeleteConfirmDialog } from '@/ui/dialog/DeleteConfirmDialog';

export function StockItem({ stock }: { stock: Stock }) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const onCloseDelete = () => setIsOpenDelete(false);
  const onDelete = () => {
    setIsOpenDelete(false);
    // 削除機能は将来的に実装
  };
  const onCloseEdit = () => setIsOpenEdit(false);

  return (
    <TCollectionItem>
      <Tr>
        <Td>{stock.id}</Td>
        <Td>{stock.name}</Td>
        <Td>{stock.quantity}</Td>
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
      <DeleteConfirmDialog
        targetName={stock.name}
        isOpen={isOpenDelete}
        onDelete={onDelete}
        onClose={onCloseDelete}
      />
      <StockFormDialog isOpen={isOpenEdit} onClose={onCloseEdit} />
    </TCollectionItem>
  );
}
