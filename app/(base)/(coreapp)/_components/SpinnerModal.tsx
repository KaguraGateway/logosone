'use client';

import { Center, Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { memo } from 'react';

import { useOrderLink } from '@/jotai/orderlink';

function SpinnerModalComponent({ isConnected }: { isConnected: boolean }) {
  return (
    <Modal isOpen={!isConnected} onClose={() => {}}>
      <ModalOverlay />
      <Center position="relative" zIndex={9999999}>
        <Spinner thickness="4px" speed="1s" emptyColor="gray.200" color="blue.500" size="2xl"></Spinner>
      </Center>
    </Modal>
  );
}
const SpinnerModalComponentMemo = memo(SpinnerModalComponent);

export function SpinnerModal() {
  const { isConnected } = useOrderLink();

  return <SpinnerModalComponentMemo isConnected={isConnected} />;
}
