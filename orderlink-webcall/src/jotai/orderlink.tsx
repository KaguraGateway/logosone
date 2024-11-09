import {atom, useAtom} from 'jotai';
import {useCallback, useContext, useEffect} from 'react';

import {EventSchema} from '@/zod/event';
import {Order, OrdersSchema} from '@/zod/orders';
import {NewOrderSchema, UpdatedOrderSchema} from '@/zod/to_client';

import {WebSocketContext, WSEventMsg} from './websocket';

const ordersAtom = atom<Array<Order>>([]);

export function useOrderLink() {
    const {client} = useContext(WebSocketContext);
    const [orders, setOrders] = useAtom(ordersAtom);
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
                    OrderItems: order.OrderItems.map((item) => ({
                        ...item,
                    })),
                },
            ]);
        };
        const onUpdatedOrder = (e: WSEventMsg) => {
            const orderStatus = UpdatedOrderSchema.parse(e.detail.Message);
            setOrders((orders) =>
                orders.map((order) => {
                    if (order.OrderId === orderStatus.Id) {
                        return {...order, Status: orderStatus.Status};
                    }
                    return order;
                })
            );
        };

        // Event受信時の処理
        const onEvent = (e: WSEventMsg) => {
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
            }
        };
        // イベント登録
        client.on('event', onEvent);

        // イベント解除
        return () => {
            client.off('event', onEvent);
        };
    }, [client, orders, setOrders]);

    // 注文を取得する
    const fetchOrders = useCallback(() => {
        client.send({
            Topic: 'GetOrders',
            Message: {},
        });
    }, [client]);

    // 接続状況の処理
    useEffect(() => {
        // すでに接続済みの場合（主にホームからの動線）
        if (client.readyState() === WebSocket.OPEN) {
            fetchOrders();
        }

        const onOpen = () => {
            // 接続時に注文を取得する
            fetchOrders();
        };
        client.on('open', onOpen);
        return () => {
            client.off('open', onOpen);
        };
    }, [client, fetchOrders]);

    const SendClientEventLog = (message: string) => {
        const event = EventSchema.parse({
            Topic: 'ClientEventLog',
            Message: message,
        });
        client.send(event);
    };
    return {orders, fetchOrders, SendClientEventLog};
}
