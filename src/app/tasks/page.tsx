import Link from "next/link";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import { getPublicTasks, priorityLabels, parseTaskQuery, statusLabels } from "@/lib/tasks";

type TasksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const query = parseTaskQuery(params);
  const tasks = await getPublicTasks(query);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Tasks</p>
            <h1 className="mt-2 text-3xl font-bold">작업 목록</h1>
            <p className="mt-3 text-slate-600">
              공개된 작업 목록을 확인하고, 로그인한 사용자는 작업을 관리할 수
              있습니다.
            </p>
          </div>

          <Link
            href="/tasks/new"
            className="inline-flex w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            작업 등록
          </Link>
        </div>

        <TaskFilterForm query={query} />

        <div className="mb-4 text-sm text-slate-500">
          총 <span className="font-semibold text-slate-900">{tasks.length}</span>
          개의 작업이 조회되었습니다.
        </div>

        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {statusLabels[task.status]}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        우선순위 {priorityLabels[task.priority]}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold">{task.title}</h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {task.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm text-slate-500">
                    {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-800">
              조건에 맞는 작업이 없습니다.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              검색어나 필터 조건을 변경해보세요.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}