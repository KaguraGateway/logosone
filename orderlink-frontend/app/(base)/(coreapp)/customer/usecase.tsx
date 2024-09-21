import { useMemo } from 'react';

import { useOrderLink } from '@/jotai/orderlink';
import { OrderStatusEnum } from '@/zod/orders';

export function useCustomer() {
  const { orders } = useOrderLink();

  const cookingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.Status !== OrderStatusEnum.Provided && order.Status !== OrderStatusEnum.Calling
    );
  }, [orders]);
  const callingOrders = useMemo(() => {
    return orders.filter((order) => order.Status === OrderStatusEnum.Calling);
  }, [orders]);

  return {
    cookingOrders,
    callingOrders,
  };
}
