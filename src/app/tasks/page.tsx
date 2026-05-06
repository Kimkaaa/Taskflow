import Link from "next/link";
import { Plus } from "lucide-react";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import {
  getPublicTasks,
  parseTaskQuery,
  priorityBadgeStyles,
  priorityLabels,
  statusBadgeStyles,
  statusLabels,
} from "@/lib/tasks";

type TasksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const badgeBaseClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const query = parseTaskQuery(params);
  const tasks = await getPublicTasks(query);

  return (
    <main className="min-h-screen bg-[#191919] px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            TaskFlow
          </h1>

          <Link
            href="/login"
            className="rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] hover:text-white"
          >
            로그인
          </Link>
        </div>

        <TaskFilterForm query={query} />

        <div className="mb-4 text-sm text-[#a3a3a3]">
          총{" "}
          <span className="font-semibold text-white">{tasks.length}</span>
          개의 작업
        </div>

        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="block rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2b2b2b] hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`${badgeBaseClass} ${statusBadgeStyles[task.status]}`}
                      >
                        {statusLabels[task.status]}
                      </span>

                      <span
                        className={`${badgeBaseClass} ${priorityBadgeStyles[task.priority]}`}
                      >
                        {priorityLabels[task.priority]}
                      </span>

                      <span className="text-xs font-medium text-[#a3a3a3]">
                        {task.dueDate
                          ? `마감일 ${task.dueDate}`
                          : "마감일 없음"}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white">
                      {task.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#d1d5db]">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-1 text-xs text-[#a3a3a3]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#3a3a3a] bg-[#242424] p-10 text-center">
            <p className="font-semibold text-white">
              조건에 맞는 작업이 없습니다.
            </p>
            <p className="mt-2 text-sm text-[#a3a3a3]">
              검색어나 필터 조건을 변경해보세요.
            </p>
          </div>
        )}
      </section>

      <Link
        href="/tasks/new"
        aria-label="작업 등록"
        title="작업 등록"
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3a3a]/80 text-white shadow-lg backdrop-blur transition"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </Link>
    </main>
  );
}