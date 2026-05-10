"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseTaskFormData } from "@/lib/taskForm";
import { requireTaskOwner, requireUser } from "@/lib/auth";
import type { TaskActionState } from "@/types/taskAction";

type TagWriteClient = Pick<typeof prisma, "tag">;

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

async function getOrCreateTags(tags: string[], tx: TagWriteClient) {
  const uniqueTags = removeDuplicateTags(tags);
  const result = [];

  for (const name of uniqueTags) {
    const existingTag = await tx.tag.findFirst({
      where: {
        userId: null,
        name,
      },
    });

    if (existingTag) {
      result.push(existingTag);
      continue;
    }

    const createdTag = await tx.tag.create({
      data: {
        userId: null,
        name,
      },
    });

    result.push(createdTag);
  }

  return result;
}

export async function createTask(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const user = await requireUser();

  let input;

  try {
    input = parseTaskFormData(formData);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  const task = await prisma.$transaction(async (tx) => {
    const tags = await getOrCreateTags(input.tags, tx);

    return tx.task.create({
      data: {
        userId: user.id,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: toDate(input.dueDate),
        isPublic: input.isPublic,
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
  redirect(`/tasks/${task.id}`);
}

export async function updateTask(
  taskId: string,
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  await requireTaskOwner(taskId);

  let input;

  try {
    input = parseTaskFormData(formData);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  await prisma.$transaction(async (tx) => {
    const tags = await getOrCreateTags(input.tags, tx);

    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: toDate(input.dueDate),
        isPublic: input.isPublic,
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
  redirect(`/tasks/${taskId}`);
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
  redirect("/tasks");
}

export async function completeTask(taskId: string) {
  await requireTaskOwner(taskId);

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: "DONE",
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
}

export async function updateTaskTodoDone(
  taskId: string,
  todoId: string,
  isDone: boolean,
) {
  await requireTaskOwner(taskId);

  const result = await prisma.taskTodo.updateMany({
    where: {
      id: todoId,
      taskId,
    },
    data: {
      isDone,
    },
  });

  if (result.count === 0) {
    throw new Error("체크리스트 항목을 찾을 수 없습니다.");
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
}