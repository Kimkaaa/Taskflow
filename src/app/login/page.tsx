export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Login</p>
          <h1 className="mt-2 text-3xl font-bold">로그인</h1>

          <p className="mt-4 text-slate-600">
            Supabase Auth 연결 후 로그인 기능을 구현합니다.
          </p>

          <button
            type="button"
            className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            로그인 준비 중
          </button>
        </div>
      </section>
    </main>
  );
}