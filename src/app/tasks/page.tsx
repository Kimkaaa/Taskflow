import { Suspense } from "react";
import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import TaskListLoading from "@/components/tasks/TaskListLoading";
import TaskScopeFilterControls from "@/components/tasks/TaskScopeFilterControls";
import { pageClassNames } from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth";
import { getMyGroupOptions } from "@/lib/groups";
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
    query.groupId ?? "",
  ].join("-");
}

const navLinkClass =
  "text-sm font-medium text-app-soft underline-offset-4 transition hover:text-white hover:underline";

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const parsedQuery = parseTaskQuery(params);
  const taskDataKey = createTaskListKey(parsedQuery);
  const filterKey = `filter-keyword-${parsedQuery.keyword ?? ""}`;
  const tasksDataKey = `tasks-data-${taskDataKey}`;

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={routes.tasks}
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            TaskFlow
          </Link>

          <Suspense fallback={null}>
            <TasksNavigation />
          </Suspense>
        </div>

        <TaskFilterForm key={filterKey} query={parsedQuery}>
          <Suspense fallback={null}>
            <TasksScopeFilterSection query={parsedQuery} />
          </Suspense>
        </TaskFilterForm>

        <Suspense key={tasksDataKey} fallback={<TaskListLoading />}>
          <TasksDataSection query={parsedQuery} />
        </Suspense>
      </section>
    </main>
  );
}

async function TasksNavigation() {
  const user = await getCurrentUser();

  if (!user) {
    return <AuthButton isLoggedIn={false} />;
  }

  return (
    <nav aria-label="주요 메뉴" className="flex items-center gap-4">
      <Link href={routes.groups} className={navLinkClass}>
        그룹
      </Link>

      <Link href={routes.me} className={navLinkClass}>
        계정
      </Link>
    </nav>
  );
}

async function TasksScopeFilterSection({
  query: parsedQuery,
}: {
  query: ReturnType<typeof parseTaskQuery>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const groupOptions =
    parsedQuery.scope === "group" ? await getMyGroupOptions(user.id) : [];

  const viewerGroupIds = groupOptions.map((group) => group.id);

  const query =
    parsedQuery.scope === "group" &&
    parsedQuery.groupId &&
    !viewerGroupIds.includes(parsedQuery.groupId)
      ? {
          ...parsedQuery,
          groupId: undefined,
        }
      : parsedQuery;

  return <TaskScopeFilterControls query={query} groupOptions={groupOptions} />;
}

async function TasksDataSection({
  query: parsedQuery,
}: {
  query: ReturnType<typeof parseTaskQuery>;
}) {
  const user = await getCurrentUser();
  const createTaskHref = user ? routes.tasksNew : routes.login(routes.tasksNew);

  const groupOptions =
    user && parsedQuery.scope === "group"
      ? await getMyGroupOptions(user.id)
      : [];

  const viewerGroupIds = groupOptions.map((group) => group.id);

  const query =
    parsedQuery.scope === "group" &&
    parsedQuery.groupId &&
    !viewerGroupIds.includes(parsedQuery.groupId)
      ? {
          ...parsedQuery,
          groupId: undefined,
        }
      : parsedQuery;

  const { tasks, nextCursor, totalCount } = await getTaskPage(query, {
    includeTotalCount: true,
    viewerId: user?.id,
    viewerGroupIds: query.scope === "group" ? viewerGroupIds : undefined,
  });

  return (
    <>
      <TaskBoard
        query={query}
        tasks={tasks}
        nextCursor={nextCursor}
        totalCount={totalCount}
      />

      <CreateTaskButton href={createTaskHref} />
    </>
  );
}