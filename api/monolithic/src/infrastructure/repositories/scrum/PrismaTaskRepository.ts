import { prisma } from "@infrastructure/prisma/client";
import type { TaskStatus, TaskType } from "@prisma/client";
import { TaskRepository } from "./TaskRepository";
import type { Task } from "@domain/entities/scrum/Task";

export class PrismaTaskRepository implements TaskRepository {
  async findAll(
    userId: string,
    year?: number,
    number?: number
  ): Promise<Task[]> {
    let where: any = { userId };
    if (year && number) {
      const sprints = await prisma.sprint.findMany({
        where: {
          trimester: { year, number },
        },
        select: { id: true },
      });
      const sprintIds = sprints.map((s) => s.id);

      const userStories = await prisma.userStory.findMany({
        where: { sprintId: { in: sprintIds } },
        select: { id: true },
      });
      const userStoryIds = userStories.map((us) => us.id);
      where.userStoryId = { in: userStoryIds };
    }
    const tasks = await prisma.task.findMany({
      where,
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
      startedAt: data.startedAt,
      finishedAt: data.finishedAt,
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
    };
    if (typeof userStoryId === "string") prismaData.userStoryId = userStoryId;

    const currentTask = await prisma.task.findUnique({ where: { id } });
    if (data.status === "IN_PROGRESS" && !currentTask?.startedAt) {
      prismaData.startedAt = new Date();
    }
    if (data.status === "DONE" && !currentTask?.finishedAt) {
      prismaData.finishedAt = new Date();
    }

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
    estimatedTime: prismaTask.estimatedTime ?? undefined,
    startedAt: prismaTask.startedAt ?? undefined,
    finishedAt: prismaTask.finishedAt ?? undefined,
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
    type: prismaTask.type as TaskType,
  };
}
