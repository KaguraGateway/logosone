'use client';

import { Center, Modal, ModalOverlay, Spinner } from '@chakra-ui/react';

import { useOrderLink } from '@/jotai/orderlink';

export default function CoreAppLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useOrderLink();

  return (
    <>
      {children}
      <Modal isOpen={!isConnected} onClose={() => {}}>
        <ModalOverlay />
        <Center position="relative" zIndex={9999999}>
          <Spinner thickness="4px" speed="1s" emptyColor="gray.200" color="blue.500" size="2xl"></Spinner>
        </Center>
      </Modal>
    </>
  );
}
