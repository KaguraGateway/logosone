'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createTransport } from '@/query/transport';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      sizes: {
        logos: {
          w: '450px',
          h: '128px',
          fontSize: '6xl',
        },
      },
    },
  },
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const transport = createTransport();

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <TransportProvider transport={transport}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </TransportProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
