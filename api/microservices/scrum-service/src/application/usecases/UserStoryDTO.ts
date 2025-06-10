import { z } from 'zod';

export const UserStorySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.string(),
  activationDate: z.coerce.date().optional(),
  sprintCode: z.string().optional(),
  blocked: z.boolean().optional(),
});

export type UserStoryDTO = z.infer<typeof UserStorySchema>;
