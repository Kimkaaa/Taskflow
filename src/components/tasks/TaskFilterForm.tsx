"use client";

import { useState, type FormEvent } from "react";
import { RotateCcw, Search } from "lucide-react";
import type {
  TaskPriority,
  TaskQuery,
  TaskSortOption,
  TaskStatus,
} from "@/types/task";
import {
  priorityLabels,
  priorityOptions,
  statusLabels,
  statusOptions,
} from "@/constants/taskMeta";

type TaskFilterFormProps = {
  query: TaskQuery;
  onNavigate: (href: string, nextQuery: TaskQuery) => void;
};

type TaskQueryUpdates = Partial<{
  keyword: string;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  sort: TaskSortOption | null;
  tag: string | null;
}>;

const chipBaseClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition";

const resetButtonClass =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-app-base bg-app-bg text-app-soft transition";

function getChipClass(isActive: boolean) {
  return isActive
    ? `${chipBaseClass} border-app-strong bg-app-base text-white`
    : `${chipBaseClass} border-app-base bg-app-bg text-app-soft`;
}

function createNextQuery(
  query: TaskQuery,
  updates: TaskQueryUpdates,
): TaskQuery {
  const keyword =
    updates.keyword !== undefined ? updates.keyword.trim() : query.keyword;
  const status = updates.status !== undefined ? updates.status : query.status;
  const priority =
    updates.priority !== undefined ? updates.priority : query.priority;
  const sort = updates.sort !== undefined ? updates.sort : query.sort;
  const tag =
    updates.tag !== undefined ? updates.tag?.trim() || null : query.tag;

  return {
    keyword: keyword || undefined,
    status: status ?? undefined,
    priority: priority ?? undefined,
    sort: sort ?? undefined,
    tag: tag || undefined,
  };
}

function createTaskListHref(query: TaskQuery) {
  const params = new URLSearchParams();

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.priority) {
    params.set("priority", query.priority);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.tag) {
    params.set("tag", query.tag);
  }

  const queryString = params.toString();

  return queryString ? `/tasks?${queryString}` : "/tasks";
}

export default function TaskFilterForm({
  query,
  onNavigate,
}: TaskFilterFormProps) {
  const [keywordValue, setKeywordValue] = useState(query.keyword ?? "");

  const navigateWithUpdates = (updates: TaskQueryUpdates) => {
    const nextQuery = createNextQuery(query, {
      keyword: updates.keyword !== undefined ? updates.keyword : keywordValue,
      status: updates.status,
      priority: updates.priority,
      sort: updates.sort,
      tag: updates.tag,
    });

    const href = createTaskListHref(nextQuery);

    onNavigate(href, nextQuery);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    navigateWithUpdates({
      keyword: keywordValue,
    });
  };

  const handleReset = () => {
    setKeywordValue("");
    onNavigate("/tasks", {});
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
          <span className="rounded-md border border-app-base bg-app-bg px-2 py-1 text-xs text-app-muted">
            #{query.tag}
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3">
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
                className={getChipClass(isActive)}
              >
                {statusLabels[status]}
              </button>
            );
          })}
        </div>

        <span className="hidden h-5 w-px bg-app-base sm:block" />

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
                className={getChipClass(isActive)}
              >
                {priorityLabels[priority]}
              </button>
            );
          })}
        </div>

        <span className="hidden h-5 w-px bg-app-base sm:block" />

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigateWithUpdates({
                sort: query.sort === "dueAsc" ? null : "dueAsc",
              });
            }}
            className={getChipClass(query.sort === "dueAsc")}
          >
            마감일
          </button>

          <button
            type="button"
            onClick={() => {
              navigateWithUpdates({
                sort: query.sort === "priorityDesc" ? null : "priorityDesc",
              });
            }}
            className={getChipClass(query.sort === "priorityDesc")}
          >
            중요도
          </button>
        </div>
      </div>
    </section>
  );
}