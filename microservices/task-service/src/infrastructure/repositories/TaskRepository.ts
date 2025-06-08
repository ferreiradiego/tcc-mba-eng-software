import { Task } from "@domain/entities/Task";

export interface TaskRepository {
  findAll(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>;
  update(
    id: string,
    task: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task | null>;
  delete(id: string): Promise<void>;
}
