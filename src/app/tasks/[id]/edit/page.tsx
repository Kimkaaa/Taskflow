import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { updateTask } from "@/app/actions/tasks";
import TaskForm from "@/components/tasks/TaskForm";
import { getTaskById } from "@/lib/tasks";
import { createClient } from "@/lib/supabase/server";

type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/tasks/${id}/edit`);
  }

  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  if (task.userId !== user.id) {
    notFound();
  }

  const updateTaskWithId = updateTask.bind(null, task.id);

  return (
    <main className="min-h-screen bg-[#191919] px-6 py-8 text-white">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={`/tasks/${task.id}`}
            aria-label="작업 상세로 돌아가기"
            title="작업 상세로 돌아가기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#d1d5db]"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6 shadow-sm">
          <TaskForm
            task={task}
            action={updateTaskWithId}
            submitLabel="수정"
          />
        </div>
      </section>
    </main>
  );
}