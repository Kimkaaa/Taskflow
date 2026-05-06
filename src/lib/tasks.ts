import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskTodo,
} from "@/types/task";

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
  TODO: "bg-emerald-400/15 text-emerald-300",
  IN_PROGRESS: "bg-blue-400/15 text-blue-300",
  DONE: "bg-zinc-700 text-zinc-300",
};

export const priorityBadgeStyles: Record<TaskPriority, string> = {
  HIGH: "bg-red-400/15 text-red-300",
  MEDIUM: "bg-amber-400/15 text-amber-300",
  LOW: "bg-zinc-700 text-zinc-300",
};

export const sortLabels = {
  dueAsc: "마감일",
  priorityDesc: "중요도",
} as const;

export type TaskSortOption = keyof typeof sortLabels;

export type TaskQuery = {
  keyword?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: TaskSortOption;
};

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const taskSortOptions: TaskSortOption[] = ["dueAsc", "priorityDesc"];

const priorityScore: Record<TaskPriority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const taskInclude = {
  todos: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  taskTags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.TaskInclude;

type TaskRow = Prisma.TaskGetPayload<{
  include: typeof taskInclude;
}>;

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

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toTaskTodo(row: TaskRow["todos"][number]): TaskTodo {
  return {
    id: row.id,
    taskId: row.taskId,
    content: row.content,
    isDone: row.isDone,
    sortOrder: row.sortOrder,
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  };
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? formatDate(row.dueDate) : null,
    tags: row.taskTags.map((taskTag) => taskTag.tag.name),
    todos: row.todos.map(toTaskTodo),
    isPublic: row.isPublic,
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  };
}

function sortTasks(tasks: Task[], sort: TaskSortOption = "dueAsc") {
  return [...tasks].sort((a, b) => {
    if (sort === "priorityDesc") {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return a.dueDate.localeCompare(b.dueDate);
  });
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
    status: status && isTaskStatus(status) ? status : undefined,
    priority: priority && isTaskPriority(priority) ? priority : undefined,
    sort: sort && isTaskSortOption(sort) ? sort : undefined,
  };
}

export async function getPublicTasks(query: TaskQuery = {}) {
  const keyword = query.keyword?.trim() ?? "";

  const where: Prisma.TaskWhereInput = {
    isPublic: true,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (keyword) {
    where.OR = [
      {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        taskTags: {
          some: {
            tag: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        },
      },
      {
        todos: {
          some: {
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  const rows = await prisma.task.findMany({
    where,
    include: taskInclude,
  });

  return sortTasks(rows.map(toTask), query.sort);
}

export async function getTaskById(id: string) {
  const row = await prisma.task.findFirst({
    where: {
      id,
      isPublic: true,
    },
    include: taskInclude,
  });

  if (!row) {
    return null;
  }

  return toTask(row);
}