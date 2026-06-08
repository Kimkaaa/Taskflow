import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskBoard from "@/components/tasks/TaskBoard";
import { pageClassNames } from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth";
import { getTaskPage } from "@/lib/tasks";
import { parseTaskQuery } from "@/lib/taskQuery";

type TasksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function createTaskListKey(query: ReturnType<typeof parseTaskQuery>) {
  return [
    query.keyword ?? "",
    query.status ?? "",
    query.priority ?? "",
    query.tag ?? "",
    query.scope ?? "",
  ].join("-");
}

const navLinkClass =
  "text-sm font-medium text-app-soft underline-offset-4 transition hover:text-white hover:underline";

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const query = parseTaskQuery(params);
  const taskListKey = createTaskListKey(query);

  const user = await getCurrentUser();
  const createTaskHref = user ? routes.tasksNew : routes.login(routes.tasksNew);

  const { tasks, nextCursor, totalCount } = await getTaskPage(query, {
    includeTotalCount: true,
    viewerId: user?.id,
  });

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={routes.tasks}
            className="text-3xl font-bold tracking-tight text-white"
          >
            TaskFlow
          </Link>

          {user ? (
            <nav aria-label="주요 메뉴" className="flex items-center gap-4">
              <Link href={routes.groups} className={navLinkClass}>
                그룹
              </Link>

              <Link href={routes.me} className={navLinkClass}>
                계정
              </Link>
            </nav>
          ) : (
            <AuthButton isLoggedIn={false} />
          )}
        </div>

        <TaskBoard
          key={taskListKey}
          query={query}
          tasks={tasks}
          nextCursor={nextCursor}
          totalCount={totalCount}
          isLoggedIn={Boolean(user)}
        />
      </section>

      <CreateTaskButton href={createTaskHref} />
    </main>
  );
}