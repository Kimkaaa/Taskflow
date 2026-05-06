import Link from "next/link";
import {
  priorityLabels,
  sortLabels,
  statusLabels,
  type TaskQuery,
} from "@/lib/tasks";

type TaskFilterFormProps = {
  query: TaskQuery;
};

export default function TaskFilterForm({ query }: TaskFilterFormProps) {
  return (
    <form
      action="/tasks"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="keyword"
            className="block text-sm font-semibold text-slate-700"
          >
            검색어
          </label>
          <input
            id="keyword"
            name="keyword"
            type="search"
            defaultValue={query.keyword ?? ""}
            placeholder="제목, 설명, 메모, 태그 검색"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-slate-700"
          >
            상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={query.status ?? "ALL"}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            <option value="ALL">전체</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-semibold text-slate-700"
          >
            우선순위
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={query.priority ?? "ALL"}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            <option value="ALL">전체</option>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-semibold text-slate-700"
          >
            정렬
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={query.sort ?? "updatedDesc"}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-[46px] rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            적용
          </button>

          <Link
            href="/tasks"
            className="flex h-[46px] items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}