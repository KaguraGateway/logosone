'use client';

import { Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type TableProps = ComponentProps<typeof Box>;

export function Table(props: TableProps) {
  return <Box overflowX="auto" {...props} />
}
