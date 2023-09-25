import { createContext, useEffect, useMemo } from 'react';

import { Event, EventSchema } from '@/zod/event';

type EventType = 'open' | 'close' | 'event';

export type WSEvent = {
  target: WebSocketClient;
};
type WSEventCallback = (event: WSEvent) => void;
export type WSEventMsg = WSEvent & {
  detail: Event;
};
type WSEventMsgCallback = (event: WSEventMsg) => void;

class WebSocketClient extends EventTarget {
  private ws: WebSocket | null = null;
  private connectionRetryCount = 0;

  private onOpen = () => {
    console.log('WebSocketClient.onOpen');
    this.connectionRetryCount = 0;
    this.dispatchEvent(new CustomEvent('open'));
  };

  private onClose = () => {
    console.warn('WebSocketClient.onClose');
    this.ws = null;
    this.connectionRetryCount += 1;
    this.dispatchEvent(new CustomEvent('close'));
    if (this.connectionRetryCount > 3) {
      setTimeout(() => {
        this.connect();
      }, 5000);
    } else {
      this.connect();
    }
  };

  private onMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const e = EventSchema.parse(data);

      this.dispatchEvent(new CustomEvent(e.Topic, { detail: e }));
    } catch (e) {
      console.error(e);
    }
  };

  on(type: 'open', callback: WSEventCallback): void;
  on(type: 'close', callback: WSEventCallback): void;
  on(type: 'event', callback: WSEventMsgCallback): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(type: EventType, callback: (...args: any[]) => void): void {
    super.addEventListener(type, callback);
  }

  off(type: 'open', callback: WSEventCallback): void;
  off(type: 'close', callback: WSEventCallback): void;
  off(type: 'event', callback: WSEventMsgCallback): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(type: EventType, callback: (...args: any[]) => void): void {
    super.removeEventListener(type, callback);
  }

  readyState() {
    return this.ws?.readyState;
  }

  send(data: Event) {
    if (this.ws != null && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  connect() {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_API;
    if (url == null || typeof url !== 'string') throw new Error('NEXT_PUBLIC_WEBSOCKET_API is not defined');

    this.ws = new WebSocket(url);
    this.ws.addEventListener('open', this.onOpen);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('message', this.onMessage);
  }
}

type WebSocketContextObject = {
  client: WebSocketClient;
};
export const WebSocketContext = createContext<WebSocketContextObject>(null!);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    return new WebSocketClient();
  }, []);
  const contextValue = useMemo(
    () => ({
      client,
    }),
    [client]
  );
  useEffect(() => {
    if (client.readyState() === WebSocket.OPEN) return;
    client.connect();
  }, [client]);

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
}
