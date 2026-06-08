import {
  Lock,
  Shovel,
  Sprout,
  Shrub,
  Trees,
  Smile,
  SmilePlus,
  type LucideIcon,
} from "lucide-react";
import { panelClassNames, textClassNames } from "@/constants/classNames";
import type {
  AccountActivity,
  AccountBadge,
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-app-base bg-app-bg px-4 py-3">
      <p className={textClassNames.meta}>{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function BadgeCard({ badge }: { badge: AccountBadge }) {
  const Icon = badge.isEarned ? badgeIconMap[badge.code] : Lock;

  const cardClassName = badge.isEarned
    ? "border-amber-400/30 bg-amber-400/10"
    : "border-app-base bg-app-bg/60";

  const iconClassName = badge.isEarned
    ? "bg-amber-400/15 text-amber-200"
    : "border border-app-base text-app-muted";

  const titleClassName = badge.isEarned
    ? "text-amber-100"
    : "text-app-muted";

  const iconSvgClassName = badge.isEarned
    ? "h-5 w-5"
    : "h-5 w-5 scale-x-90";

  return (
    <article className={`rounded-xl border p-4 ${cardClassName}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon className={iconSvgClassName} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h3 className={`text-sm font-semibold ${titleClassName}`}>
            {badge.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-app-muted">
            {badge.description}
          </p>

          <p className="mt-1 text-xs font-medium text-app-muted">
            {Math.min(badge.current, badge.target)}/{badge.target}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AccountActivityCard({
  activity,
}: {
  activity: AccountActivity;
}) {
  return (
    <section className={panelClassNames.surface}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={textClassNames.titleSecondary}>내 활동</h2>

        <div className="shrink-0 whitespace-nowrap rounded-full border border-app-base bg-app-bg px-3 py-1 text-xs font-medium text-app-soft">
          뱃지 {activity.earnedBadgeCount}/{activity.badges.length}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <StatCard label="이번 주" value={activity.weeklyCompletedCount} />
        <StatCard label="전체 완료" value={activity.totalCompletedCount} />
        <StatCard label="획득 뱃지" value={activity.earnedBadgeCount} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {activity.badges.map((badge) => (
          <BadgeCard key={badge.code} badge={badge} />
        ))}
      </div>
    </section>
  );
}