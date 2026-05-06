import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          Next.js 개인 작업 관리 서비스
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          TaskFlow
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          개인 프로젝트, 포트폴리오 개선, 기술 블로그 작성 등 여러 작업을
          한곳에서 관리하기 위한 작업 관리 서비스입니다.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tasks"
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            작업 목록 보기
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            로그인
          </Link>
        </div>
      </section>
    </main>
  );
}