import { z } from 'zod';

import { OrderItemIdSchema, OrderItemsSchema, OrderItemStatusSchema } from './order_items';
import {
  OrderAtSchema,
  OrderIdSchema,
  OrderStatusSchema,
  OrderTypeSchema,
  SeatNameSchema,
  TicketAddrSchema,
} from './orders';

export const NewOrderSchema = z.object({
  OrderId: OrderIdSchema,
  OrderAt: OrderAtSchema,
  OrderType: OrderTypeSchema,
  TicketAddr: TicketAddrSchema,
  SeatName: SeatNameSchema,
  OrderItems: OrderItemsSchema,
});
export type NewOrder = z.infer<typeof NewOrderSchema>;

export const UpdatedOrderSchema = z.object({
  Id: OrderIdSchema,
  Status: OrderStatusSchema,
});
export type UpdatedOrder = z.infer<typeof UpdatedOrderSchema>;

export const UpdatedOrderItemSchema = z.object({
  Id: OrderItemIdSchema,
  OrderId: OrderIdSchema,
  Status: OrderItemStatusSchema,
});
export type UpdatedOrderItem = z.infer<typeof UpdatedOrderItemSchema>;
