"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Task, TaskQuery } from "@/types/task";
import {
  priorityBadgeStyles,
  priorityLabels,
  statusBadgeStyles,
  statusLabels,
} from "@/lib/taskMeta";

type TaskListProps = {
  initialTasks: Task[];
  initialNextCursor: string | null;
  query: TaskQuery;
};

type TaskPageResponse = {
  tasks: Task[];
  nextCursor: string | null;
};

const badgeBaseClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

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
      <div className="rounded-2xl border border-dashed border-[#3a3a3a] bg-[#242424] p-10 text-center">
        <p className="font-semibold text-white">조건에 맞는 작업이 없습니다.</p>
        <p className="mt-2 text-sm text-[#a3a3a3]">
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
            className="block rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2b2b2b] hover:shadow-md"
          >
            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`${badgeBaseClass} ${statusBadgeStyles[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>

                  <span
                    className={`${badgeBaseClass} ${priorityBadgeStyles[task.priority]}`}
                  >
                    {priorityLabels[task.priority]}
                  </span>

                  <span className="text-xs font-medium text-[#a3a3a3]">
                    {task.dueDate ? `마감일 ${task.dueDate}` : "마감일 없음"}
                  </span>
                </div>

                {!task.isPublic ? (
                  <span
                    className="mt-1 shrink-0 text-[#a3a3a3]"
                    aria-label="비공개 작업"
                    title="비공개 작업"
                  >
                    <Lock className="h-[14px] w-[14px] scale-x-90" aria-hidden="true" />
                  </span>
                ) : null}
              </div>

              <h2 className="text-xl font-bold text-white">{task.title}</h2>

              {task.description ? (
                <p className="mt-2 text-sm leading-6 text-[#d1d5db]">
                  {task.description}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-1 text-xs text-[#a3a3a3]"
                >
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
            className="rounded-full cursor-pointer border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "불러오는 중..." : "더 보기"}
          </button>
        ) : (
          <p className="text-sm text-[#737373]">모든 작업을 불러왔습니다.</p>
        )}
      </div>

      {errorMessage ? (
        <p className="mt-3 text-center text-sm text-red-300">{errorMessage}</p>
      ) : null}
    </>
  );
}