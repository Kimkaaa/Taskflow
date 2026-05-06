import { LoaderCircle } from "lucide-react";

export default function TasksLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#191919] px-6 py-8 text-white">
      <div className="flex flex-col items-center gap-3 text-[#a3a3a3]">
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">작업을 불러오는 중입니다.</p>
      </div>
    </main>
  );
}