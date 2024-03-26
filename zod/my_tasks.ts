import { z } from 'zod';

import { OrderItemIdSchema } from './order_items';

export const MyTasksSchema = z.array(OrderItemIdSchema);
export type MyTasks = z.infer<typeof MyTasksSchema>;
