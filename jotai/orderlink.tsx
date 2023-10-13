import { atom, useAtom } from 'jotai';
import { useCallback, useContext, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
///@ts-ignore
import useSound from 'use-sound';

import { EventSchema } from '@/zod/event';
import { OrderItemStatus } from '@/zod/order_items';
import { Order, OrdersSchema, OrderStatus } from '@/zod/orders';
import { NewOrderSchema, UpdatedOrderItemSchema, UpdatedOrderSchema } from '@/zod/to_client';
import { UpdateOrderItemStatusSchema, UpdateOrderStatusSchema } from '@/zod/to_server';

import { WebSocketContext, WSEventMsg } from './websocket';

const ordersAtom = atom<Array<Order>>([]);
const connectionStateAtom = atom<boolean>(false);

export function useOrderLink() {
  const { client } = useContext(WebSocketContext);
  const [orders, setOrders] = useAtom(ordersAtom);
  const [isConnected, setIsConnected] = useAtom(connectionStateAtom);
  const [play] = useSound('/orderlink_sound.mp3');

  // Ordersまわりの処理
  useEffect(() => {
    // 各イベントの処理
    const onOrders = (e: WSEventMsg) => {
      const orders = OrdersSchema.parse(e.detail.Message);
      setOrders(orders.Orders);
    };
    const onNewOrder = (e: WSEventMsg) => {
      const order = NewOrderSchema.parse(e.detail.Message);
      // 既知の注文は無視する
      if (orders.find((o) => o.OrderId === order.OrderId) != null) return;

      setOrders([
        ...orders,
        {
          ...order,
          Status: 0,
          OrderItems: order.OrderItems.map((item) => ({
            ...item,
            Status: 0,
          })),
        },
      ]);
      play();
    };
    const onUpdatedOrder = (e: WSEventMsg) => {
      const orderStatus = UpdatedOrderSchema.parse(e.detail.Message);
      setOrders((orders) =>
        orders.map((order) => {
          if (order.OrderId === orderStatus.Id) {
            return { ...order, Status: orderStatus.Status };
          }
          return order;
        })
      );
    };
    const onUpdatedOrderItem = (e: WSEventMsg) => {
      const orderItemStatus = UpdatedOrderItemSchema.parse(e.detail.Message);
      setOrders((orders) =>
        orders.map((order) => {
          if (order.OrderId !== orderItemStatus.OrderId) return order;
          return {
            ...order,
            OrderItems: order.OrderItems.map((item) => {
              if (item.Id !== orderItemStatus.Id) return item;
              return {
                ...item,
                Status: orderItemStatus.Status,
              };
            }),
          };
        })
      );
    };

    // Event受信時の処理
    const onEvent = (e: WSEventMsg) => {
      console.log(e);
      switch (e.detail.Topic) {
        case 'Orders':
          onOrders(e);
          break;
        case 'NewOrder':
          onNewOrder(e);
          break;
        case 'UpdatedOrderStatus':
          onUpdatedOrder(e);
          break;
        case 'UpdatedOrderItemStatus':
          onUpdatedOrderItem(e);
          break;
      }
    };
    // イベント登録
    client.on('event', onEvent);

    // イベント解除
    return () => {
      client.off('event', onEvent);
    };
  }, [client, orders, play, setOrders]);

  // 注文を取得する
  const fetchOrders = useCallback(() => {
    client.send({
      Topic: 'GetOrders',
      Message: {},
    });
  }, [client]);

  // 接続状況の処理
  useEffect(() => {
    const onOpen = () => {
      setIsConnected(true);
      // 接続時に注文を取得する
      fetchOrders();
    };
    const onClose = () => {
      setIsConnected(false);
    };
    client.on('open', onOpen);
    client.on('close', onClose);

    return () => {
      client.off('open', onOpen);
      client.off('close', onClose);
    };
  }, [client, fetchOrders, setIsConnected]);

  // Order状態遷移
  const UpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const eventMsg = UpdateOrderStatusSchema.parse({
      Id: orderId,
      Status: newStatus,
    });
    const event = EventSchema.parse({
      Topic: 'UpdateOrderStatus',
      Message: eventMsg,
    });
    client.send(event);
  };
  // OrderItem状態遷移
  const UpdateOrderItemStatus = (orderItemId: string, newStatus: OrderItemStatus) => {
    const eventMsg = UpdateOrderItemStatusSchema.parse({
      Id: orderItemId,
      Status: newStatus,
    });
    const event = EventSchema.parse({
      Topic: 'UpdateOrderItemStatus',
      Message: eventMsg,
    });
    client.send(event);
  };

  return { orders, isConnected, fetchOrders, UpdateOrderStatus, UpdateOrderItemStatus };
}
