'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createTransport } from './transport';

// PandaCSSのテーマ設定をChakraUIのテーマに変換
const theme = {
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      variants: {
        secondary: {
          bg: 'gray.300',
          _hover: {
            bg: 'gray.400',
          },
        },
        success: {
          bg: 'green.500',
          color: 'white',
          _hover: {
            bg: 'green.600',
          },
        },
        error: {
          bg: 'red.500',
          color: 'white',
          _hover: {
            bg: 'red.600',
          },
        },
      },
    },
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const transport = createTransport();

  return (
    <ChakraProvider theme={theme}>
      <TransportProvider transport={transport}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TransportProvider>
    </ChakraProvider>
  );
}
