"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
import { cardClassNames, taskClassNames } from "@/constants/classNames";
import type { Task, TaskQuery } from "@/types/task";

type TaskListProps = {
  initialTasks: Task[];
  initialNextCursor: string | null;
  query: TaskQuery;
};

type TaskPageResponse = {
  tasks: Task[];
  nextCursor: string | null;
};

function createTaskApiUrl(query: TaskQuery, cursor: string) {
  const params = new URLSearchParams();

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.priority) {
    params.set("priority", query.priority);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.tag) {
    params.set("tag", query.tag);
  }

  params.set("cursor", cursor);

  return `/api/tasks?${params.toString()}`;
}

export default function TaskList({
  initialTasks,
  initialNextCursor,
  query,
}: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoadingRef = useRef(false);

  const loadMoreTasks = useCallback(async () => {
    if (!nextCursor || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(createTaskApiUrl(query, nextCursor), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("작업 목록을 추가로 불러오지 못했습니다.");
      }

      const data = (await response.json()) as TaskPageResponse;

      setTasks((prevTasks) => {
        const existingIds = new Set(prevTasks.map((task) => task.id));
        const newTasks = data.tasks.filter((task) => !existingIds.has(task.id));

        return [...prevTasks, ...newTasks];
      });

      setNextCursor(data.nextCursor);
    } catch {
      setErrorMessage("작업 목록을 추가로 불러오지 못했습니다.");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [nextCursor, query]);

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center">
        <p className="font-semibold text-white">조건에 맞는 작업이 없습니다.</p>
        <p className="mt-2 text-sm text-app-muted">
          검색어나 필터 조건을 변경해보세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className={cardClassNames.surfaceLink}
          >
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <TaskPriorityBadge priority={task.priority} />

                  <span className="text-xs font-medium text-app-muted">
                    {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
                  </span>
                </div>

                {task.visibility === "PRIVATE" ? (
                  <span
                    className="mt-1 shrink-0 text-app-muted"
                    aria-label="비공개 작업"
                    title="비공개 작업"
                  >
                    <Lock className="h-3.5 w-3.5 scale-x-90" aria-hidden="true" />
                  </span>
                ) : null}
              </div>

              <h2 className="text-xl font-bold text-white">{task.title}</h2>

              {task.description ? (
                <p className="mt-2 text-sm leading-6 text-app-soft">
                  {task.description}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span key={tag} className={taskClassNames.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        {nextCursor ? (
          <button
            type="button"
            onClick={loadMoreTasks}
            disabled={isLoading}
            className="cursor-pointer rounded-full border border-app-base bg-app-surface px-4 py-2 text-sm font-medium text-app-soft transition hover:bg-app-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "불러오는 중..." : "더 보기"}
          </button>
        ) : (
          <p className="text-sm text-app-disabled">모든 작업을 불러왔습니다.</p>
        )}
      </div>

      {errorMessage ? (
        <p className="mt-3 text-center text-sm text-red-300">{errorMessage}</p>
      ) : null}
    </>
  );
}