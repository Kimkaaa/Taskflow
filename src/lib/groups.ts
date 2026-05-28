import { prisma } from "@/lib/prisma";
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
  ownerId: string;
  isOwner: boolean;
  createdAt: string;
  members: GroupMemberSummary[];
  tasks: GroupTaskSummary[];
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