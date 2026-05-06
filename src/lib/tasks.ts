import { taskHistories } from "@/data/taskHistories";
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

export const sortLabels = {
  updatedDesc: "최근 수정순",
  dueAsc: "마감일 빠른순",
  priorityDesc: "우선순위 높은순",
} as const;

export type TaskSortOption = keyof typeof sortLabels;

export type TaskQuery = {
  keyword?: string;
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  sort?: TaskSortOption;
};

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "HOLD", "DONE"];
const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const taskSortOptions: TaskSortOption[] = [
  "updatedDesc",
  "dueAsc",
  "priorityDesc",
];

const priorityScore: Record<TaskPriority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function getFirstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.includes(value as TaskStatus);
}

function isTaskPriority(value: string): value is TaskPriority {
  return taskPriorities.includes(value as TaskPriority);
}

function isTaskSortOption(value: string): value is TaskSortOption {
  return taskSortOptions.includes(value as TaskSortOption);
}

export function parseTaskQuery(
  params: Record<string, string | string[] | undefined>,
): TaskQuery {
  const keyword = getFirstParam(params.keyword)?.trim() ?? "";
  const status = getFirstParam(params.status);
  const priority = getFirstParam(params.priority);
  const sort = getFirstParam(params.sort);

  return {
    keyword,
    status: status && isTaskStatus(status) ? status : "ALL",
    priority: priority && isTaskPriority(priority) ? priority : "ALL",
    sort: sort && isTaskSortOption(sort) ? sort : "updatedDesc",
  };
}

export function getPublicTasks(query: TaskQuery = {}) {
  const keyword = query.keyword?.trim().toLowerCase() ?? "";

  const filteredTasks = tasks.filter((task) => {
    if (!task.isPublic) {
      return false;
    }

    if (query.status && query.status !== "ALL" && task.status !== query.status) {
      return false;
    }

    if (
      query.priority &&
      query.priority !== "ALL" &&
      task.priority !== query.priority
    ) {
      return false;
    }

    if (keyword) {
      const searchableText = [
        task.title,
        task.description,
        task.memo ?? "",
        ...task.tags,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(keyword)) {
        return false;
      }
    }

    return true;
  });

  return filteredTasks.sort((a, b) => {
    if (query.sort === "dueAsc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    }

    if (query.sort === "priorityDesc") {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id);
}

export function getTaskHistoriesByTaskId(taskId: string) {
  return taskHistories
    .filter((history) => history.taskId === taskId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}