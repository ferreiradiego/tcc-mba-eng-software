import type { Task } from "@domain/entities/Task";
import { prisma } from "@infrastructure/prisma/client";
import type { TaskStatus, TaskType } from "@prisma/client";
import { TaskRepository } from "./TaskRepository";

export class PrismaTaskRepository implements TaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { userStory: true },
    });
    return tasks.map(mapPrismaTaskToDomain);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { userStory: true },
    });
    return task ? mapPrismaTaskToDomain(task) : null;
  }

  async create(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const { userStory, userStoryId, ...data } = task;
    const prismaData: any = {
      ...data,
      status: data.status,
      type: data.type,
      estimatedTime: data.estimatedTime,
      dependencies: data.dependencies,
    };
    if (typeof userStoryId === "string") prismaData.userStoryId = userStoryId;
    const created = await prisma.task.create({
      data: prismaData,
      include: { userStory: true },
    });
    return mapPrismaTaskToDomain(created);
  }

  async update(
    id: string,
    task: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task | null> {
    const { userStory, userStoryId, ...data } = task;
    const prismaData: any = {
      ...data,
      status: data.status,
      type: data.type,
      estimatedTime: data.estimatedTime,
      dependencies: data.dependencies,
    };
    if (typeof userStoryId === "string") prismaData.userStoryId = userStoryId;
    const updated = await prisma.task.update({
      where: { id },
      data: prismaData,
      include: { userStory: true },
    });
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
    userStoryId: prismaTask.userStoryId ?? undefined,
    userStory: prismaTask.userStory ? { ...prismaTask.userStory } : undefined,
    title: prismaTask.title,
    description: prismaTask.description ?? undefined,
    status: prismaTask.status as TaskStatus,
    dueDate: prismaTask.dueDate ?? undefined,
    dependencies: prismaTask.dependencies ?? [],
    estimatedTime: prismaTask.estimatedTime ?? undefined,
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
    type: prismaTask.type as TaskType,
  };
}
