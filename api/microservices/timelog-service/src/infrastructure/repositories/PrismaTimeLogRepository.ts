import { TimeLog } from '@domain/entities/TimeLog';
import { TimeLogRepository } from './TimeLogRepository';
import { prisma } from '@infrastructure/prisma/client';

export class PrismaTimeLogRepository implements TimeLogRepository {
  async findAll(userId: string): Promise<TimeLog[]> {
    return prisma.timeLog.findMany({ where: { userId } }) as any;
  }
  async findById(id: string): Promise<TimeLog | null> {
    return (await prisma.timeLog.findUnique({ where: { id } })) as any;
  }
  async create(timelog: Omit<TimeLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeLog> {
    return (await prisma.timeLog.create({ data: timelog })) as any;
  }
  async update(id: string, timelog: Partial<Omit<TimeLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<TimeLog | null> {
    return (await prisma.timeLog.update({ where: { id }, data: timelog })) as any;
  }
  async delete(id: string): Promise<void> {
    await prisma.timeLog.delete({ where: { id } });
  }
}
