export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskVisibility = "PRIVATE" | "GROUP" | "PUBLIC";

export type TaskScope = "all" | "mine" | "private" | "group" | "public";

export type TaskQuery = {
  keyword?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  scope?: TaskScope;
};

export type TaskTodo = {
  id: string;
  taskId: string;
  content: string;
  isDone: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskSummary = {
  id: string;
  visibility: TaskVisibility;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  authorNickname: string;
  groupName: string | null;
};

export type Task = TaskSummary & {
  userId: string;
  groupId: string | null;
  description: string;
  completedAt: string | null;
  todos: TaskTodo[];
  createdAt: string;
  updatedAt: string;
};