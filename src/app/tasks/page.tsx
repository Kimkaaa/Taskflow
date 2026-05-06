import Link from "next/link";

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Tasks</p>
            <h1 className="mt-2 text-3xl font-bold">작업 목록</h1>
            <p className="mt-3 text-slate-600">
              공개된 작업 목록을 확인하고, 로그인한 사용자는 작업을 관리할 수
              있습니다.
            </p>
          </div>

          <Link
            href="/tasks/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            작업 등록
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            아직 DB 연결 전입니다. 다음 단계에서 임시 작업 데이터를 먼저
            표시합니다.
          </p>
        </div>
      </section>
    </main>
  );
}