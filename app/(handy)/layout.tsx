'use client';
import { Box } from '@chakra-ui/react';

import { Header } from '@/ui/Header';

export default function HandyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box mt="60px">{children}</Box>
    </>
  );
}
