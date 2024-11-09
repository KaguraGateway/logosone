import { z } from 'zod';

import { OrderItemStatusSchema } from './order_items';
import { OrderIdSchema, OrderStatusSchema } from './orders';

export const GetOrdersSchema = z.object({
  Status: z.number().min(0).max(4).optional(),
});
export type GetOrders = z.infer<typeof GetOrdersSchema>;

export const UpdateOrderStatusSchema = z.object({
  Id: OrderIdSchema,
  Status: OrderStatusSchema,
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

export const UpdateOrderItemStatusSchema = z.object({
  Id: OrderIdSchema,
  Status: OrderItemStatusSchema,
});
export type UpdateOrderItemStatus = z.infer<typeof UpdateOrderItemStatusSchema>;
