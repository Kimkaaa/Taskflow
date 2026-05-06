import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TaskNotFound() {
  return (
    <main className="min-h-screen bg-[#191919] px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/tasks"
            aria-label="작업 목록으로 돌아가기"
            title="작업 목록으로 돌아가기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#d1d5db]"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-dashed border-[#3a3a3a] bg-[#242424] p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-white">
            작업을 찾을 수 없습니다.
          </p>

          <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">
            삭제되었거나 공개되지 않은 작업일 수 있습니다.
          </p>

          <Link
            href="/tasks"
            className="mt-6 inline-flex rounded-xl bg-[#3a3a3a]/80 px-4 py-2 text-sm font-semibold text-white"
          >
            목록으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}