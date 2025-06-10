import { z } from 'zod';

export const TaskSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  dependencies: z.array(z.string().uuid()).optional(),
  type: z.enum(['bug', 'improvement', 'feature']),
});

export type TaskDTO = z.infer<typeof TaskSchema>;
