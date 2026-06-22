"use client";

import {
  createContext,
  useContext,
  useOptimistic,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Search, X } from "lucide-react";
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
} from "@/constants/taskMeta";
import { taskClassNames } from "@/constants/classNames";
import { createTaskListHref } from "@/lib/taskQuery";

type TaskFilterFormProps = {
  query: TaskQuery;
  children?: ReactNode;
};

type TaskQueryUpdates = Partial<{
  keyword: string | null;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  tag: string | null;
  scope: TaskScope | null;
  groupId: string | null;
}>;

type TaskFilterNavigationContextValue = {
  optimisticQuery: TaskQuery;
  navigateWithUpdates: (updates: TaskQueryUpdates) => void;
};

const TaskFilterNavigationContext =
  createContext<TaskFilterNavigationContextValue | null>(null);

export function useTaskFilterNavigation() {
  const context = useContext(TaskFilterNavigationContext);

  if (!context) {
    throw new Error("useTaskFilterNavigation must be used within TaskFilterForm.");
  }

  return context;
}

const resetButtonClass =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-app-base bg-app-bg text-app-soft transition";

function getDetailChipClass(isActive: boolean) {
  return isActive
    ? `${taskClassNames.filterDetailChipBase} text-app-soft`
    : `${taskClassNames.filterDetailChipBase} text-app-muted`;
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
  children,
}: TaskFilterFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [keywordValue, setKeywordValue] = useState(query.keyword ?? "");
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(
    query,
    (_currentQuery, nextQuery: TaskQuery) => nextQuery,
  );

  const navigate = (nextQuery: TaskQuery) => {
    startTransition(() => {
      setOptimisticQuery(nextQuery);

      router.push(createTaskListHref(nextQuery), {
        scroll: false,
      });
    });
  };

  const navigateWithUpdates = (updates: TaskQueryUpdates) => {
    const nextQuery = createNextQuery(optimisticQuery, {
      keyword: updates.keyword !== undefined ? updates.keyword : keywordValue,
      status: updates.status,
      priority: updates.priority,
      tag: updates.tag,
      scope: updates.scope,
      groupId: updates.groupId,
    });

    navigate(nextQuery);
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
    navigate(
      createNextQuery(optimisticQuery, {
        tag: null,
      }),
    );
  };

  const handleReset = () => {
    setKeywordValue("");
    navigate({});
  };

  return (
    <TaskFilterNavigationContext.Provider
      value={{
        optimisticQuery,
        navigateWithUpdates,
      }}
    >
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

        {optimisticQuery.tag ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <div
              className={`${taskClassNames.tag} inline-flex items-center gap-1.5`}
            >
              <span>#{optimisticQuery.tag}</span>

              <button
                type="button"
                onClick={handleTagClear}
                className="cursor-pointer text-app-muted transition hover:text-white"
                aria-label={`#${optimisticQuery.tag} 태그 필터 제거`}
                title="태그 필터 제거"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}

        {children}

        <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {statusOptions.map((status) => {
              const isActive = optimisticQuery.status === status;

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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {priorityOptions.map((priority) => {
              const isActive = optimisticQuery.priority === priority;

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
      </section>
    </TaskFilterNavigationContext.Provider>
  );
}