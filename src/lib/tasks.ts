import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  Task,
  TaskHistory,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

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

const taskInclude = {
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

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? formatDate(row.dueDate) : null,
    tags: row.taskTags.map((taskTag) => taskTag.tag.name),
    memo: row.memo,
    isPublic: row.isPublic,
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  };
}

function sortTasks(tasks: Task[], sort: TaskSortOption = "updatedDesc") {
  return [...tasks].sort((a, b) => {
    if (sort === "dueAsc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    }

    if (sort === "priorityDesc") {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }

    return b.updatedAt.localeCompare(a.updatedAt);
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
    status: status && isTaskStatus(status) ? status : "ALL",
    priority: priority && isTaskPriority(priority) ? priority : "ALL",
    sort: sort && isTaskSortOption(sort) ? sort : "updatedDesc",
  };
}

export async function getPublicTasks(query: TaskQuery = {}) {
  const keyword = query.keyword?.trim() ?? "";

  const where: Prisma.TaskWhereInput = {
    isPublic: true,
  };

  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }

  if (query.priority && query.priority !== "ALL") {
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
        memo: {
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
    ];
  }

  const rows = await prisma.task.findMany({
    where,
    include: taskInclude,
  });

  return sortTasks(rows.map(toTask), query.sort);
}

export async function getTaskById(id: string) {
  const row = await prisma.task.findUnique({
    where: {
      id,
    },
    include: taskInclude,
  });

  if (!row) {
    return null;
  }

  return toTask(row);
}

export async function getTaskHistoriesByTaskId(
  taskId: string,
): Promise<TaskHistory[]> {
  const rows = await prisma.taskHistory.findMany({
    where: {
      taskId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map((history) => ({
    id: history.id,
    taskId: history.taskId,
    fromStatus: history.fromStatus,
    toStatus: history.toStatus,
    memo: history.memo,
    createdAt: formatDate(history.createdAt),
  }));
}