import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TaskHistoryList from "@/components/tasks/TaskHistoryList";
import TaskStatusForm from "@/components/tasks/TaskStatusForm";
import {
  getTaskById,
  getTaskHistoriesByTaskId,
  priorityLabels,
  statusLabels,
} from "@/lib/tasks";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task || !task.isPublic) {
    return {
      title: "작업을 찾을 수 없음 | TaskFlow",
    };
  }

  return {
    title: `${task.title} | TaskFlow`,
    description: task.description,
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task || !task.isPublic) {
    notFound();
  }

  const histories = getTaskHistoriesByTaskId(task.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/tasks"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← 작업 목록으로
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Task Detail</p>
              <h1 className="mt-2 text-3xl font-bold">{task.title}</h1>
            </div>

            <Link
              href={`/tasks/${task.id}/edit`}
              className="inline-flex w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              수정
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {statusLabels[task.status]}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                우선순위 {priorityLabels[task.priority]}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {task.isPublic ? "공개" : "비공개"}
              </span>
            </div>

            <div className="mt-8 space-y-6">
              <section>
                <h2 className="text-sm font-semibold text-slate-500">설명</h2>
                <p className="mt-2 leading-7 text-slate-700">
                  {task.description}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-500">메모</h2>
                <p className="mt-2 leading-7 text-slate-700">
                  {task.memo ?? "등록된 메모가 없습니다."}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-500">마감일</h2>
                <p className="mt-2 text-slate-700">
                  {task.dueDate ?? "마감일 없음"}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-500">태그</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-500">
                    생성일
                  </h2>
                  <p className="mt-2 text-slate-700">{task.createdAt}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-500">
                    수정일
                  </h2>
                  <p className="mt-2 text-slate-700">{task.updatedAt}</p>
                </div>
              </section>
            </div>
          </article>

          <TaskStatusForm task={task} />

          <TaskHistoryList histories={histories} />
        </div>
      </section>
    </main>
  );
}