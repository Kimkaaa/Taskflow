import { redirect } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TaskForm from "@/components/tasks/TaskForm";
import { taskPageSectionClass } from "@/constants/taskClassNames";
import { createTask } from "@/app/actions/tasks";
import { getCurrentUser } from "@/lib/auth";

export default async function NewTaskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/tasks/new");
  }

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className={taskPageSectionClass}>
        <div className="mb-6">
          <BackLink href="/tasks" label="작업 목록으로 돌아가기" />
        </div>

        <div className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          <TaskForm action={createTask} submitLabel="등록" />
        </div>
      </section>
    </main>
  );
}