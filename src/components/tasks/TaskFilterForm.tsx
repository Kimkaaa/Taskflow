"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import Dialog from "@/components/common/Dialog";
import type {
  TaskPriority,
  TaskQuery,
  TaskScope,
  TaskStatus,
} from "@/types/task";
import {
  priorityLabels,
  priorityOptions,
  statusLabels,
  statusOptions,
  taskScopeLabels,
  taskScopeOptions,
} from "@/constants/taskMeta";
import { dialogClassNames, taskClassNames } from "@/constants/classNames";
import { createTaskListHref } from "@/lib/taskQuery";

type TaskGroupOption = {
  id: string;
  name: string;
};

type TaskFilterFormProps = {
  query: TaskQuery;
  onNavigate: (href: string, nextQuery: TaskQuery) => void;
  isLoggedIn: boolean;
  groupOptions: TaskGroupOption[];
};

type TaskQueryUpdates = Partial<{
  keyword: string | null;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  tag: string | null;
  scope: TaskScope | null;
  groupId: string | null;
}>;

const resetButtonClass =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-app-base bg-app-bg text-app-soft transition";

function getChipClass(isActive: boolean) {
  return isActive
    ? `${taskClassNames.filterScopeChipBase} border-app-strong bg-app-base text-white`
    : `${taskClassNames.filterScopeChipBase} border-app-base bg-app-bg text-app-soft`;
}

function getDetailChipClass(isActive: boolean) {
  return isActive
    ? `${taskClassNames.filterDetailChipBase} text-app-soft`
    : `${taskClassNames.filterDetailChipBase} text-app-muted`;
}

function getGroupOptionClass(isSelected: boolean) {
  return isSelected
    ? dialogClassNames.optionButtonSelected
    : dialogClassNames.optionButtonDefault;
}

function parseHashTagSearch(value: string) {
  const keyword = value.trim();

  if (!keyword.startsWith("#")) {
    return null;
  }

  const tag = keyword.slice(1);

  if (!tag || tag.includes("#") || /\s/.test(tag)) {
    return null;
  }

  return tag;
}

function createNextQuery(
  query: TaskQuery,
  updates: TaskQueryUpdates,
): TaskQuery {
  const keyword =
    updates.keyword !== undefined
      ? updates.keyword?.trim() || null
      : query.keyword;

  const status = updates.status !== undefined ? updates.status : query.status;

  const priority =
    updates.priority !== undefined ? updates.priority : query.priority;

  const tag =
    updates.tag !== undefined ? updates.tag?.trim() || null : query.tag;

  const scope = updates.scope !== undefined ? updates.scope : query.scope;
  const nextScope = scope && scope !== "all" ? scope : undefined;

  const groupId =
    updates.groupId !== undefined
      ? updates.groupId?.trim() || null
      : query.groupId;

  return {
    keyword: keyword || undefined,
    status: status ?? undefined,
    priority: priority ?? undefined,
    tag: tag || undefined,
    scope: nextScope,
    groupId: nextScope === "group" ? groupId || undefined : undefined,
  };
}

export default function TaskFilterForm({
  query,
  onNavigate,
  isLoggedIn,
  groupOptions,
}: TaskFilterFormProps) {
  const [keywordValue, setKeywordValue] = useState(query.keyword ?? "");
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  const navigateWithUpdates = (updates: TaskQueryUpdates) => {
    const nextQuery = createNextQuery(query, {
      keyword: updates.keyword !== undefined ? updates.keyword : keywordValue,
      status: updates.status,
      priority: updates.priority,
      tag: updates.tag,
      scope: updates.scope,
      groupId: updates.groupId,
    });

    onNavigate(createTaskListHref(nextQuery), nextQuery);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tag = parseHashTagSearch(keywordValue);

    if (tag) {
      setKeywordValue("");

      navigateWithUpdates({
        keyword: null,
        tag,
      });

      return;
    }

    navigateWithUpdates({
      keyword: keywordValue,
    });
  };

  const handleTagClear = () => {
    const nextQuery = createNextQuery(query, {
      tag: null,
    });

    onNavigate(createTaskListHref(nextQuery), nextQuery);
  };

  const selectedGroup = groupOptions.find((group) => group.id === query.groupId);
  const shouldShowGroupSelector = query.scope === "group" && groupOptions.length > 0;
  const groupFilterLabel = selectedGroup?.name ?? "그룹 전체";

  const handleSelectGroup = (groupId: string | null) => {
    navigateWithUpdates({
      scope: "group",
      groupId,
    });

    setIsGroupDialogOpen(false);
  };

  const handleScopeChange = (scope: TaskScope) => {
    const currentScope = query.scope ?? "all";
    const nextScope = scope === "all" || currentScope === scope ? null : scope;

    navigateWithUpdates({
      scope: nextScope,
      groupId: null,
    });
  };

  const handleReset = () => {
    setKeywordValue("");
    onNavigate(createTaskListHref({}), {});
  };

  return (
    <section className="mb-5 rounded-2xl border border-app-base bg-app-surface p-4 shadow-sm">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted"
            aria-hidden="true"
          />

          <input
            type="search"
            name="keyword"
            enterKeyHint="search"
            value={keywordValue}
            onChange={(event) => setKeywordValue(event.target.value)}
            placeholder="검색"
            aria-label="작업 검색"
            className="task-search-input h-10 w-full rounded-xl border border-app-base bg-app-bg pl-9 pr-1 text-sm text-white outline-none transition placeholder:text-app-muted focus:border-app-focus focus:bg-app-bg"
          />
        </label>

        <button
          type="button"
          onClick={handleReset}
          className={resetButtonClass}
          aria-label="초기화"
          title="초기화"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {query.tag ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <div className={`${taskClassNames.tag} inline-flex items-center gap-1.5`}>
            <span>#{query.tag}</span>

            <button
              type="button"
              onClick={handleTagClear}
              className="cursor-pointer text-app-muted transition hover:text-white"
              aria-label={`#${query.tag} 태그 필터 제거`}
              title="태그 필터 제거"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {isLoggedIn ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {taskScopeOptions.map((scope) => {
            const currentScope = query.scope ?? "all";
            const isActive = currentScope === scope;

            return (
              <button
                key={scope}
                type="button"
                onClick={() => handleScopeChange(scope)}
                className={getChipClass(isActive)}
              >
                {taskScopeLabels[scope]}
              </button>
            );
          })}
        </div>
      ) : null}

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

      <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {statusOptions.map((status) => {
            const isActive = query.status === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  navigateWithUpdates({
                    status: isActive ? null : status,
                  });
                }}
                className={getDetailChipClass(isActive)}
              >
                {statusLabels[status]}
              </button>
            );
          })}
        </div>

        <span className="h-5 w-px bg-app-base" />

        <div className="flex shrink-0 items-center gap-2">
          {priorityOptions.map((priority) => {
            const isActive = query.priority === priority;

            return (
              <button
                key={priority}
                type="button"
                onClick={() => {
                  navigateWithUpdates({
                    priority: isActive ? null : priority,
                  });
                }}
                className={getDetailChipClass(isActive)}
              >
                {priorityLabels[priority]}
              </button>
            );
          })}
        </div>
      </div>

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
    </section>
  );
}