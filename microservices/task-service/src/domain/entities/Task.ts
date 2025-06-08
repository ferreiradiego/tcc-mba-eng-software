export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
}
