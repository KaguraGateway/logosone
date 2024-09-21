'use client';

import { Center, Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { memo, useContext } from 'react';

import { WebSocketContext } from '@/jotai/websocket';

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
  const { isConnected } = useContext(WebSocketContext);

  return <SpinnerModalComponentMemo isConnected={isConnected} />;
}
