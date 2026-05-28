export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskVisibility = "PRIVATE" | "GROUP" | "PUBLIC";

export type TaskSortOption =
  | "dueAsc"
  | "dueDesc"
  | "priorityDesc"
  | "priorityAsc";

export type TaskQuery = {
  keyword?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: TaskSortOption;
  tag?: string;
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

export type Task = {
  id: string;
  userId: string;
  groupId: string | null;
  visibility: TaskVisibility;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  tags: string[];
  todos: TaskTodo[];
  createdAt: string;
  updatedAt: string;
};