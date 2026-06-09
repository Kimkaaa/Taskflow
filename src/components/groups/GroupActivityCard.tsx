"use client";

import { useState } from "react";
import { SportShoe, BicepsFlexed, Trophy, type LucideIcon } from "lucide-react";
import AchievementList from "@/components/common/AchievementList";
import ActivityStats from "@/components/common/ActivityStats";
import { panelClassNames, textClassNames } from "@/constants/classNames";
import type { GroupActivity, GroupTrophyCode } from "@/lib/groups";

const trophyIconMap: Record<GroupTrophyCode, LucideIcon> = {
  WEEKLY_GROUP_COMPLETED_1: SportShoe,
  WEEKLY_GROUP_COMPLETED_5: BicepsFlexed,
  WEEKLY_GROUP_COMPLETED_10: Trophy,
};

export default function GroupActivityCard({
  activity,
}: {
  activity: GroupActivity;
}) {
  const [isTrophyListOpen, setIsTrophyListOpen] = useState(false);
  const trophyListId = "group-trophy-list";

  return (
    <section className={panelClassNames.surface}>
      <h2 className={textClassNames.titleSecondary}>그룹 활동</h2>

      <ActivityStats
        weeklyCompletedCount={activity.weeklyCompletedCount}
        totalCompletedCount={activity.totalCompletedCount}
        detailLabel="트로피"
        detailValue={activity.earnedTrophyCount}
        isDetailOpen={isTrophyListOpen}
        detailListId={trophyListId}
        onDetailToggle={() => setIsTrophyListOpen((current) => !current)}
      />

      {isTrophyListOpen ? (
        <AchievementList
          id={trophyListId}
          items={activity.trophies}
          iconMap={trophyIconMap}
        />
      ) : null}
    </section>
  );
}