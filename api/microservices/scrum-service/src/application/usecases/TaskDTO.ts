import { TaskStatus, TaskType } from "@prisma/client";
import { z } from "zod";

export const TaskSchema = z.object({
  userId: z.string().uuid(),
  userStoryId: z.string().uuid().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.coerce.date().optional(),
  dependencies: z.array(z.string().uuid()).optional(),
  type: z.nativeEnum(TaskType),
  estimatedTime: z.number().int().positive().optional(),
});

export type TaskDTO = z.infer<typeof TaskSchema>;
