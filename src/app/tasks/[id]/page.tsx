import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import TaskTodoList from "@/components/tasks/TaskTodoList";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";
import {
  getTaskById,
  priorityBadgeStyles,
  priorityLabels,
  statusBadgeStyles,
  statusLabels,
} from "@/lib/tasks";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const badgeBaseClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#191919] px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/tasks"
            aria-label="목록으로 돌아가기"
            title="목록으로 돌아가기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#d1d5db]"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-[#d1d5db]"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              수정
            </Link>

            <DeleteTaskButton taskId={task.id} />
          </div>
        </div>

        <article className="rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
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
              {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            {task.title}
          </h1>

          {task.description ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-white">설명</h2>

              <p className="mt-3 text-sm leading-6 text-[#d1d5db]">
                {task.description}
              </p>
            </section>
          ) : null}

          <TaskTodoList taskId={task.id} todos={task.todos} />

          {task.tags.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-white">태그</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tasks?tag=${encodeURIComponent(tag)}`}
                    className="rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-1 text-xs text-[#a3a3a3] transition hover:border-[#555555] hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </section>
    </main>
  );
}
