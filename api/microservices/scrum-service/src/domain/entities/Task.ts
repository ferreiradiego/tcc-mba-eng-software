export interface Task {
  id: string;
  userId: string;
  userStoryId?: string;
  userStory?: {
    id: string;
    title: string;
    status: string;
    description?: string;
    activationDate?: Date;
    sprintCode?: string;
    blocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: Date;
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
  type: "bug" | "improvement" | "feature";
}
