'use client';

import { Box, Center, Modal, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import { format, fromUnixTime } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { useOrderLink } from '@/jotai/orderlink';

export default function CoreAppLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, lastServerTimeSignal } = useOrderLink();

  return (
    <>
      {children}
      <Modal isOpen={!isConnected} onClose={() => {}}>
        <ModalOverlay />
        <Center position="relative" zIndex={9999999}>
          <Spinner thickness="4px" speed="1s" emptyColor="gray.200" color="blue.500" size="2xl"></Spinner>
        </Center>
      </Modal>
      <Box position="fixed" bottom="0" right="0" p="2" zIndex={9999999}>
        <Text color="gray.400">
          {format(utcToZonedTime(fromUnixTime(lastServerTimeSignal), 'Asia/Tokyo'), 'yyyy/MM/dd HH:mm:ss')}
        </Text>
      </Box>
    </>
  );
}
