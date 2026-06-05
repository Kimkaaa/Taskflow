import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  Task,
  TaskQuery,
  TaskScope,
  TaskSortOption,
  TaskSummary,
  TaskTodo,
  TaskVisibility,
} from "@/types/task";
import { formatDate } from "@/lib/date";

const TASK_PAGE_SIZE = 3;

export const visibilityLabels: Record<TaskVisibility, string> = {
  PRIVATE: "나만 보기",
  GROUP: "그룹에 공유",
  PUBLIC: "전체 공개",
};

const taskListSelect = {
  id: true,
  visibility: true,
  title: true,
  status: true,
  priority: true,
  dueDate: true,
  user: {
    select: {
      nickname: true,
    },
  },
  group: {
    select: {
      name: true,
    },
  },
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
  user: {
    select: {
      nickname: true,
    },
  },
  group: {
    select: {
      name: true,
    },
  },
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

type TaskAccessContext = {
  viewerId?: string;
  groupIds: string[];
};

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

function toTaskSummary(row: TaskListRow): TaskSummary {
  return {
    id: row.id,
    visibility: row.visibility,
    title: row.title,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? formatDate(row.dueDate) : null,
    tags: row.taskTags.map((taskTag) => taskTag.tag.name),
    authorNickname: row.user.nickname,
    groupName: row.group?.name ?? null,
  };
}

function toTask(row: TaskDetailRow): Task {
  return {
    id: row.id,
    userId: row.userId,
    groupId: row.groupId,
    visibility: row.visibility,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? formatDate(row.dueDate) : null,
    completedAt: row.completedAt ? formatDate(row.completedAt) : null,
    tags: row.taskTags.map((taskTag) => taskTag.tag.name),
    todos: row.todos.map(toTaskTodo),
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
    authorNickname: row.user.nickname,
    groupName: row.group?.name ?? null,
  };
}

function getPriorityOrderBy(
  sort: Prisma.SortOrder,
): Prisma.TaskOrderByWithRelationInput {
  return {
    priority: sort,
  };
}

function getTaskOrderBy(
  sort?: TaskSortOption,
): Prisma.TaskOrderByWithRelationInput[] {
  if (sort === "dueDesc") {
    return [
      {
        dueDate: {
          sort: "desc",
          nulls: "last",
        },
      },
      getPriorityOrderBy("desc"),
      {
        createdAt: "desc",
      },
      {
        id: "asc",
      },
    ];
  }

  if (sort === "priorityDesc") {
    return [
      getPriorityOrderBy("desc"),
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

  if (sort === "priorityAsc") {
    return [
      getPriorityOrderBy("asc"),
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
    getPriorityOrderBy("desc"),
    {
      createdAt: "desc",
    },
    {
      id: "asc",
    },
  ];
}

function requiresViewer(scope?: TaskScope) {
  return scope === "mine" || scope === "private" || scope === "group";
}

function needsViewerGroupIds(scope?: TaskScope) {
  return !scope || scope === "all" || scope === "group";
}

async function getViewerGroupIds(viewerId: string | undefined, scope?: TaskScope) {
  if (!viewerId || !needsViewerGroupIds(scope)) {
    return [];
  }

  const memberships = await prisma.groupMember.findMany({
    where: {
      userId: viewerId,
    },
    select: {
      groupId: true,
    },
  });

  return memberships.map((membership) => membership.groupId);
}

function createEmptyTaskPageResult(includeTotalCount?: boolean) {
  return {
    tasks: [],
    nextCursor: null,
    totalCount: includeTotalCount ? 0 : undefined,
  };
}

function buildTaskAccessWhere(
  scope: TaskScope | undefined,
  { viewerId, groupIds }: TaskAccessContext,
): Prisma.TaskWhereInput {
  const currentScope = scope ?? "all";

  if (!viewerId) {
    return {
      visibility: "PUBLIC",
    };
  }

  if (currentScope === "mine") {
    return {
      userId: viewerId,
    };
  }

  if (currentScope === "private") {
    return {
      userId: viewerId,
      visibility: "PRIVATE",
    };
  }

  if (currentScope === "group") {
    return {
      visibility: "GROUP",
      groupId: {
        in: groupIds,
      },
    };
  }

  if (currentScope === "public") {
    return {
      visibility: "PUBLIC",
    };
  }

  const accessConditions: Prisma.TaskWhereInput[] = [
    {
      visibility: "PUBLIC",
    },
    {
      userId: viewerId,
    },
  ];

  if (groupIds.length > 0) {
    accessConditions.push({
      visibility: "GROUP",
      groupId: {
        in: groupIds,
      },
    });
  }

  return {
    OR: accessConditions,
  };
}

function buildTaskDetailAccessWhere(viewerId?: string): Prisma.TaskWhereInput {
  if (!viewerId) {
    return {
      visibility: "PUBLIC",
    };
  }

  return {
    OR: [
      {
        visibility: "PUBLIC",
      },
      {
        userId: viewerId,
      },
      {
        visibility: "GROUP",
        group: {
          members: {
            some: {
              userId: viewerId,
            },
          },
        },
      },
    ],
  };
}

async function findTaskDetail(where: Prisma.TaskWhereInput) {
  const row = await prisma.task.findFirst({
    where,
    include: taskDetailInclude,
  });

  if (!row) {
    return null;
  }

  return toTask(row);
}

function buildTaskWhere(
  query: TaskQuery = {},
  accessContext: TaskAccessContext,
): Prisma.TaskWhereInput {
  const keyword = query.keyword?.trim() ?? "";
  const tag = query.tag?.trim() ?? "";

  const andConditions: Prisma.TaskWhereInput[] = [
    buildTaskAccessWhere(query.scope, accessContext),
  ];

  const hasSearchCondition = Boolean(keyword || tag);

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  } else if (!hasSearchCondition) {
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
            name: {
              equals: tag,
              mode: "insensitive",
            },
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

  if (requiresViewer(query.scope) && !options.viewerId) {
    return createEmptyTaskPageResult(options.includeTotalCount);
  }

  const groupIds = await getViewerGroupIds(options.viewerId, query.scope);

  if (query.scope === "group" && groupIds.length === 0) {
    return createEmptyTaskPageResult(options.includeTotalCount);
  }

  const where = buildTaskWhere(query, {
    viewerId: options.viewerId,
    groupIds,
  });

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
  return findTaskDetail({
    id,
    ...buildTaskDetailAccessWhere(viewerId),
  });
}

export async function getOwnedTaskById(id: string, userId: string) {
  return findTaskDetail({
    id,
    userId,
  });
}