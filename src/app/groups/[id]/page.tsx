import Link from "next/link";
import { notFound } from "next/navigation";
import { Settings } from "lucide-react";

import BackLink from "@/components/common/BackLink";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
import {
  pageClassNames,
  buttonClassNames,
  panelClassNames,
  groupClassNames,
  cardClassNames,
  textClassNames,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { requireAppUser } from "@/lib/auth";
import { getGroupDetail } from "@/lib/groups";
import { GROUP_MEMBER_LIMIT } from "@/constants/group";

type GroupDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { id } = await params;
  const user = await requireAppUser(routes.groupDetail(id));
  const group = await getGroupDetail(id, user.id);

  if (!group) {
    notFound();
  }

  const isMemberScrollable = group.members.length > 3;
  const isTaskScrollable = group.tasks.length > 3;

  const memberListClass = `mt-4 space-y-3 ${isMemberScrollable ? "max-h-[222px] inner-scroll" : ""}`;
  const taskListClass = `mt-4 grid gap-3 ${isTaskScrollable ? "max-h-[378px] inner-scroll" : ""}`;

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />

          {group.isOwner ? (
            <Link
              href={routes.groupSettings(group.id)}
              className={buttonClassNames.fixedSecondary}
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              관리
            </Link>
          ) : null}
        </div>

        <header className={panelClassNames.surface}>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={textClassNames.titlePrimary}>
              {group.name}
            </h1>

            {group.isOwner ? (
              <span className={groupClassNames.titleOwnerBadge}>리더</span>
            ) : (
              <span className={groupClassNames.titleMemberBadge}>멤버</span>
            )}
          </div>

          {group.description ? (
            <p className="mt-3 text-sm leading-6 text-app-soft">
              {group.description}
            </p>
          ) : null}

          <p className="mt-3 text-sm text-app-muted">
            생성일 {group.createdAt}
          </p>
        </header>

        <div className="mt-6 grid gap-6">
          <section className={panelClassNames.compactSurface}>
            <div className="flex items-center gap-3">
              <h2 className={textClassNames.titleSecondary}>멤버</h2>
              <span className={textClassNames.meta}>
                {group.members.length}/{GROUP_MEMBER_LIMIT}
              </span>
            </div>

            <div className={memberListClass}>
              {group.members.map((member) => (
                <div key={member.id} className={cardClassNames.inset}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {member.nickname}
                    </p>

                    {member.isOwner ? (
                      <span className={groupClassNames.roleOwnerBadge}>리더</span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-app-muted">
                    참여일 {member.joinedAt}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className={panelClassNames.compactSurface}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className={textClassNames.titleSecondary}>그룹 작업</h2>
                <span className={textClassNames.meta}>
                  {group.tasks.length}개
                </span>
              </div>

              <Link
                href={`/tasks/new?groupId=${group.id}`}
                className={buttonClassNames.smallPill}
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
              <div className={taskListClass}>
                {group.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className={cardClassNames.insetLink}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <TaskStatusBadge status={task.status} />
                      <TaskPriorityBadge priority={task.priority} />

                      <span className={textClassNames.meta}>
                        {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-white">
                      {task.title}
                    </h3>

                    <p className={`mt-2 ${textClassNames.meta}`}>
                      {task.authorNickname}
                    </p>
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