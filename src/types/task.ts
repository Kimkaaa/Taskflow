export type TaskStatus = "TODO" | "IN_PROGRESS" | "HOLD" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  memo: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};