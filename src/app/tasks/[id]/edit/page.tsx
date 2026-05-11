import { notFound, redirect } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TaskForm from "@/components/tasks/TaskForm";
import { taskPageSectionClass } from "@/constants/taskClassNames";
import { updateTask } from "@/app/actions/tasks";
import { getCurrentUser } from "@/lib/auth";
import { getTaskById } from "@/lib/tasks";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/tasks/${id}/edit`);
  }

  const task = await getTaskById(id, user.id);

  if (!task) {
    notFound();
  }

  if (task.userId !== user.id) {
    notFound();
  }

  const updateTaskWithId = updateTask.bind(null, task.id);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className={taskPageSectionClass}>
        <div className="mb-6">
          <BackLink href={`/tasks/${task.id}`} label="작업 상세로 돌아가기" replace />
        </div>

        <div className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          <TaskForm task={task} action={updateTaskWithId} submitLabel="수정" />
        </div>
      </section>
    </main>
  );
}