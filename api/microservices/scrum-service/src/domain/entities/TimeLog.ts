export interface TimeLog {
  id: string;
  userId: string;
  taskId: string;
  completedAt?: Date;
  duration?: number;
  status: 'running' | 'paused' | 'stopped' | 'finished';
  createdAt: Date;
  updatedAt: Date;
}
