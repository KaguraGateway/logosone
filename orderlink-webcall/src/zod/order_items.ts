import { z } from 'zod';

export const OrderItemStatusEnum = {
  NotYet: 0,
  Cooking: 1,
  Cooked: 2,
} as const;

export const OrderItemIdSchema = z.string();
export type OrderItemId = z.infer<typeof OrderItemIdSchema>;
export const ProductIdSchema = z.string();
export const OrderItemStatusSchema = z.nativeEnum(OrderItemStatusEnum);
export type OrderItemStatus = z.infer<typeof OrderItemStatusSchema>;
export const CoffeeBrewIdSchema = z.string().optional();

export const OrderItemsSchema = z.array(
  z.object({
    Id: OrderItemIdSchema,
    ProductId: ProductIdSchema,
    Status: OrderItemStatusSchema,
    CoffeeBrewId: CoffeeBrewIdSchema,
  })
);
export type OrderItems = z.infer<typeof OrderItemsSchema>;
