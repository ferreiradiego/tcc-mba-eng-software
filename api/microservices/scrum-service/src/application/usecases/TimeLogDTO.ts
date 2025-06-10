import { z } from 'zod';

export const TimeLogSchema = z.object({
  userId: z.string().uuid(),
  taskId: z.string().uuid(),
  duration: z.number().int().positive().optional(),
  status: z.enum(['running', 'paused', 'stopped', 'finished']),
});

export type TimeLogDTO = z.infer<typeof TimeLogSchema>;
