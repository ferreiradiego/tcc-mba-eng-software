import type { TaskStatus, TaskType } from "@prisma/client";
import type { UserStory } from "./UserStory";

export interface Task {
  id: string;
  userId: string;
  userStoryId?: string;
  userStory?: UserStory;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  dependencies?: string[];
  estimatedTime?: number;
  createdAt: Date;
  updatedAt: Date;
  type: TaskType;
  startedAt?: Date;
  finishedAt?: Date;
}
