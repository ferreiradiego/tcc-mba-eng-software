import { TimeLog } from "@domain/entities/TimeLog";
import { PrismaTimeLogRepository } from "@infrastructure/repositories/PrismaTimeLogRepository";

export class TimeLogService {
  private timelogRepo: PrismaTimeLogRepository;
  constructor() {
    this.timelogRepo = new PrismaTimeLogRepository();
  }

  async listTimeLogs(userId: string): Promise<TimeLog[]> {
    return this.timelogRepo.findAll(userId);
  }

  async getTimeLog(id: string): Promise<TimeLog | null> {
    return this.timelogRepo.findById(id);
  }

  async createTimeLog(
    data: Omit<TimeLog, "id" | "createdAt" | "updatedAt">
  ): Promise<TimeLog> {
    return this.timelogRepo.create(data);
  }

  async updateTimeLog(
    id: string,
    data: Partial<Omit<TimeLog, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<TimeLog | null> {
    return this.timelogRepo.update(id, data);
  }

  async deleteTimeLog(id: string): Promise<void> {
    return this.timelogRepo.delete(id);
  }
}
