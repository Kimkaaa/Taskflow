import GroupForm from "@/components/groups/GroupForm";
import { createGroup } from "@/app/actions/groups";
import BackLink from "@/components/common/BackLink";
import { routes } from "@/constants/routes";

export default function NewGroupPage() {
  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />

          <h1 className="text-lg font-bold tracking-tight">
            그룹 생성
          </h1>
        </div>

        <div className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          <GroupForm action={createGroup} />
        </div>
      </section>
    </main>
  );
}