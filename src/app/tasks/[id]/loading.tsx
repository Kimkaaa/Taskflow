import { LoaderCircle } from "lucide-react";

export default function TaskDetailLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-app-bg px-6 py-8 text-white">
      <div className="flex flex-col items-center gap-3 text-app-muted">
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">작업 정보를 불러오는 중입니다.</p>
      </div>
    </main>
  );
}