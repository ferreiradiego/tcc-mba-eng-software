import { UserStoryStatus } from '@prisma/client';
import { z } from 'zod';

export const UserStorySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.nativeEnum(UserStoryStatus),
  activationDate: z.coerce.date().optional(),
  blocked: z.boolean().optional(),
  sprintId: z.string().uuid().optional(),
});

export type UserStoryDTO = z.infer<typeof UserStorySchema>;
