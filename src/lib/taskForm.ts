import type { TaskPriority, TaskStatus } from "@/types/task";

export type TaskFormInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  memo: string | null;
  isPublic: boolean;
};

export type TaskStatusInput = {
  status: TaskStatus;
  memo: string | null;
};

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "HOLD", "DONE"];
const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.includes(value as TaskStatus);
}

function isTaskPriority(value: string): value is TaskPriority {
  return taskPriorities.includes(value as TaskPriority);
}

export function parseTaskFormData(formData: FormData): TaskFormInput {
  const title = getStringValue(formData, "title");
  const description = getStringValue(formData, "description");
  const status = getStringValue(formData, "status");
  const priority = getStringValue(formData, "priority");
  const dueDate = getStringValue(formData, "dueDate");
  const tags = getStringValue(formData, "tags");
  const memo = getStringValue(formData, "memo");

  if (!title) {
    throw new Error("작업 제목을 입력해주세요.");
  }

  if (!description) {
    throw new Error("작업 설명을 입력해주세요.");
  }

  if (!isTaskStatus(status)) {
    throw new Error("올바르지 않은 작업 상태입니다.");
  }

  if (!isTaskPriority(priority)) {
    throw new Error("올바르지 않은 우선순위입니다.");
  }

  return {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    memo: memo || null,
    isPublic: formData.get("isPublic") === "on",
  };
}

export function parseTaskStatusFormData(formData: FormData): TaskStatusInput {
  const status = getStringValue(formData, "status");
  const memo = getStringValue(formData, "memo");

  if (!isTaskStatus(status)) {
    throw new Error("올바르지 않은 작업 상태입니다.");
  }

  return {
    status,
    memo: memo || null,
  };
}