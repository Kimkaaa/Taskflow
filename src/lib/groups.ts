import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { isGroupInviteExpired } from "@/lib/groupInvite";
import type { TaskPriority, TaskStatus } from "@/types/task";

export type GroupSummary = {
  id: string;
  name: string;
  isOwner: boolean;
  memberCount: number;
  taskCount: number;
  joinedAt: string;
  createdAt: string;
};

export type GroupMemberSummary = {
  id: string;
  userId: string;
  nickname: string;
  isOwner: boolean;
  joinedAt: string;
};

export type GroupTaskSummary = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
};

export type GroupDetail = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  isOwner: boolean;
  createdAt: string;
  members: GroupMemberSummary[];
  tasks: GroupTaskSummary[];
};

export type GroupOption = {
  id: string;
  name: string;
};

export type ActiveGroupInvite = {
  token: string;
  invitePath: string;
  expiresAt: string;
  createdAt: string;
};

export type GroupSettingsDetail = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  isOwner: boolean;
  createdAt: string;
  members: GroupMemberSummary[];
  activeInvite: ActiveGroupInvite | null;
};

export type GroupInviteDetail = {
  token: string;
  group: {
    id: string;
    name: string;
    memberCount: number;
  };
  expiresAt: string;
  isAvailable: boolean;
  isAlreadyMember: boolean;
};

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function getMyGroups(userId: string): Promise<GroupSummary[]> {
  const memberships = await prisma.groupMember.findMany({
    where: {
      userId,
    },
    orderBy: {
      joinedAt: "desc",
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          ownerId: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      },
    },
  });

  return memberships.map((membership) => ({
    id: membership.group.id,
    name: membership.group.name,
    isOwner: membership.group.ownerId === userId,
    memberCount: membership.group._count.members,
    taskCount: membership.group._count.tasks,
    joinedAt: formatDate(membership.joinedAt),
    createdAt: formatDate(membership.group.createdAt),
  }));
}

export async function getGroupDetail(
  groupId: string,
  userId: string,
): Promise<GroupDetail | null> {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      createdAt: true,
      members: {
        orderBy: {
          joinedAt: "asc",
        },
        select: {
          id: true,
          userId: true,
          joinedAt: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
      },
      tasks: {
        where: {
          visibility: "GROUP",
        },
        orderBy: [
          {
            dueDate: {
              sort: "asc",
              nulls: "last",
            },
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
        },
      },
    },
  });

  if (!group) {
    return null;
  }

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    ownerId: group.ownerId,
    isOwner: group.ownerId === userId,
    createdAt: formatDate(group.createdAt),
    members: group.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      nickname: member.user.nickname,
      isOwner: member.userId === group.ownerId,
      joinedAt: formatDate(member.joinedAt),
    })),
    tasks: group.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? formatDate(task.dueDate) : null,
      createdAt: formatDate(task.createdAt),
    })),
  };
}

export async function getMyGroupOptions(
  userId: string,
): Promise<GroupOption[]> {
  const memberships = await prisma.groupMember.findMany({
    where: {
      userId,
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return memberships.map((membership) => ({
    id: membership.group.id,
    name: membership.group.name,
  }));
}

export async function getGroupSettingsDetail(
  groupId: string,
  userId: string,
): Promise<GroupSettingsDetail | null> {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      createdAt: true,
      invite: {
        select: {
          token: true,
          expiresAt: true,
          createdAt: true,
        },
      },
      members: {
        orderBy: {
          joinedAt: "asc",
        },
        select: {
          id: true,
          userId: true,
          joinedAt: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    return null;
  }

  const activeInvite =
    group.invite && !isGroupInviteExpired(group.invite.expiresAt)
      ? group.invite
      : null;

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    ownerId: group.ownerId,
    isOwner: group.ownerId === userId,
    createdAt: formatDate(group.createdAt),
    members: group.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      nickname: member.user.nickname,
      isOwner: member.userId === group.ownerId,
      joinedAt: formatDate(member.joinedAt),
    })),
    activeInvite: activeInvite
      ? {
          token: activeInvite.token,
          invitePath: routes.invite(activeInvite.token),
          expiresAt: formatDate(activeInvite.expiresAt),
          createdAt: formatDate(activeInvite.createdAt),
        }
      : null,
  };
}

export async function getGroupInviteDetail(
  token: string,
  userId: string,
): Promise<GroupInviteDetail | null> {
  const invite = await prisma.groupInvite.findUnique({
    where: {
      token,
    },
    select: {
      token: true,
      expiresAt: true,
      group: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              members: true,
            },
          },
          members: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!invite) {
    return null;
  }

  const isExpired = isGroupInviteExpired(invite.expiresAt);

  return {
    token: invite.token,
    group: {
      id: invite.group.id,
      name: invite.group.name,
      memberCount: invite.group._count.members,
    },
    expiresAt: formatDate(invite.expiresAt),
    isAvailable: !isExpired,
    isAlreadyMember: invite.group.members.length > 0,
  };
}