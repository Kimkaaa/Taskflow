"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseTaskFormData, parseTaskStatusFormData } from "@/lib/taskForm";

export async function createTask(formData: FormData) {
  const input = parseTaskFormData(formData);

  console.log("createTask", input);

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTask(taskId: string, formData: FormData) {
  const input = parseTaskFormData(formData);

  console.log("updateTask", {
    taskId,
    ...input,
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  redirect(`/tasks/${taskId}`);
}

export async function updateTaskStatus(taskId: string, formData: FormData) {
  const input = parseTaskStatusFormData(formData);

  console.log("updateTaskStatus", {
    taskId,
    ...input,
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  redirect(`/tasks/${taskId}`);
}