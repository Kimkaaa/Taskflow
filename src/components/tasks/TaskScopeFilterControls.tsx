"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Dialog from "@/components/common/Dialog";
import type { TaskQuery, TaskScope } from "@/types/task";
import { dialogClassNames, taskClassNames } from "@/constants/classNames";
import { taskScopeLabels, taskScopeOptions } from "@/constants/taskMeta";
import { createTaskListHref } from "@/lib/taskQuery";

type TaskGroupOption = {
  id: string;
  name: string;
};

type TaskScopeFilterControlsProps = {
  query: TaskQuery;
  groupOptions: TaskGroupOption[];
};

type TaskQueryUpdates = Partial<{
  scope: TaskScope | null;
  groupId: string | null;
}>;

function getScopeChipClass(isActive: boolean) {
  return isActive
    ? `${taskClassNames.filterScopeChipBase} border-app-strong bg-app-base text-white`
    : `${taskClassNames.filterScopeChipBase} border-app-base bg-app-bg text-app-soft`;
}

function getGroupOptionClass(isSelected: boolean) {
  return isSelected
    ? dialogClassNames.optionButtonSelected
    : dialogClassNames.optionButtonDefault;
}

function createNextQuery(
  query: TaskQuery,
  updates: TaskQueryUpdates,
): TaskQuery {
  const scope = updates.scope !== undefined ? updates.scope : query.scope;
  const nextScope = scope && scope !== "all" ? scope : undefined;

  const groupId =
    updates.groupId !== undefined
      ? updates.groupId?.trim() || null
      : query.groupId;

  return {
    ...query,
    scope: nextScope,
    groupId: nextScope === "group" ? groupId || undefined : undefined,
  };
}

export default function TaskScopeFilterControls({
  query,
  groupOptions,
}: TaskScopeFilterControlsProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  const navigate = (nextQuery: TaskQuery) => {
    startTransition(() => {
      router.push(createTaskListHref(nextQuery), {
        scroll: false,
      });
    });
  };

  const navigateWithUpdates = (updates: TaskQueryUpdates) => {
    navigate(createNextQuery(query, updates));
  };

  const handleScopeChange = (scope: TaskScope) => {
    const currentScope = query.scope ?? "all";
    const nextScope = scope === "all" || currentScope === scope ? null : scope;

    navigateWithUpdates({
      scope: nextScope,
      groupId: null,
    });
  };

  const handleSelectGroup = (groupId: string | null) => {
    navigateWithUpdates({
      scope: "group",
      groupId,
    });

    setIsGroupDialogOpen(false);
  };

  const selectedGroup = groupOptions.find(
    (group) => group.id === query.groupId,
  );

  const shouldShowGroupSelector =
    query.scope === "group" && groupOptions.length > 0;

  const groupFilterLabel = selectedGroup?.name ?? "그룹 전체";

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
        {taskScopeOptions.map((scope) => {
          const currentScope = query.scope ?? "all";
          const isActive = currentScope === scope;

          return (
            <button
              key={scope}
              type="button"
              onClick={() => handleScopeChange(scope)}
              className={getScopeChipClass(isActive)}
            >
              {taskScopeLabels[scope]}
            </button>
          );
        })}
      </div>

      {shouldShowGroupSelector ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsGroupDialogOpen(true)}
            className="inline-flex h-8 max-w-full cursor-pointer items-center gap-1 rounded-full bg-app-base/60 px-3 text-sm font-medium text-app-soft"
            aria-label="그룹 필터 선택"
            title={groupFilterLabel}
          >
            <span className="truncate">{groupFilterLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <Dialog
        open={isGroupDialogOpen}
        title="그룹 선택"
        description="조회할 그룹을 선택해 주세요."
        onClose={() => setIsGroupDialogOpen(false)}
      >
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => handleSelectGroup(null)}
            className={getGroupOptionClass(!query.groupId)}
          >
            그룹 전체
          </button>

          {groupOptions.map((group) => {
            const isSelected = query.groupId === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelectGroup(group.id)}
                className={getGroupOptionClass(isSelected)}
              >
                {group.name}
              </button>
            );
          })}
        </div>
      </Dialog>
    </>
  );
}