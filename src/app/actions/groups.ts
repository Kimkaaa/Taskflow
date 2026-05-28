"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import type { GroupActionState } from "@/types/groupAction";

const GROUP_NAME_MAX_LENGTH = 30;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "그룹을 저장하지 못했습니다.";
}

function parseGroupName(formData: FormData) {
  const value = formData.get("name");

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function validateGroupName(name: string) {
  if (!name) {
    throw new Error("그룹명을 입력해주세요.");
  }

  if (name.length > GROUP_NAME_MAX_LENGTH) {
    throw new Error(`그룹명은 ${GROUP_NAME_MAX_LENGTH}자 이하로 입력해주세요.`);
  }
}

async function requireGroupOwner(groupId: string, userId: string) {
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

export async function createGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();
  const name = parseGroupName(formData);

  try {
    validateGroupName(name);

    await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name,
          ownerId: user.id,
        },
      });

      await tx.groupMember.create({
        data: {
          groupId: group.id,
          userId: user.id,
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/groups");
  redirect("/groups", RedirectType.replace);
}

export async function updateGroupName(
  groupId: string,
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();
  const name = parseGroupName(formData);

  try {
    validateGroupName(name);
    await requireGroupOwner(groupId, user.id);

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  revalidatePath(`/groups/${groupId}/settings`);
  redirect(`/groups/${groupId}/settings`, RedirectType.replace);
}

export async function deleteGroup(
  groupId: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();

  try {
    await requireGroupOwner(groupId, user.id);

    await prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: {
          groupId,
          visibility: "GROUP",
        },
        data: {
          visibility: "PRIVATE",
          groupId: null,
        },
      });

      await tx.group.delete({
        where: {
          id: groupId,
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  redirect("/groups", RedirectType.replace);
}

export async function leaveGroup(
  groupId: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();

  try {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!group) {
      throw new Error("그룹을 찾을 수 없습니다.");
    }

    if (group.ownerId === user.id) {
      throw new Error("리더는 그룹을 나갈 수 없습니다. 그룹 삭제를 이용해주세요.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: {
          userId: user.id,
          groupId,
          visibility: "GROUP",
        },
        data: {
          visibility: "PRIVATE",
          groupId: null,
        },
      });

      await tx.groupMember.delete({
        where: {
          groupId_userId: {
            groupId,
            userId: user.id,
          },
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  redirect("/groups", RedirectType.replace);
}