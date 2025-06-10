import { TimeLog } from "@domain/entities/TimeLog";
import { TimeLogRepository } from "./TimeLogRepository";
import { prisma } from "@infrastructure/prisma/client";

export class PrismaTimeLogRepository implements TimeLogRepository {
  async findAll(userId: string): Promise<TimeLog[]> {
    const timelogs = await prisma.timeLog.findMany({ where: { userId } });
    return timelogs.map(mapPrismaTimeLogToDomain);
  }

  async findById(id: string): Promise<TimeLog | null> {
    const timelog = await prisma.timeLog.findUnique({ where: { id } });
    return timelog ? mapPrismaTimeLogToDomain(timelog) : null;
  }

  async create(
    timelog: Omit<TimeLog, "id" | "createdAt" | "updatedAt">
  ): Promise<TimeLog> {
    const created = await prisma.timeLog.create({ data: timelog });
    return mapPrismaTimeLogToDomain(created);
  }

  async update(
    id: string,
    timelog: Partial<Omit<TimeLog, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<TimeLog | null> {
    const updated = await prisma.timeLog.update({ where: { id }, data: timelog });
    return mapPrismaTimeLogToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.timeLog.delete({ where: { id } });
  }
}

function mapPrismaTimeLogToDomain(prismaTimeLog: any): TimeLog {
  return {
    id: prismaTimeLog.id,
    userId: prismaTimeLog.userId,
    taskId: prismaTimeLog.taskId,
    startTime: prismaTimeLog.startTime,
    endTime: prismaTimeLog.endTime ?? undefined,
    duration: prismaTimeLog.duration ?? undefined,
    status: prismaTimeLog.status,
    createdAt: prismaTimeLog.createdAt,
    updatedAt: prismaTimeLog.updatedAt,
  };
}
