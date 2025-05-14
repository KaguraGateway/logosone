import { useEffect, useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
///@ts-ignore
import useSound from 'use-sound';
import { useOrderLink } from '@/jotai/orderlink';
import { OrderStatusEnum } from '@/zod/orders';

export function useCustomer() {
  const { orders } = useOrderLink();
  const [play, {stop}] = useSound('/orderlink_customer.mp3', {
    interrupt:true
  });

  const cookingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.Status !== OrderStatusEnum.Provided && order.Status !== OrderStatusEnum.Calling
    );
  }, [orders]);
  const callingOrders = useMemo(() => {
    return orders.filter((order) => order.Status === OrderStatusEnum.Calling);
  }, [orders]);
  useEffect(() => {
    if (callingOrders.length > 0) {
      play();
    } else {
      stop();
    }
  }, [callingOrders]);
  return {
    cookingOrders,
    callingOrders,
  };
}
