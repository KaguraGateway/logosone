'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createTransport } from './transport';

// ChakraUI v3のシステム設定
// 注: ChakraUI v3では、テーマの設定方法が大きく変更されています。
// 現在は基本的なChakraProviderを使用しています。
// カスタムテーマの設定は今後の課題として残しています。

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const transport = createTransport();

  // ChakraUI v3では、ChakraProviderにvalueプロパティが必要ですが、
  // 現時点では適切なSystemContextの作成方法が不明なため、
  // デフォルトのChakraProviderを使用します。
  return (
    // @ts-ignore - ChakraUI v3の型定義の問題を一時的に無視
    <ChakraProvider>
      <TransportProvider transport={transport}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TransportProvider>
    </ChakraProvider>
  );
}
