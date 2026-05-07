"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseTaskFormData } from "@/lib/taskForm";
import { createClient } from "@/lib/supabase/server";

type TagWriteClient = Pick<typeof prisma, "tag">;

async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

async function requireTaskOwner(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    throw new Error("작업을 변경할 권한이 없습니다.");
  }

  return task;
}

function toDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function removeDuplicateTags(tags: string[]) {
  return Array.from(new Set(tags));
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

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const input = parseTaskFormData(formData);

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

export async function updateTask(taskId: string, formData: FormData) {
  const user = await requireUser();
  await requireTaskOwner(taskId, user.id);

  const input = parseTaskFormData(formData);

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

export async function deleteTask(taskId: string) {
  const user = await requireUser();
  await requireTaskOwner(taskId, user.id);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTaskTodoDone(
  taskId: string,
  todoId: string,
  isDone: boolean,
) {
  const user = await requireUser();
  await requireTaskOwner(taskId, user.id);

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