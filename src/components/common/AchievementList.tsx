"use client";

import { Lock, type LucideIcon } from "lucide-react";

type AchievementListItem<Code extends string> = {
  code: Code;
  title: string;
  description: string;
  isEarned: boolean;
  current: number;
  target: number;
};

type AchievementListProps<Code extends string> = {
  id: string;
  items: AchievementListItem<Code>[];
  iconMap: Record<Code, LucideIcon>;
};

type AchievementCardProps = {
  title: string;
  description: string;
  isEarned: boolean;
  current: number;
  target: number;
  icon: LucideIcon;
};

function AchievementCard({
  title,
  description,
  isEarned,
  current,
  target,
  icon,
}: AchievementCardProps) {
  const Icon = isEarned ? icon : Lock;

  const cardClassName = isEarned
    ? "border-amber-400/30 bg-amber-400/10"
    : "border-app-base bg-app-bg/60";

  const iconClassName = isEarned
    ? "bg-amber-400/15 text-amber-200"
    : "border border-app-base text-app-muted";

  const titleClassName = isEarned ? "text-amber-100" : "text-app-muted";

  const iconSvgClassName = isEarned ? "h-5 w-5" : "h-4 w-4";

  return (
    <article className={`rounded-xl border p-4 ${cardClassName}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon className={iconSvgClassName} aria-hidden="true" />
        </div>

        <div>
          <h3 className={`text-sm font-semibold ${titleClassName}`}>
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-app-muted">
            {description}
          </p>

          <p className="mt-1.5 text-xs font-medium text-app-muted">
            {Math.min(current, target)}/{target}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AchievementList<Code extends string>({
  id,
  items,
  iconMap,
}: AchievementListProps<Code>) {
  return (
    <div id={id} className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <AchievementCard
          key={item.code}
          title={item.title}
          description={item.description}
          isEarned={item.isEarned}
          current={item.current}
          target={item.target}
          icon={iconMap[item.code]}
        />
      ))}
    </div>
  );
}