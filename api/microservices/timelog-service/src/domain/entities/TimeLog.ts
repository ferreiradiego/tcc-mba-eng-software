export interface TimeLog {
  id: string;
  userId: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // em minutos
  status: 'running' | 'paused' | 'stopped';
  createdAt: Date;
  updatedAt: Date;
}
