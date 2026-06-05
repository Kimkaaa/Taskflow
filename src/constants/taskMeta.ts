import type { TaskPriority, TaskScope, TaskStatus } from "@/types/task";

export const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const priorityOptions: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

export const taskScopeOptions: TaskScope[] = [
  "all",
  "mine",
  "private",
  "group",
  "public",
];

export const taskScopeLabels: Record<TaskScope, string> = {
  all: "전체",
  mine: "내 작업",
  private: "개인",
  group: "그룹",
  public: "공개",
};

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "예정",
  IN_PROGRESS: "진행",
  DONE: "완료",
};

export const priorityLabels: Record<TaskPriority, string> = {
  HIGH: "상",
  MEDIUM: "중",
  LOW: "하",
};

export const statusBadgeStyles: Record<TaskStatus, string> = {
  TODO: "bg-blue-400/15 text-blue-300",
  IN_PROGRESS: "bg-emerald-400/15 text-emerald-300",
  DONE: "bg-zinc-700 text-zinc-300",
};

export const priorityBadgeStyles: Record<TaskPriority, string> = {
  HIGH: "bg-red-400/15 text-red-300",
  MEDIUM: "bg-amber-400/15 text-amber-300",
  LOW: "bg-zinc-700 text-zinc-300",
};