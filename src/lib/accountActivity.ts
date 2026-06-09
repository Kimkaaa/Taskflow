import { getStartOfWeekInKorea } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export type AccountBadgeCode =
  | "FIRST_COMPLETED"
  | "COMPLETED_5"
  | "COMPLETED_10"
  | "COMPLETED_30"
  | "FIRST_GROUP_COMPLETED"
  | "GROUP_COMPLETED_5";

export type AccountBadge = {
  code: AccountBadgeCode;
  title: string;
  description: string;
  isEarned: boolean;
  current: number;
  target: number;
};

export type AccountActivity = {
  weeklyCompletedCount: number;
  totalCompletedCount: number;
  earnedBadgeCount: number;
  badges: AccountBadge[];
};

function createBadge({
  code,
  title,
  description,
  current,
  target,
}: {
  code: AccountBadgeCode;
  title: string;
  description: string;
  current: number;
  target: number;
}): AccountBadge {
  return {
    code,
    title,
    description,
    current,
    target,
    isEarned: current >= target,
  };
}

function getAccountBadges({
  totalCompletedCount,
  groupCompletedCount,
}: {
  totalCompletedCount: number;
  groupCompletedCount: number;
}) {
  return [
    createBadge({
      code: "FIRST_COMPLETED",
      title: "첫 삽",
      description: "첫 작업을 완료했어요.",
      current: totalCompletedCount,
      target: 1,
    }),
    createBadge({
      code: "COMPLETED_5",
      title: "새싹",
      description: "작업 5개를 완료했어요.",
      current: totalCompletedCount,
      target: 5,
    }),
    createBadge({
      code: "COMPLETED_10",
      title: "나무",
      description: "작업 10개를 완료했어요.",
      current: totalCompletedCount,
      target: 10,
    }),
    createBadge({
      code: "COMPLETED_30",
      title: "작은 숲",
      description: "작업 30개를 완료했어요.",
      current: totalCompletedCount,
      target: 30,
    }),
    createBadge({
      code: "FIRST_GROUP_COMPLETED",
      title: "첫 그룹 기여",
      description: "그룹 작업을 처음 완료했어요.",
      current: groupCompletedCount,
      target: 1,
    }),
    createBadge({
      code: "GROUP_COMPLETED_5",
      title: "함께한 기록",
      description: "그룹 작업 5개를 완료했어요.",
      current: groupCompletedCount,
      target: 5,
    }),
  ];
}

export async function getAccountActivity(userId: string): Promise<AccountActivity> {
  const startOfWeek = getStartOfWeekInKorea();

  const [weeklyCompletedCount, totalCompletedCount, groupCompletedCount] =
    await Promise.all([
      prisma.task.count({
        where: {
          userId,
          status: "DONE",
          completedAt: {
            gte: startOfWeek,
          },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          status: "DONE",
          completedAt: {
            not: null,
          },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          status: "DONE",
          visibility: "GROUP",
          groupId: {
            not: null,
          },
          completedAt: {
            not: null,
          },
        },
      }),
    ]);

  const badges = getAccountBadges({
    totalCompletedCount,
    groupCompletedCount,
  });

  return {
    weeklyCompletedCount,
    totalCompletedCount,
    earnedBadgeCount: badges.filter((badge) => badge.isEarned).length,
    badges,
  };
}