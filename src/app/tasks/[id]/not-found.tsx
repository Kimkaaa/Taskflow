import Link from "next/link";
import BackLink from "@/components/common/BackLink";
import { taskPageSectionClass } from "@/constants/taskClassNames";

export default function TaskNotFound() {
  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className={taskPageSectionClass}>
        <div className="mb-6">
          <BackLink href="/tasks" label="작업 목록으로 돌아가기" />
        </div>

        <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-white">
            작업을 찾을 수 없습니다.
          </p>

          <p className="mt-2 text-sm leading-6 text-app-muted">
            삭제되었거나 공개되지 않은 작업일 수 있습니다.
          </p>

          <Link
            href="/tasks"
            className="mt-6 inline-flex rounded-xl bg-app-base/80 px-4 py-2 text-sm font-semibold text-white"
          >
            목록으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}