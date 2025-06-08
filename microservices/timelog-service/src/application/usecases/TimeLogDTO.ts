import { z } from 'zod';

export const TimeLogSchema = z.object({
  userId: z.string().uuid(),
  taskId: z.string().uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  duration: z.number().int().positive().optional(),
  status: z.enum(['running', 'paused', 'stopped']),
});

export type TimeLogDTO = z.infer<typeof TimeLogSchema>;
