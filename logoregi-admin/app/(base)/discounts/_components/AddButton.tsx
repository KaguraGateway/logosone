'use client';

import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { DiscountNewDialog } from './Form';

export function AddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        display="flex"
        alignItems="center"
        gap={2}
        border="1px solid"
        borderColor="gray.400"
        px={4}
        py={2}
        onClick={() => setIsOpen(true)}
      >
        <FaPlus />
        <span>割引を追加</span>
      </Button>
      <DiscountNewDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
