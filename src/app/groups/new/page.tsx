import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GroupForm from "@/components/groups/GroupForm";
import { createGroup } from "@/app/actions/groups";

export default function NewGroupPage() {
  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 text-sm font-medium text-app-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            그룹 목록으로 돌아가기
          </Link>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
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