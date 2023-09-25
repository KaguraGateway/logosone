import { z } from 'zod';

export const EventSchema = z.object({
  Topic: z.string(),
  Message: z.any(),
});

export type Event = z.infer<typeof EventSchema>;
