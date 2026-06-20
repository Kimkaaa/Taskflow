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

type ParsedTaskQuery = ReturnType<typeof parseTaskQuery>;
type CurrentUserPromise = ReturnType<typeof getCurrentUser>;
type GroupOptionsPromise = ReturnType<typeof getGroupOptionsForQuery>;

function createTaskListKey(query: ParsedTaskQuery) {
  return [
    query.keyword ?? "",
    query.status ?? "",
    query.priority ?? "",
    query.tag ?? "",
    query.scope ?? "",
    query.groupId ?? "",
  ].join("-");
}

async function getGroupOptionsForQuery(
  userPromise: CurrentUserPromise,
  query: ParsedTaskQuery,
) {
  if (query.scope !== "group") {
    return [];
  }

  const user = await userPromise;

  if (!user) {
    return [];
  }

  return getMyGroupOptions(user.id);
}

function resolveTaskQuery(
  query: ParsedTaskQuery,
  groupOptions: Awaited<GroupOptionsPromise>,
) {
  const viewerGroupIds = groupOptions.map((group) => group.id);

  if (
    query.scope === "group" &&
    query.groupId &&
    !viewerGroupIds.includes(query.groupId)
  ) {
    return {
      ...query,
      groupId: undefined,
    };
  }

  return query;
}

const navLinkClass =
  "text-sm font-medium text-app-soft underline-offset-4 transition hover:text-white hover:underline";

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const parsedQuery = parseTaskQuery(params);
  const taskDataKey = createTaskListKey(parsedQuery);
  const filterKey = `filter-keyword-${parsedQuery.keyword ?? ""}`;
  const tasksDataKey = `tasks-data-${taskDataKey}`;

  const userPromise = getCurrentUser();
  const groupOptionsPromise = getGroupOptionsForQuery(userPromise, parsedQuery);

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
            <TasksNavigation userPromise={userPromise} />
          </Suspense>
        </div>

        <TaskFilterForm key={filterKey} query={parsedQuery}>
          <Suspense fallback={null}>
            <TasksScopeFilterSection
              query={parsedQuery}
              userPromise={userPromise}
              groupOptionsPromise={groupOptionsPromise}
            />
          </Suspense>
        </TaskFilterForm>

        <Suspense key={tasksDataKey} fallback={<TaskListLoading />}>
          <TasksDataSection
            query={parsedQuery}
            userPromise={userPromise}
            groupOptionsPromise={groupOptionsPromise}
          />
        </Suspense>
      </section>
    </main>
  );
}

async function TasksNavigation({
  userPromise,
}: {
  userPromise: CurrentUserPromise;
}) {
  const user = await userPromise;

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
  userPromise,
  groupOptionsPromise,
}: {
  query: ParsedTaskQuery;
  userPromise: CurrentUserPromise;
  groupOptionsPromise: GroupOptionsPromise;
}) {
  const [user, groupOptions] = await Promise.all([
    userPromise,
    groupOptionsPromise,
  ]);

  if (!user) {
    return null;
  }

  const query = resolveTaskQuery(parsedQuery, groupOptions);

  return <TaskScopeFilterControls query={query} groupOptions={groupOptions} />;
}

async function TasksDataSection({
  query: parsedQuery,
  userPromise,
  groupOptionsPromise,
}: {
  query: ParsedTaskQuery;
  userPromise: CurrentUserPromise;
  groupOptionsPromise: GroupOptionsPromise;
}) {
  const [user, groupOptions] = await Promise.all([
    userPromise,
    groupOptionsPromise,
  ]);

  const createTaskHref = user ? routes.tasksNew : routes.login(routes.tasksNew);
  const viewerGroupIds = groupOptions.map((group) => group.id);
  const query = resolveTaskQuery(parsedQuery, groupOptions);

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