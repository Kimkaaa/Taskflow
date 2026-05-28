"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { requireAppUser, requireGroupOwner } from "@/lib/auth";
import { parseGroupName, validateGroupName } from "@/lib/groupForm";
import {
  createGroupInviteExpiresAt,
  createGroupInviteToken,
  isGroupInviteExpired,
} from "@/lib/groupInvite";
import type { GroupActionState } from "@/types/groupAction";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "그룹을 저장하지 못했습니다.";
}

function revalidateGroupsPath() {
  revalidatePath(routes.groups);
}

function revalidateGroupPaths(groupId: string) {
  revalidatePath(routes.groups);
  revalidatePath(routes.groupDetail(groupId));
  revalidatePath(routes.groupSettings(groupId));
}

function revalidateGroupSettingsPath(groupId: string) {
  revalidatePath(routes.groupSettings(groupId));
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

  revalidateGroupsPath();
  redirect(routes.groups, RedirectType.replace);
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

  revalidateGroupPaths(groupId);
  redirect(routes.groupSettings(groupId), RedirectType.replace);
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

  revalidateGroupPaths(groupId);
  redirect(routes.groups, RedirectType.replace);
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

  revalidateGroupPaths(groupId);
  redirect(routes.groups, RedirectType.replace);
}

export async function generateGroupInvite(
  groupId: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();

  try {
    await requireGroupOwner(groupId, user.id);

    const token = createGroupInviteToken();
    const expiresAt = createGroupInviteExpiresAt();

    await prisma.$transaction(async (tx) => {
      await tx.groupInvite.deleteMany({
        where: {
          groupId,
        },
      });

      await tx.groupInvite.create({
        data: {
          groupId,
          token,
          expiresAt,
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidateGroupSettingsPath(groupId);
  redirect(routes.groupSettings(groupId), RedirectType.replace);
}

export async function deleteGroupInvite(
  groupId: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();

  try {
    await requireGroupOwner(groupId, user.id);

    await prisma.groupInvite.deleteMany({
      where: {
        groupId,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidateGroupSettingsPath(groupId);
  redirect(routes.groupSettings(groupId), RedirectType.replace);
}

export async function acceptGroupInvite(
  token: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();
  let groupId: string | null = null;

  try {
    const invite = await prisma.groupInvite.findUnique({
      where: {
        token,
      },
      select: {
        groupId: true,
        expiresAt: true,
      },
    });

    if (!invite) {
      throw new Error("초대 링크를 찾을 수 없습니다.");
    }

    if (isGroupInviteExpired(invite.expiresAt)) {
      throw new Error("만료된 초대 링크입니다.");
    }

    groupId = invite.groupId;

    await prisma.groupMember.upsert({
      where: {
        groupId_userId: {
          groupId: invite.groupId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        groupId: invite.groupId,
        userId: user.id,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  if (!groupId) {
    return {
      error: "초대 링크를 처리하지 못했습니다.",
    };
  }

  revalidateGroupPaths(groupId);
  redirect(routes.groupDetail(groupId), RedirectType.replace);
}