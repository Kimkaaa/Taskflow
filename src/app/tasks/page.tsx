import Link from "next/link";
import { Plus } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import TaskBoard from "@/components/tasks/TaskBoard";
import { getCurrentUser } from "@/lib/auth";
import { getPublicTaskPage, parseTaskQuery } from "@/lib/tasks";

type TasksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function createTaskListKey(query: ReturnType<typeof parseTaskQuery>) {
  return [
    query.keyword ?? "",
    query.status ?? "",
    query.priority ?? "",
    query.sort ?? "",
    query.tag ?? "",
  ].join("-");
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const query = parseTaskQuery(params);
  const taskListKey = createTaskListKey(query);

  const user = await getCurrentUser();

  const { tasks, nextCursor, totalCount } = await getPublicTaskPage(query, {
    includeTotalCount: true,
  });

  return (
    <main className="min-h-screen bg-[#191919] px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/tasks"
            className="text-3xl font-bold tracking-tight text-white"
          >
            TaskFlow
          </Link>

          <AuthButton isLoggedIn={Boolean(user)} />
        </div>

        <TaskBoard
          key={taskListKey}
          query={query}
          tasks={tasks}
          nextCursor={nextCursor}
          totalCount={totalCount}
        />
      </section>

      <Link
        href={user ? "/tasks/new" : "/login?next=/tasks/new"}
        aria-label="작업 등록"
        title="작업 등록"
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#3a3a3a]/80 text-white shadow-lg backdrop-blur transition"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </Link>
    </main>
  );
}