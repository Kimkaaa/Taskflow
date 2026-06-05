"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { parseTaskFormData } from "@/lib/taskForm";
import { requireAppUser, requireTaskOwner, requireUser } from "@/lib/auth";
import type { TaskActionState } from "@/types/taskAction";

type ActionTransaction = Prisma.TransactionClient;

function toDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function removeDuplicateTags(tags: string[]) {
  return Array.from(new Set(tags));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "작업을 저장하지 못했습니다.";
}

async function getOrCreateTags(tags: string[], tx: ActionTransaction) {
  const uniqueTags = removeDuplicateTags(tags);

  return Promise.all(
    uniqueTags.map((name) =>
      tx.tag.upsert({
        where: {
          name,
        },
        update: {},
        create: {
          name,
        },
      }),
    ),
  );
}

async function validateGroupVisibility(
  visibility: "PRIVATE" | "GROUP" | "PUBLIC",
  groupId: string | null,
  userId: string,
  tx: ActionTransaction,
) {
  if (visibility === "GROUP") {
    if (!groupId) {
      throw new Error("그룹에 공유하려면 그룹을 선택해주세요.");
    }

    const member = await tx.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      throw new Error("선택한 그룹에 접근할 권한이 없습니다.");
    }

    return;
  }

  if (groupId) {
    throw new Error("그룹 작업이 아닌 경우 그룹을 선택할 수 없습니다.");
  }
}

function getCompletedAt(
  nextStatus: "TODO" | "IN_PROGRESS" | "DONE",
  current?: {
    status: "TODO" | "IN_PROGRESS" | "DONE";
    completedAt: Date | null;
  },
) {
  if (nextStatus !== "DONE") {
    return null;
  }

  if (current?.status === "DONE") {
    return current.completedAt ?? new Date();
  }

  return new Date();
}

export async function createTask(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireAppUser();

  let input;

  try {
    input = parseTaskFormData(formData);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  const task = await prisma.$transaction(async (tx) => {
    await validateGroupVisibility(
      input.visibility,
      input.groupId,
      user.id,
      tx,
    );

    const tags = await getOrCreateTags(input.tags, tx);

    return tx.task.create({
      data: {
        userId: user.id,
        groupId: input.groupId,
        visibility: input.visibility,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: toDate(input.dueDate),
        completedAt: getCompletedAt(input.status),
        todos: {
          create: input.todos.map((todo, index) => ({
            content: todo.content,
            isDone: todo.isDone,
            sortOrder: index,
          })),
        },
        taskTags: {
          create: tags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
    });
  });

  revalidatePath("/tasks");
  redirect(`/tasks/${task.id}`, RedirectType.replace);
}

export async function updateTask(
  taskId: string,
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const { user, task: currentTask } = await requireTaskOwner(taskId);

  let input;

  try {
    input = parseTaskFormData(formData);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  await prisma.$transaction(async (tx) => {
    await validateGroupVisibility(
      input.visibility,
      input.groupId,
      user.id,
      tx,
    );

    const tags = await getOrCreateTags(input.tags, tx);

    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        groupId: input.groupId,
        visibility: input.visibility,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: toDate(input.dueDate),
        completedAt: getCompletedAt(input.status, currentTask),
        todos: {
          deleteMany: {},
          create: input.todos.map((todo, index) => ({
            content: todo.content,
            isDone: todo.isDone,
            sortOrder: index,
          })),
        },
        taskTags: {
          deleteMany: {},
          create: tags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
    });
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  redirect(`/tasks/${taskId}`, RedirectType.replace);
}

export async function deleteTask(
  taskId: string,
  _prevState: TaskActionState,
  _formData: FormData,
): Promise<TaskActionState> {
  const user = await requireUser();

  const result = await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    return {
      error: "이미 삭제되었거나 삭제 권한이 없습니다.",
    };
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  redirect("/tasks", RedirectType.replace);
}

export async function completeTask(taskId: string) {
  const user = await requireUser();

  const result = await prisma.task.updateMany({
    where: {
      id: taskId,
      userId: user.id,
    },
    data: {
      status: "DONE",
      completedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error("작업을 찾을 수 없거나 권한이 없습니다.");
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
}

export async function updateTaskTodoDone(
  taskId: string,
  todoId: string,
  isDone: boolean,
) {
  const user = await requireUser();

  const result = await prisma.taskTodo.updateMany({
    where: {
      id: todoId,
      taskId,
      task: {
        userId: user.id,
      },
    },
    data: {
      isDone,
    },
  });

  if (result.count === 0) {
    throw new Error("체크리스트 항목을 찾을 수 없거나 수정 권한이 없습니다.");
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
}