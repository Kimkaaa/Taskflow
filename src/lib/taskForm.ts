import type { TaskPriority, TaskStatus } from "@/types/task";

export type TaskFormTodoInput = {
  id: string | null;
  content: string;
  isDone: boolean;
};

export type TaskFormInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  todos: TaskFormTodoInput[];
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

function getStringValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());
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

function parseTodos(formData: FormData): TaskFormTodoInput[] {
  const ids = getStringValues(formData, "todoId");
  const contents = getStringValues(formData, "todoContent");
  const isDoneValues = getStringValues(formData, "todoIsDone");

  return contents
    .map((content, index) => ({
      id: ids[index] || null,
      content,
      isDone: isDoneValues[index] === "true",
    }))
    .filter((todo) => todo.content);
}

export function parseTaskFormData(formData: FormData): TaskFormInput {
  const title = getStringValue(formData, "title");
  const description = getStringValue(formData, "description");
  const status = getStringValue(formData, "status");
  const priority = getStringValue(formData, "priority");
  const dueDate = getStringValue(formData, "dueDate");
  const tags = getStringValue(formData, "tags");

  if (!title) {
    throw new Error("작업 제목을 입력해주세요.");
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
    todos: parseTodos(formData),
    isPublic: formData.get("isPublic") === "on",
  };
}