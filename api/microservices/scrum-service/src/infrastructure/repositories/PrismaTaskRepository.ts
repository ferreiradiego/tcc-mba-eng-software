import { Task } from "@domain/entities/Task";
import { TaskRepository } from "./TaskRepository";
import { prisma } from "@infrastructure/prisma/client";

export class PrismaTaskRepository implements TaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({ where: { userId } });
    return tasks.map(mapPrismaTaskToDomain);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({ where: { id } });
    return task ? mapPrismaTaskToDomain(task) : null;
  }

  async create(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const created = await prisma.task.create({ data: task });
    return mapPrismaTaskToDomain(created);
  }

  async update(
    id: string,
    task: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task | null> {
    const updated = await prisma.task.update({ where: { id }, data: task });
    return mapPrismaTaskToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}

function mapPrismaTaskToDomain(prismaTask: any): Task {
  return {
    id: prismaTask.id,
    userId: prismaTask.userId,
    title: prismaTask.title,
    description: prismaTask.description ?? undefined,
    status: prismaTask.status as Task["status"],
    priority: prismaTask.priority as Task["priority"],
    category: prismaTask.category ?? undefined,
    dueDate: prismaTask.dueDate ?? undefined,
    dependencies: prismaTask.dependencies ?? [],
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
    type: prismaTask.type as Task["type"],
  };
}
