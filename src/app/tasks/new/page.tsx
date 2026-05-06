import Link from "next/link";
import { createTask } from "@/app/actions/tasks";
import TaskForm from "@/components/tasks/TaskForm";

export default function NewTaskPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/tasks"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← 작업 목록으로
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-medium text-slate-500">New Task</p>
          <h1 className="mt-2 text-3xl font-bold">작업 등록</h1>
          <p className="mt-3 text-slate-600">
            관리할 작업의 기본 정보와 공개 여부를 입력합니다.
          </p>
        </div>

        <TaskForm mode="create" action={createTask} />
      </section>
    </main>
  );
}