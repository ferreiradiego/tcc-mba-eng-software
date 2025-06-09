import { Task } from "@domain/entities/Task";
import { TaskRepository } from "./TaskRepository";
import { prisma } from "@infrastructure/prisma/client";

export class PrismaTaskRepository implements TaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    return prisma.task.findMany({ where: { userId } }) as any;
  }

  async findById(id: string): Promise<Task | null> {
    return (await prisma.task.findUnique({ where: { id } })) as any;
  }

  async create(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    return (await prisma.task.create({ data: task })) as any;
  }

  async update(
    id: string,
    task: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task | null> {
    return (await prisma.task.update({ where: { id }, data: task })) as any;
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}
