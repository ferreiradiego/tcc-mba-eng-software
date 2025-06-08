import { TimeLog } from '@domain/entities/TimeLog';

export interface TimeLogRepository {
  findAll(userId: string): Promise<TimeLog[]>;
  findById(id: string): Promise<TimeLog | null>;
  create(timelog: Omit<TimeLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeLog>;
  update(id: string, timelog: Partial<Omit<TimeLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<TimeLog | null>;
  delete(id: string): Promise<void>;
}
