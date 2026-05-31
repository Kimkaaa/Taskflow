import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskBoard from "@/components/tasks/TaskBoard";
import { pageSectionClass } from "@/constants/classNames";
import { getCurrentUser } from "@/lib/auth";
import { getTaskPage, parseTaskQuery } from "@/lib/tasks";

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
  const createTaskHref = user ? "/tasks/new" : "/login?next=/tasks/new";

  const { tasks, nextCursor, totalCount } = await getTaskPage(query, {
    includeTotalCount: true,
    viewerId: user?.id,
  });

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className={pageSectionClass}>
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

      <CreateTaskButton href={createTaskHref} />
    </main>
  );
}