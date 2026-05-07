import Link from "next/link";
import { Plus } from "lucide-react";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import TaskList from "@/components/tasks/TaskList";
import { getPublicTaskPage, parseTaskQuery } from "@/lib/tasks";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

          {user ? (
            <form action="/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] hover:text-white"
              >
                로그아웃
              </button>
            </form>
          ) : (
            <a
              href="/login"
              className="rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] hover:text-white"
            >
              로그인
            </a>
          )}
        </div>

        <TaskFilterForm query={query} />

        <div className="mb-4 text-sm text-[#a3a3a3]">
          총{" "}
          <span className="font-semibold text-white">
            {totalCount ?? tasks.length}
          </span>
          개의 작업
        </div>

        <TaskList
          key={createTaskListKey(query)}
          initialTasks={tasks}
          initialNextCursor={nextCursor}
          query={query}
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
