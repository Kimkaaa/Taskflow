"use client";

import { useState, useTransition } from "react";
import { CheckSquare, Square } from "lucide-react";
import { updateTaskTodoDone } from "@/app/actions/tasks";
import type { TaskTodo } from "@/types/task";

type TaskTodoListProps = {
  taskId: string;
  todos: TaskTodo[];
  canEdit: boolean;
};

export default function TaskTodoList({
  taskId,
  todos,
  canEdit,
}: TaskTodoListProps) {
  const [items, setItems] = useState(todos);
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const completedTodoCount = items.filter((todo) => todo.isDone).length;

  const handleToggle = (todoId: string, nextIsDone: boolean) => {
    if (!canEdit) {
      return;
    }

    const previousItems = items;

    setItems((currentItems) =>
      currentItems.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              isDone: nextIsDone,
            }
          : todo,
      ),
    );

    setPendingTodoId(todoId);
    setErrorMessage(null);

    startTransition(() => {
      void updateTaskTodoDone(taskId, todoId, nextIsDone)
        .catch(() => {
          setItems(previousItems);
          setErrorMessage("체크 상태를 변경하지 못했습니다.");
        })
        .finally(() => {
          setPendingTodoId(null);
        });
    });
  };

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white">체크리스트</h2>

        <span className="text-xs font-medium text-[#a3a3a3]">
          {completedTodoCount}/{items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((todo) => {
            const isUpdating = isPending && pendingTodoId === todo.id;

            return (
              <li
                key={todo.id}
                className="flex items-start gap-3 rounded-xl border border-[#3a3a3a] bg-[#191919] px-4 py-3 text-sm text-[#d1d5db]"
              >
                {canEdit ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id, !todo.isDone)}
                    disabled={isPending}
                    aria-label={
                      todo.isDone
                        ? "체크리스트 미완료로 변경"
                        : "체크리스트 완료로 변경"
                    }
                    className="mt-0.5 shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {todo.isDone ? (
                      <CheckSquare
                        className="h-4 w-4 text-emerald-300"
                        aria-hidden="true"
                      />
                    ) : (
                      <Square
                        className="h-4 w-4 text-[#a3a3a3]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ) : (
                  <span className="mt-0.5 shrink-0">
                    {todo.isDone ? (
                      <CheckSquare
                        className="h-4 w-4 text-emerald-300"
                        aria-hidden="true"
                      />
                    ) : (
                      <Square
                        className="h-4 w-4 text-[#a3a3a3]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                )}

                <span
                  className={
                    todo.isDone ? "text-[#a3a3a3] line-through" : ""
                  }
                >
                  {todo.content}
                </span>

                {isUpdating ? (
                  <span className="ml-auto shrink-0 text-xs text-[#737373]">
                    저장 중
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-[#3a3a3a] bg-[#191919] px-4 py-5 text-sm text-[#a3a3a3]">
          등록된 체크리스트가 없습니다.
        </p>
      )}

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
      ) : null}
    </section>
  );
}