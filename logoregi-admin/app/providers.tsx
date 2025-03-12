'use client';

import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createTransport } from './transport';
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/ui/theme/theme";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient()
const transport = createTransport();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <TransportProvider transport={transport}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TransportProvider>
    </ChakraProvider>
  );
}
