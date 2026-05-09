import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  Task,
  TaskPriority,
  TaskQuery,
  TaskSortOption,
  TaskStatus,
  TaskTodo,
} from "@/types/task";

const TASK_PAGE_SIZE = 3;

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const taskSortOptions: TaskSortOption[] = ["dueAsc", "priorityDesc"];

const taskListSelect = {
  id: true,
  userId: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  taskTags: {
    select: {
      tag: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.TaskSelect;

const taskDetailInclude = {
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

type TaskListRow = Prisma.TaskGetPayload<{
  select: typeof taskListSelect;
}>;

type TaskDetailRow = Prisma.TaskGetPayload<{
  include: typeof taskDetailInclude;
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

function toTaskTodo(row: TaskDetailRow["todos"][number]): TaskTodo {
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

function toTaskSummary(row: TaskListRow): Task {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? formatDate(row.dueDate) : null,
    tags: row.taskTags.map((taskTag) => taskTag.tag.name),
    todos: [],
    isPublic: row.isPublic,
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  };
}

function toTask(row: TaskDetailRow): Task {
  return {
    id: row.id,
    userId: row.userId,
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

function getPriorityOrderBy(): Prisma.TaskOrderByWithRelationInput {
  return {
    priority: "desc",
  };
}

function getTaskOrderBy(
  sort?: TaskSortOption,
): Prisma.TaskOrderByWithRelationInput[] {
  if (sort === "priorityDesc") {
    return [
      getPriorityOrderBy(),
      {
        dueDate: {
          sort: "asc",
          nulls: "last",
        },
      },
      {
        createdAt: "desc",
      },
      {
        id: "asc",
      },
    ];
  }

  return [
    {
      dueDate: {
        sort: "asc",
        nulls: "last",
      },
    },
    getPriorityOrderBy(),
    {
      createdAt: "desc",
    },
    {
      id: "asc",
    },
  ];
}

function buildTaskVisibilityWhere(viewerId?: string): Prisma.TaskWhereInput {
  if (!viewerId) {
    return {
      isPublic: true,
    };
  }

  return {
    OR: [
      {
        isPublic: true,
      },
      {
        userId: viewerId,
      },
    ],
  };
}

function buildTaskWhere(
  query: TaskQuery = {},
  viewerId?: string,
): Prisma.TaskWhereInput {
  const keyword = query.keyword?.trim() ?? "";
  const tag = query.tag?.trim() ?? "";

  const andConditions: Prisma.TaskWhereInput[] = [
    buildTaskVisibilityWhere(viewerId),
  ];

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  } else {
    andConditions.push({
      status: {
        not: "DONE",
      },
    });
  }

  if (query.priority) {
    andConditions.push({
      priority: query.priority,
    });
  }

  if (tag) {
    andConditions.push({
      taskTags: {
        some: {
          tag: {
            name: tag,
          },
        },
      },
    });
  }

  if (keyword) {
    andConditions.push({
      OR: [
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
      ],
    });
  }

  return {
    AND: andConditions,
  };
}

async function findTaskListRows({
  where,
  query,
  cursor,
  limit,
}: {
  where: Prisma.TaskWhereInput;
  query: TaskQuery;
  cursor?: string;
  limit: number;
}) {
  return prisma.task.findMany({
    where,
    select: taskListSelect,
    orderBy: getTaskOrderBy(query.sort),
    take: limit + 1,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    skip: cursor ? 1 : 0,
  });
}

function createTaskPageResult({
  rows,
  limit,
  totalCount,
}: {
  rows: TaskListRow[];
  limit: number;
  totalCount?: number;
}) {
  const hasNextPage = rows.length > limit;
  const pageRows = hasNextPage ? rows.slice(0, limit) : rows;

  return {
    tasks: pageRows.map(toTaskSummary),
    nextCursor: hasNextPage ? pageRows[pageRows.length - 1].id : null,
    totalCount,
  };
}

export function parseTaskQuery(
  params: Record<string, string | string[] | undefined>,
): TaskQuery {
  const keyword = getFirstParam(params.keyword)?.trim() ?? "";
  const status = getFirstParam(params.status);
  const priority = getFirstParam(params.priority);
  const sort = getFirstParam(params.sort);
  const tag = getFirstParam(params.tag)?.trim() ?? "";

  return {
    keyword: keyword || undefined,
    status: status && isTaskStatus(status) ? status : undefined,
    priority: priority && isTaskPriority(priority) ? priority : undefined,
    sort: sort && isTaskSortOption(sort) ? sort : undefined,
    tag: tag || undefined,
  };
}

export async function getTaskPage(
  query: TaskQuery = {},
  options: {
    cursor?: string;
    limit?: number;
    includeTotalCount?: boolean;
    viewerId?: string;
  } = {},
) {
  const limit = options.limit ?? TASK_PAGE_SIZE;
  const where = buildTaskWhere(query, options.viewerId);

  const rowsPromise = findTaskListRows({
    where,
    query,
    cursor: options.cursor,
    limit,
  });

  if (!options.includeTotalCount) {
    const rows = await rowsPromise;

    return createTaskPageResult({
      rows,
      limit,
    });
  }

  const [rows, totalCount] = await Promise.all([
    rowsPromise,
    prisma.task.count({
      where,
    }),
  ]);

  return createTaskPageResult({
    rows,
    limit,
    totalCount,
  });
}

export async function getTasks(query: TaskQuery = {}, viewerId?: string) {
  const result = await getTaskPage(query, {
    viewerId,
  });

  return result.tasks;
}

export async function getTaskById(id: string, viewerId?: string) {
  const row = await prisma.task.findFirst({
    where: {
      id,
      AND: [buildTaskVisibilityWhere(viewerId)],
    },
    include: taskDetailInclude,
  });

  if (!row) {
    return null;
  }

  return toTask(row);
}