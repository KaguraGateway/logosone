import { useEffect, useMemo } from 'react';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { useOrderLink } from '@/jotai/orderlink';
import { OrderStatusEnum } from '@/zod/orders';

// 呼び出し音が止まっていないかを確認する間隔
const CALLING_SOUND_WATCH_INTERVAL_MS = 3000;

export function useCustomer() {
  const { orders } = useOrderLink();
  const { play, stop, isPlaying } = useNotificationSound('/orderlink_customer.mp3', { loop: true });

  const cookingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.Status !== OrderStatusEnum.Provided && order.Status !== OrderStatusEnum.Calling
    );
  }, [orders]);
  const callingOrders = useMemo(() => {
    return orders.filter((order) => order.Status === OrderStatusEnum.Calling);
  }, [orders]);
  const isCalling = callingOrders.length > 0;

  useEffect(() => {
    if (!isCalling) {
      stop();
      return;
    }
    play();
    // ブラウザの自動再生制限などで再生できなかった場合に備えて、再生されているか定期的に確認する
    const timerId = setInterval(() => {
      if (!isPlaying()) play();
    }, CALLING_SOUND_WATCH_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, [isCalling, play, stop, isPlaying]);

  return {
    cookingOrders,
    callingOrders,
  };
}
