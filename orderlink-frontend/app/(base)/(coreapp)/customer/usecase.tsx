import { useEffect, useMemo, useState } from 'react';

import { useOrderLink } from '@/jotai/orderlink';
import { OrderItemStatusEnum } from '@/zod/order_items';
import { OrderStatusEnum } from '@/zod/orders';
import { CookingTime } from '@/zod/cooking_times';

export function useCustomer() {
  const { orders, orderItems } = useOrderLink();
  const [cookingTimes, setCookingTimes] = useState<CookingTime[]>([]);

  useEffect(() => {
    const handleCookingTimesMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'CookingTimes') {
          setCookingTimes(data.data.CookingTimes || []);
        }
      } catch (e) {
        console.error('Failed to parse cooking times data:', e);
      }
    };

    window.addEventListener('message', handleCookingTimesMessage);

    return () => {
      window.removeEventListener('message', handleCookingTimesMessage);
    };
  }, []);

  const cookingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.Status !== OrderStatusEnum.Provided && order.Status !== OrderStatusEnum.Calling
    );
  }, [orders]);

  const callingOrders = useMemo(() => {
    return orders.filter((order) => order.Status === OrderStatusEnum.Calling);
  }, [orders]);

  const ordersWithEstimatedTime = useMemo(() => {
    return cookingOrders.map(order => {
      const items = orderItems.filter(item => item.OrderId === order.OrderId);
      
      let totalEstimatedTime = 0;
      
      items.forEach(item => {
        if (item.Status === OrderItemStatusEnum.Cooking || item.Status === OrderItemStatusEnum.NotYet) {
          const cookingTime = cookingTimes.find(ct => ct.ProductId === item.ProductId);
          
          if (cookingTime) {
            if (item.Status === OrderItemStatusEnum.Cooking && item.CookingStartTime) {
              const elapsedSeconds = Math.floor((Date.now() - new Date(item.CookingStartTime).getTime()) / 1000);
              const remainingTime = Math.max(0, cookingTime.AverageCookingTime - elapsedSeconds);
              totalEstimatedTime = Math.max(totalEstimatedTime, remainingTime);
            } 
            else if (item.Status === OrderItemStatusEnum.NotYet) {
              totalEstimatedTime = Math.max(totalEstimatedTime, cookingTime.AverageCookingTime);
            }
          }
        }
      });
      
      return {
        ...order,
        estimatedWaitingTime: totalEstimatedTime > 0 ? totalEstimatedTime : undefined
      };
    });
  }, [cookingOrders, orderItems, cookingTimes]);

  return {
    cookingOrders: ordersWithEstimatedTime,
    callingOrders,
  };
}
