import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAppUser } from "@/lib/auth";
import { getMyGroups } from "@/lib/groups";

export default async function GroupsPage() {
  const user = await requireAppUser();
  const groups = await getMyGroups(user.id);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-app-muted">Groups</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              내 그룹
            </h1>
          </div>

          <Link
            href="/groups/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-app-base/80 px-4 text-sm font-semibold text-white transition hover:bg-app-base"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            그룹 생성
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center">
            <p className="font-semibold text-white">아직 속한 그룹이 없습니다.</p>
            <p className="mt-2 text-sm text-app-muted">
              그룹을 만들어 함께 작업을 공유해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {groups.map((group) => (
              <article
                key={group.id}
                className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-white">
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

                    <p className="mt-2 text-sm text-app-muted">
                      참여일 {group.joinedAt}
                    </p>
                  </div>

                  <div className="shrink-0 text-right text-sm text-app-soft">
                    <p>멤버 {group.memberCount}명</p>
                    <p className="mt-1">작업 {group.taskCount}개</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}