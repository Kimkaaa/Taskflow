import { prisma } from "@/lib/prisma";

export type GroupSummary = {
  id: string;
  name: string;
  isOwner: boolean;
  memberCount: number;
  taskCount: number;
  joinedAt: string;
  createdAt: string;
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