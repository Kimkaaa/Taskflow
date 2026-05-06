import type { TaskPriority, TaskStatus } from "@/types/task";

export type TaskFormInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  todos: string[];
  isPublic: boolean;
};

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
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

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseTodos(value: string) {
  return value
    .split(/\r?\n/)
    .map((todo) => todo.trim())
    .filter(Boolean);
}

export function parseTaskFormData(formData: FormData): TaskFormInput {
  const title = getStringValue(formData, "title");
  const description = getStringValue(formData, "description");
  const status = getStringValue(formData, "status");
  const priority = getStringValue(formData, "priority");
  const dueDate = getStringValue(formData, "dueDate");
  const tags = getStringValue(formData, "tags");
  const todos = getStringValue(formData, "todos");

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
    throw new Error("올바르지 않은 중요도입니다.");
  }

  return {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    tags: parseTags(tags),
    todos: parseTodos(todos),
    isPublic: formData.get("isPublic") === "on",
  };
}