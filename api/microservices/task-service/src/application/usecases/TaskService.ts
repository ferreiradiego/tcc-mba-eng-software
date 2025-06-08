import { PrismaTaskRepository } from "@infrastructure/repositories/PrismaTaskRepository";
import { Task } from "@domain/entities/Task";

export class TaskService {
  private taskRepo: PrismaTaskRepository;
  constructor() {
    this.taskRepo = new PrismaTaskRepository();
  }

  async listTasks(userId: string): Promise<Task[]> {
    return this.taskRepo.findAll(userId);
  }

  async getTask(id: string): Promise<Task | null> {
    return this.taskRepo.findById(id);
  }

  async createTask(
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    return this.taskRepo.create(data);
  }

  async updateTask(
    id: string,
    data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task | null> {
    return this.taskRepo.update(id, data);
  }

  async deleteTask(id: string): Promise<void> {
    return this.taskRepo.delete(id);
  }
}
