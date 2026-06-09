"use client";

import { useState } from "react";
import {
  Shovel,
  Sprout,
  Shrub,
  Trees,
  Smile,
  SmilePlus,
  type LucideIcon,
} from "lucide-react";
import AchievementList from "@/components/common/AchievementList";
import ActivityStats from "@/components/common/ActivityStats";
import { panelClassNames, textClassNames } from "@/constants/classNames";
import type {
  AccountActivity,
  AccountBadgeCode,
} from "@/lib/accountActivity";

const badgeIconMap: Record<AccountBadgeCode, LucideIcon> = {
  FIRST_COMPLETED: Shovel,
  COMPLETED_5: Sprout,
  COMPLETED_10: Shrub,
  COMPLETED_30: Trees,
  FIRST_GROUP_COMPLETED: Smile,
  GROUP_COMPLETED_5: SmilePlus,
};

export default function AccountActivityCard({
  activity,
}: {
  activity: AccountActivity;
}) {
  const [isBadgeListOpen, setIsBadgeListOpen] = useState(false);
  const badgeListId = "account-badge-list";

  return (
    <section className={panelClassNames.surface}>
      <h2 className={textClassNames.titleSecondary}>내 활동</h2>

      <ActivityStats
        weeklyCompletedCount={activity.weeklyCompletedCount}
        totalCompletedCount={activity.totalCompletedCount}
        detailLabel="뱃지"
        detailValue={activity.earnedBadgeCount}
        isDetailOpen={isBadgeListOpen}
        detailListId={badgeListId}
        onDetailToggle={() => setIsBadgeListOpen((current) => !current)}
      />

      {isBadgeListOpen ? (
        <AchievementList
          id={badgeListId}
          items={activity.badges}
          iconMap={badgeIconMap}
        />
      ) : null}
    </section>
  );
}