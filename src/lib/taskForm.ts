import { TASK_FORM_LIMITS } from "@/constants/taskFormLimits";
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

function validateDueDate(value: string) {
  if (!value) {
    return;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("마감일 형식이 올바르지 않습니다.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidDate) {
    throw new Error("마감일 형식이 올바르지 않습니다.");
  }
}

function validateTags(tags: string[]) {
  if (tags.length > TASK_FORM_LIMITS.TAG_MAX_COUNT) {
    throw new Error(
      `태그는 최대 ${TASK_FORM_LIMITS.TAG_MAX_COUNT}개까지 입력할 수 있습니다.`,
    );
  }

  const hasTooLongTag = tags.some(
    (tag) => tag.length > TASK_FORM_LIMITS.TAG_MAX_LENGTH,
  );

  if (hasTooLongTag) {
    throw new Error(
      `태그는 개별 ${TASK_FORM_LIMITS.TAG_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }
}

function validateTodos(todos: TaskFormTodoInput[]) {
  if (todos.length > TASK_FORM_LIMITS.TODO_MAX_COUNT) {
    throw new Error(
      `체크리스트는 최대 ${TASK_FORM_LIMITS.TODO_MAX_COUNT}개까지 입력할 수 있습니다.`,
    );
  }

  const hasTooLongTodo = todos.some(
    (todo) => todo.content.length > TASK_FORM_LIMITS.TODO_MAX_LENGTH,
  );

  if (hasTooLongTodo) {
    throw new Error(
      `체크리스트는 항목당 ${TASK_FORM_LIMITS.TODO_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }
}

export function parseTaskFormData(formData: FormData): TaskFormInput {
  const title = getStringValue(formData, "title");
  const description = getStringValue(formData, "description");
  const status = getStringValue(formData, "status");
  const priority = getStringValue(formData, "priority");
  const dueDate = getStringValue(formData, "dueDate");
  const tags = parseTags(getStringValue(formData, "tags"));
  const todos = parseTodos(formData);

  if (!title) {
    throw new Error("작업 제목을 입력해주세요.");
  }

  if (title.length > TASK_FORM_LIMITS.TITLE_MAX_LENGTH) {
    throw new Error(
      `작업 제목은 ${TASK_FORM_LIMITS.TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }

  if (description.length > TASK_FORM_LIMITS.DESCRIPTION_MAX_LENGTH) {
    throw new Error(
      `메모는 ${TASK_FORM_LIMITS.DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }

  if (!isTaskStatus(status)) {
    throw new Error("올바르지 않은 작업 상태입니다.");
  }

  if (!isTaskPriority(priority)) {
    throw new Error("올바르지 않은 중요도입니다.");
  }

  validateDueDate(dueDate);
  validateTags(tags);
  validateTodos(todos);

  return {
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    tags,
    todos,
    isPublic: formData.get("isPublic") === "on",
  };
}