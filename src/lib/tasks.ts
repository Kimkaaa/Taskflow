import { tasks } from "@/data/tasks";
import type { TaskPriority, TaskStatus } from "@/types/task";

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "예정",
  IN_PROGRESS: "진행 중",
  HOLD: "보류",
  DONE: "완료",
};

export const priorityLabels: Record<TaskPriority, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
};

export function getPublicTasks() {
  return tasks.filter((task) => task.isPublic);
}

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id);
}