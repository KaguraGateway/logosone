'use client';

import Script from 'next/script';

import { WebSocketProvider } from '@/jotai/websocket';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider>
      {children}
      <Script id="sw-register">
        {`
      if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(function() {console.log("[SW] Registerd");})
        .catch(function(e) {console.error("[SW] Failed Register", e)})
      }
    `}
      </Script>
    </WebSocketProvider>
  );
}
