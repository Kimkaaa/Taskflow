"use client";

import { ChevronDown } from "lucide-react";
import { textClassNames } from "@/constants/classNames";

type ActivityStatCardProps = {
  label: string;
  value: number;
  onClick?: () => void;
  isExpanded?: boolean;
  ariaControls?: string;
};

type ActivityStatsProps = {
  weeklyCompletedCount: number;
  totalCompletedCount: number;
  detailLabel: string;
  detailValue: number;
  isDetailOpen: boolean;
  detailListId: string;
  onDetailToggle: () => void;
};

function ActivityStatCard({
  label,
  value,
  onClick,
  isExpanded,
  ariaControls,
}: ActivityStatCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between sm:gap-2">
        <p className={textClassNames.meta}>{label}</p>

        {onClick ? (
          <ChevronDown
            className={`h-3.5 w-3.5 text-app-muted transition ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </>
  );

  const className =
    "rounded-xl border border-app-base bg-app-bg px-4 py-3 text-left";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isExpanded}
        aria-controls={ariaControls}
        className={`${className} cursor-pointer transition`}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function ActivityStats({
  weeklyCompletedCount,
  totalCompletedCount,
  detailLabel,
  detailValue,
  isDetailOpen,
  detailListId,
  onDetailToggle,
}: ActivityStatsProps) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      <ActivityStatCard label="이번 주" value={weeklyCompletedCount} />
      <ActivityStatCard label="전체 완료" value={totalCompletedCount} />
      <ActivityStatCard
        label={detailLabel}
        value={detailValue}
        onClick={onDetailToggle}
        isExpanded={isDetailOpen}
        ariaControls={detailListId}
      />
    </div>
  );
}