import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createTask } from "@/app/actions/tasks";
import TaskForm from "@/components/tasks/TaskForm";
import { getCurrentUser } from "@/lib/auth";

export default async function NewTaskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/tasks/new");
  }

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/tasks"
            aria-label="작업 목록으로 돌아가기"
            title="작업 목록으로 돌아가기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-app-soft"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          <TaskForm action={createTask} submitLabel="등록" />
        </div>
      </section>
    </main>
  );
}