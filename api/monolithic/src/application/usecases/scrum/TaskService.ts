import type { Task } from "@domain/entities/scrum/Task";
import { PrismaTaskRepository } from "@infrastructure/repositories/scrum/PrismaTaskRepository";

export class TaskService {
  private taskRepo: PrismaTaskRepository;
  constructor() {
    this.taskRepo = new PrismaTaskRepository();
  }

  async listTasks(
    userId: string,
    year?: number,
    number?: number
  ): Promise<Task[]> {
    return this.taskRepo.findAll(userId, year, number);
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
