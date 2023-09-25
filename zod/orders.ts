import { z } from 'zod';

import { OrderItemsSchema } from './order_items';

export const OrderStatusEnum = {
  NotYet: 0,
  Cooking: 1,
  Cooked: 2,
  Calling: 3,
  Provided: 4,
} as const;

export const OrderIdSchema = z.string();
export const OrderAtSchema = z.string();
export const OrderTypeSchema = z.number().min(0).max(1);
export const TicketAddrSchema = z.string();
export const OrderStatusSchema = z.nativeEnum(OrderStatusEnum);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export const SeatNameSchema = z.string().optional();

export const OrderSchema = z.object({
  OrderId: OrderIdSchema,
  OrderAt: OrderAtSchema,
  OrderType: OrderTypeSchema,
  TicketAddr: TicketAddrSchema,
  Status: OrderStatusSchema,
  SeatName: SeatNameSchema,
  OrderItems: OrderItemsSchema,
});
export type Order = z.infer<typeof OrderSchema>;

export const OrdersSchema = z.object({
  Orders: z.array(OrderSchema),
});
export type Orders = z.infer<typeof OrdersSchema>;
