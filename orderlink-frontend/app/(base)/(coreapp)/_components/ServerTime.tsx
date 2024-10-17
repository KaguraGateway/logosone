'use client';

import { Box, Text } from '@chakra-ui/react';
import { format, fromUnixTime } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { useServerTime } from '@/jotai/serverTime';

export function ServerTime() {
  const lastServerTimeSignal = useServerTime();

  return (
    <Box position="fixed" bottom="0" right="0" p="2" zIndex={9999999}>
      <Text color="gray.400">
        {format(toZonedTime(fromUnixTime(lastServerTimeSignal), 'Asia/Tokyo'), 'yyyy/MM/dd HH:mm:ss')}
      </Text>
    </Box>
  );
}
