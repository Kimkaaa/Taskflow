import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTask } from "@/app/actions/tasks";
import TaskForm from "@/components/tasks/TaskForm";
import { getTaskById } from "@/lib/tasks";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task) {
    notFound();
  }

  const updateTaskWithId = updateTask.bind(null, task.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← 작업 상세로
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-medium text-slate-500">Edit Task</p>
          <h1 className="mt-2 text-3xl font-bold">작업 수정</h1>
          <p className="mt-3 text-slate-600">
            작업 정보와 공개 여부를 수정합니다.
          </p>
        </div>

        <TaskForm mode="edit" task={task} action={updateTaskWithId} />
      </section>
    </main>
  );
}