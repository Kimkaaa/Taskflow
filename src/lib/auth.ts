import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(routes.login(nextPath));
  }

  return user;
}

function getNickname(user: Awaited<ReturnType<typeof requireUser>>) {
  const metadata = user.user_metadata;

  if (typeof metadata.user_name === "string" && metadata.user_name.trim()) {
    return metadata.user_name.trim();
  }

  if (typeof metadata.name === "string" && metadata.name.trim()) {
    return metadata.name.trim();
  }

  return user.email?.split("@")[0] ?? "사용자";
}

export async function requireAppUser(nextPath?: string) {
  const user = await requireUser(nextPath);

  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {},
    create: {
      id: user.id,
      nickname: getNickname(user),
    },
  });
}

export async function requireTaskOwner(taskId: string) {
  const user = await requireAppUser();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: user.id,
    },
    select: {
      id: true,
      status: true,
      completedAt: true,
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

export async function requireGroupOwner(groupId: string, userId: string) {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    throw new Error("그룹을 관리할 권한이 없습니다.");
  }

  return group;
}