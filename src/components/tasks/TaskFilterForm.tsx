import Link from "next/link";
import { RotateCcw, Search } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types/task";
import type { TaskQuery, TaskSortOption } from "@/lib/tasks";
import { priorityLabels, statusLabels } from "@/lib/tasks";

type TaskFilterFormProps = {
  query: TaskQuery;
};

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const priorityOptions: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

const chipBaseClass =
  "inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition";

function getChipClass(isActive: boolean) {
  return isActive
    ? `${chipBaseClass} border-[#555555] bg-[#3a3a3a] text-white`
    : `${chipBaseClass} border-[#3a3a3a] bg-[#191919] text-[#d1d5db]`;
}

function createTaskListHref(
  query: TaskQuery,
  updates: Partial<{
    keyword: string;
    status: TaskStatus | null;
    priority: TaskPriority | null;
    sort: TaskSortOption | null;
    tag: string | null;
  }>,
) {
  const params = new URLSearchParams();

  const keyword =
    updates.keyword !== undefined ? updates.keyword : (query.keyword ?? "");
  const status = updates.status !== undefined ? updates.status : query.status;
  const priority =
    updates.priority !== undefined ? updates.priority : query.priority;
  const sort = updates.sort !== undefined ? updates.sort : query.sort;
  const tag = updates.tag !== undefined ? updates.tag : query.tag;

  if (keyword) {
    params.set("keyword", keyword);
  }

  if (status) {
    params.set("status", status);
  }

  if (priority) {
    params.set("priority", priority);
  }

  if (sort) {
    params.set("sort", sort);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const queryString = params.toString();

  return queryString ? `/tasks?${queryString}` : "/tasks";
}

export default function TaskFilterForm({ query }: TaskFilterFormProps) {
  return (
    <section className="mb-5 rounded-2xl border border-[#3a3a3a] bg-[#242424] p-4 shadow-sm">
      <form action="/tasks" className="flex gap-2">
        {query.status ? (
          <input type="hidden" name="status" value={query.status} />
        ) : null}

        {query.priority ? (
          <input type="hidden" name="priority" value={query.priority} />
        ) : null}

        {query.sort ? (
          <input type="hidden" name="sort" value={query.sort} />
        ) : null}

        {query.tag ? (
          <input type="hidden" name="tag" value={query.tag} />
        ) : null}

        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]"
            aria-hidden="true"
          />

          <input
            type="search"
            name="keyword"
            enterKeyHint="search"
            defaultValue={query.keyword ?? ""}
            placeholder="검색"
            className="task-search-input h-10 w-full rounded-xl border border-[#3a3a3a] bg-[#191919] pl-9 pr-1 text-sm text-white outline-none transition placeholder:text-[#a3a3a3] focus:border-[#6b7280] focus:bg-[#191919]"
          />
        </label>

        <Link
          href="/tasks"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#191919] text-[#d1d5db] transition"
          aria-label="초기화"
          title="초기화"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </Link>
      </form>

      {query.tag ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-1 text-xs text-[#a3a3a3]">
            #{query.tag}
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {statusOptions.map((status) => {
            const isActive = query.status === status;
            const href = createTaskListHref(query, {
              status: isActive ? null : status,
            });

            return (
              <Link key={status} href={href} className={getChipClass(isActive)}>
                {statusLabels[status]}
              </Link>
            );
          })}
        </div>

        <span className="hidden h-5 w-px bg-[#3a3a3a] sm:block" />

        <div className="flex shrink-0 items-center gap-2">
          {priorityOptions.map((priority) => {
            const isActive = query.priority === priority;
            const href = createTaskListHref(query, {
              priority: isActive ? null : priority,
            });

            return (
              <Link
                key={priority}
                href={href}
                className={getChipClass(isActive)}
              >
                {priorityLabels[priority]}
              </Link>
            );
          })}
        </div>

        <span className="hidden h-5 w-px bg-[#3a3a3a] sm:block" />

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={createTaskListHref(query, {
              sort: query.sort === "dueAsc" ? null : "dueAsc",
            })}
            className={getChipClass(query.sort === "dueAsc")}
          >
            마감일
          </Link>

          <Link
            href={createTaskListHref(query, {
              sort: query.sort === "priorityDesc" ? null : "priorityDesc",
            })}
            className={getChipClass(query.sort === "priorityDesc")}
          >
            중요도
          </Link>
        </div>
      </div>
    </section>
  );
}
