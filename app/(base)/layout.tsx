'use client';

import { WebSocketProvider } from '@/jotai/websocket';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
