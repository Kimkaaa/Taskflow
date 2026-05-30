import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAppUser } from "@/lib/auth";
import { getMyGroups } from "@/lib/groups";
import BackLink from "@/components/common/BackLink";
import { routes } from "@/constants/routes";

export default async function GroupsPage() {
  const user = await requireAppUser();
  const groups = await getMyGroups(user.id);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BackLink href={routes.tasks} label="작업 목록으로 돌아가기" />

            <h1 className="text-lg font-bold tracking-tight">내 그룹</h1>
          </div>

          <Link
            href={routes.groupsNew}
            className="inline-flex h-10 w-20 items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            생성
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center">
            <p className="font-semibold text-white">
              아직 속한 그룹이 없습니다.
            </p>
            <p className="mt-2 text-sm text-app-muted">
              그룹을 만들어 함께 작업을 공유해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="block rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-app-surface-hover hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-white">
                        {group.name}
                      </h2>

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
                      참여일 {group.joinedAt}
                    </p>
                  </div>

                  <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-3 gap-y-2 text-sm text-app-soft">
                    <dt className="text-app-muted">멤버</dt>
                    <dd className="min-w-10 text-right tabular-nums">
                      {group.memberCount}명
                    </dd>

                    <dt className="text-app-muted">작업</dt>
                    <dd className="min-w-10 text-right tabular-nums">
                      {group.taskCount}개
                    </dd>
                  </dl>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
