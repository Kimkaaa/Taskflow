import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
// import { taskTagClass } from "@/constants/taskClassNames";
import { requireAppUser } from "@/lib/auth";
import { getGroupDetail } from "@/lib/groups";

type GroupDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { id } = await params;
  const user = await requireAppUser();
  const group = await getGroupDetail(id, user.id);

  if (!group) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 text-sm font-medium text-app-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            그룹 목록으로 돌아가기
          </Link>

          {group.isOwner ? (
            <Link
              href={`/groups/${group.id}/settings`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-app-base bg-app-surface px-3 text-sm font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              그룹 관리
            </Link>
          ) : null}
        </div>

        <header className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {group.name}
            </h1>

            {group.isOwner ? (
              <span className="rounded-full bg-app-base px-2 py-1 text-xs font-medium text-white">
                리더
              </span>
            ) : (
              <span className="rounded-full border border-app-base px-2 py-1 text-xs font-medium text-app-soft">
                멤버
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-app-muted">
            생성일 {group.createdAt} · 멤버 {group.members.length}명 · 그룹 작업{" "}
            {group.tasks.length}개
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-app-base bg-app-surface p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-white">멤버</h2>

            <div className="mt-4 space-y-3">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-app-base bg-app-bg px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {member.nickname}
                    </p>

                    {member.isOwner ? (
                      <span className="rounded-full bg-app-base px-2 py-0.5 text-xs font-medium text-white">
                        리더
                      </span>
                    ) : (
                      <span className="text-xs text-app-muted">멤버</span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-app-muted">
                    참여일 {member.joinedAt}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-app-base bg-app-surface p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-white">그룹 작업</h2>

              <Link
                href={`/tasks/new?groupId=${group.id}`}
                className="rounded-full border border-app-base bg-app-bg px-3 py-1.5 text-xs font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white"
              >
                작업 추가
              </Link>
            </div>

            {group.tasks.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-app-base bg-app-bg p-10 text-center">
                <p className="font-semibold text-white">
                  아직 그룹 작업이 없습니다.
                </p>
                <p className="mt-2 text-sm text-app-muted">
                  그룹에 공유할 작업을 추가해보세요.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {group.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block rounded-xl border border-app-base bg-app-bg p-4 transition hover:bg-app-surface-hover"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <TaskStatusBadge status={task.status} />
                      <TaskPriorityBadge priority={task.priority} />

                      <span className="text-xs font-medium text-app-muted">
                        {task.dueDate
                          ? `마감일 ${task.dueDate}`
                          : "마감일 없음"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white">
                      {task.title}
                    </h3>

                    {task.description ? (
                      <p className="mt-2 text-sm leading-6 text-app-soft">
                        {task.description}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}