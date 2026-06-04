import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, Pencil, Users } from "lucide-react";
import BackButton from "@/components/common/BackButton";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
import TaskTodoList from "@/components/tasks/TaskTodoList";
import {
  pageClassNames,
  panelClassNames,
  taskClassNames,
  textClassNames,
} from "@/constants/classNames";
import { getCurrentUser } from "@/lib/auth";
import { getTaskById } from "@/lib/tasks";
import { routes } from "@/constants/routes";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const task = await getTaskById(id, user?.id);

  if (!task) {
    notFound();
  }

  const canEdit = Boolean(user && task.userId === user.id);

  const visibilityIcon =
    task.visibility === "PRIVATE" ? (
      <span
        className="mt-1 shrink-0 text-app-muted"
        aria-label="개인 작업"
        title="개인 작업"
      >
        <Lock className="h-3.5 w-3.5 scale-x-90" aria-hidden="true" />
      </span>
    ) : task.visibility === "GROUP" ? (
      <span
        className="mt-1 shrink-0 text-app-muted"
        aria-label="그룹 작업"
        title="그룹 작업"
      >
        <Users className="h-3.5 w-3.5 scale-x-110" aria-hidden="true" />
      </span>
    ) : null;

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <BackButton label="목록으로 돌아가기" />

          {canEdit ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/tasks/${task.id}/edit`}
                replace
                className={taskClassNames.editActionButton}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                수정
              </Link>

              <DeleteTaskButton taskId={task.id} />
            </div>
          ) : null}
        </div>

        <article className={panelClassNames.surface}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />

              <span className={textClassNames.meta}>
                {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
              </span>
            </div>

            {visibilityIcon}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            {task.title}
          </h1>

          <p className="mt-3 text-sm text-app-muted">
            by {task.authorNickname}

            {task.groupId && task.groupName ? (
              <>
                {" · "}
                <Link
                  href={routes.groupDetail(task.groupId)}
                  className="underline-offset-4 transition hover:text-app-soft hover:underline"
                >
                  {task.groupName}
                </Link>
              </>
            ) : null}
          </p>

          {task.description ? (
            <section className="mt-8">
              <h2 className={textClassNames.titleSecondary}>메모</h2>

              <p className="mt-3 text-sm leading-6 text-app-soft">
                {task.description}
              </p>
            </section>
          ) : null}

          <TaskTodoList
            taskId={task.id}
            taskStatus={task.status}
            todos={task.todos}
            canEdit={canEdit}
          />

          {task.tags.length > 0 ? (
            <section className="mt-8">
              <h2 className={textClassNames.titleSecondary}>태그</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tasks?tag=${encodeURIComponent(tag)}`}
                    className={taskClassNames.tagLink}
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