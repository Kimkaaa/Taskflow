import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireTaskOwner(taskId: string) {
  const user = await requireUser();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    throw new Error("작업을 변경할 권한이 없습니다.");
  }

  return {
    user,
    task,
  };
}