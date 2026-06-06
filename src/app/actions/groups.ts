"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { requireAppUser, requireGroupOwner, requireUser } from "@/lib/auth";
import {
  parseGroupFormData,
  validateGroupFormInput,
} from "@/lib/groupForm";
import {
  createGroupInviteExpiresAt,
  createGroupInviteToken,
  isGroupInviteExpired,
} from "@/lib/groupInvite";
import { formatDate } from "@/lib/date";
import type {
  GroupActionState,
  GroupInviteActionState,
  GroupInviteDeleteActionState,
} from "@/types/groupAction";
import {
  GROUP_MEMBER_LIMIT,
  USER_GROUP_LIMIT,
} from "@/constants/group";

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

export async function createGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();

  try {
    const input = parseGroupFormData(formData);

    validateGroupFormInput(input);

    const userGroupCount = await prisma.groupMember.count({
      where: {
        userId: user.id,
      },
    });

    if (userGroupCount >= USER_GROUP_LIMIT) {
      throw new Error(`참여 가능한 그룹은 최대 ${USER_GROUP_LIMIT}개입니다.`);
    }

    await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: input.name,
          description: input.description,
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

export async function updateGroupInfo(
  groupId: string,
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await requireUser();

  try {
    const input = parseGroupFormData(formData);

    validateGroupFormInput(input);

    const result = await prisma.group.updateMany({
      where: {
        id: groupId,
        ownerId: user.id,
      },
      data: {
        name: input.name,
        description: input.description,
      },
    });

    if (result.count === 0) {
      throw new Error("그룹을 관리할 권한이 없습니다.");
    }

    revalidateGroupPaths(groupId);

    return {
      savedGroup: {
        name: input.name,
        description: input.description,
      },
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function deleteGroup(
  groupId: string,
  _prevState: GroupActionState,
  _formData: FormData,
): Promise<GroupActionState> {
  const user = await requireUser();

  try {
    await requireGroupOwner(groupId, user.id);

    await prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: {
          groupId,
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
  const user = await requireUser();

  try {
    await prisma.$transaction(async (tx) => {
      const membership = await tx.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId,
            userId: user.id,
          },
        },
        select: {
          group: {
            select: {
              ownerId: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("그룹을 찾을 수 없습니다.");
      }

      if (membership.group.ownerId === user.id) {
        throw new Error("리더는 그룹을 나갈 수 없습니다. 그룹 삭제를 이용해주세요.");
      }

      await tx.task.updateMany({
        where: {
          userId: user.id,
          groupId,
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
  _prevState: GroupInviteActionState,
  _formData: FormData,
): Promise<GroupInviteActionState> {
  const user = await requireUser();

  try {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        ownerId: user.id,
      },
      select: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!group) {
      throw new Error("그룹을 관리할 권한이 없습니다.");
    }

    if (group._count.members >= GROUP_MEMBER_LIMIT) {
      throw new Error(`그룹 멤버는 최대 ${GROUP_MEMBER_LIMIT}명까지 참여할 수 있습니다.`);
    }

    const token = createGroupInviteToken();
    const expiresAt = createGroupInviteExpiresAt();
    const createdAt = new Date();

    await prisma.groupInvite.upsert({
      where: {
        groupId,
      },
      update: {
        token,
        expiresAt,
        createdAt,
      },
      create: {
        groupId,
        token,
        expiresAt,
        createdAt,
      },
    });

    return {
      invite: {
        invitePath: routes.invite(token),
        expiresAt: formatDate(expiresAt),
      },
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function deleteGroupInvite(
  groupId: string,
  _prevState: GroupInviteDeleteActionState,
  _formData: FormData,
): Promise<GroupInviteDeleteActionState> {
  const user = await requireUser();

  try {
    const result = await prisma.groupInvite.deleteMany({
      where: {
        groupId,
        group: {
          is: {
            ownerId: user.id,
          },
        },
      },
    });

    if (result.count === 0) {
      throw new Error("초대 링크를 삭제할 수 없거나 권한이 없습니다.");
    }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    deleted: true,
  };
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

    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: invite.groupId,
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingMember) {
      const [userGroupCount, groupMemberCount] = await Promise.all([
        prisma.groupMember.count({
          where: {
            userId: user.id,
          },
        }),
        prisma.groupMember.count({
          where: {
            groupId: invite.groupId,
          },
        }),
      ]);

      if (userGroupCount >= USER_GROUP_LIMIT) {
        throw new Error(`참여 가능한 그룹은 최대 ${USER_GROUP_LIMIT}개입니다.`);
      }

      if (groupMemberCount >= GROUP_MEMBER_LIMIT) {
        throw new Error(`그룹 멤버는 최대 ${GROUP_MEMBER_LIMIT}명까지 참여할 수 있습니다.`);
      }
    }

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