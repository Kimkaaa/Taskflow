"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import TaskList from "@/components/tasks/TaskList";
import TaskListLoading from "@/components/tasks/TaskListLoading";
import type { TaskQuery, TaskSummary } from "@/types/task";

type TaskGroupOption = {
  id: string;
  name: string;
};

type TaskBoardProps = {
  query: TaskQuery;
  tasks: TaskSummary[];
  nextCursor: string | null;
  totalCount: number | undefined;
  isLoggedIn: boolean;
  groupOptions: TaskGroupOption[];
};

export default function TaskBoard({
  query,
  tasks,
  nextCursor,
  totalCount,
  isLoggedIn,
  groupOptions,
}: TaskBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticQuery, setOptimisticQuery] = useState<TaskQuery>(query);

  const handleNavigate = (href: string, nextQuery: TaskQuery) => {
    setOptimisticQuery(nextQuery);

    startTransition(() => {
      router.push(href, {
        scroll: false,
      });
    });
  };

  return (
    <>
      <TaskFilterForm
        query={optimisticQuery}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        groupOptions={groupOptions}
      />

      <div className="mb-4 text-sm text-app-muted">
        총{" "}
        <span className="font-semibold text-white">
          {totalCount ?? tasks.length}
        </span>
        개의 작업
      </div>

      {isPending ? (
        <TaskListLoading />
      ) : (
        <TaskList
          initialTasks={tasks}
          initialNextCursor={nextCursor}
          query={query}
        />
      )}
    </>
  );
}