import Link from "next/link";
import BackLink from "@/components/common/BackLink";
import { routes } from "@/constants/routes";

export default function GroupNotFound() {
  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />
        </div>

        <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-white">
            그룹을 찾을 수 없습니다.
          </p>

          <p className="mt-2 text-sm leading-6 text-app-muted">
            삭제되었거나 권한이 없는 그룹일 수 있습니다.
          </p>

          <Link
            href={routes.groups}
            className="mt-6 inline-flex rounded-xl bg-app-base/80 px-4 py-2 text-sm font-semibold text-white"
          >
            목록으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}