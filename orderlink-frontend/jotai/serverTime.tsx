import { atom, useAtom } from 'jotai';
import { useContext, useEffect } from 'react';

import { WebSocketContext, WSEventMsg } from './websocket';

const lastServerTimeSignalAtom = atom<number>(0);

export function useServerTime() {
  const { client } = useContext(WebSocketContext);
  const [lastServerTimeSignal, setLastServerTimeSignal] = useAtom(lastServerTimeSignalAtom);

  useEffect(() => {
    const onTimeSignal = (e: WSEventMsg) => {
      setLastServerTimeSignal(e.detail.Message);
    };

    // Event受信時の処理
    const onEvent = (e: WSEventMsg) => {
      switch (e.detail.Topic) {
        case 'TimeSignal':
          onTimeSignal(e);
          break;
      }
    };
    // イベント登録
    client.on('event', onEvent);

    // イベント解除
    return () => {
      client.off('event', onEvent);
    };
  }, [client, setLastServerTimeSignal]);

  return lastServerTimeSignal;
}
