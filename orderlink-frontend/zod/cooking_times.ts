import { z } from 'zod';

import { ProductIdSchema } from './order_items';

export const CookingTimeSchema = z.object({
  ProductId: ProductIdSchema,
  AverageCookingTime: z.number(), // 秒単位
});
export type CookingTime = z.infer<typeof CookingTimeSchema>;

export const CookingTimesSchema = z.array(CookingTimeSchema);
export type CookingTimes = z.infer<typeof CookingTimesSchema>;

export const CookingTimesResponseSchema = z.object({
  CookingTimes: CookingTimesSchema,
});
export type CookingTimesResponse = z.infer<typeof CookingTimesResponseSchema>;
