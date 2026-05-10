"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, LoaderCircle, Square } from "lucide-react";
import { completeTask, updateTaskTodoDone } from "@/app/actions/tasks";
import type { TaskStatus, TaskTodo } from "@/types/task";

type TaskTodoListProps = {
  taskId: string;
  taskStatus: TaskStatus;
  todos: TaskTodo[];
  canEdit: boolean;
};

const dialogActionButtonBaseClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-80";

const cancelDialogButtonClass = `${dialogActionButtonBaseClass} w-14 text-app-soft`;

const confirmDialogButtonClass = `${dialogActionButtonBaseClass} w-14 bg-app-base/80 text-white`;

const listDialogButtonClass = `${dialogActionButtonBaseClass} text-app-soft`;

export default function TaskTodoList({
  taskId,
  taskStatus,
  todos,
  canEdit,
}: TaskTodoListProps) {
  const router = useRouter();

  const [items, setItems] = useState(todos);

  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTodoPending, startTodoTransition] = useTransition();

  const [isTaskCompleted, setIsTaskCompleted] = useState(taskStatus === "DONE");
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completeErrorMessage, setCompleteErrorMessage] = useState<string | null>(null);
  const [isCompletePending, startCompleteTransition] = useTransition();

  const completedTodoCount = items.filter((todo) => todo.isDone).length;
  const hasCompleteError = Boolean(completeErrorMessage);

  const handleCloseCompleteDialog = () => {
    if (isCompletePending) {
      return;
    }

    if (hasCompleteError) {
      router.replace("/tasks");
      return;
    }

    setIsCompleteDialogOpen(false);
    setCompleteErrorMessage(null);
  };

  const handleCompleteTask = () => {
    setCompleteErrorMessage(null);

    startCompleteTransition(async () => {
      try {
        await completeTask(taskId);

        setIsTaskCompleted(true);
        setIsCompleteDialogOpen(false);
        router.refresh();
      } catch {
        setCompleteErrorMessage("삭제되었거나 권한이 없는 작업일 수 있습니다.");
      }
    });
  };

  const handleToggle = (todoId: string, nextIsDone: boolean) => {
    if (!canEdit) {
      return;
    }

    const previousItems = items;
    const nextItems = items.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            isDone: nextIsDone,
          }
        : todo,
    );

    const wasAllDone =
      previousItems.length > 0 && previousItems.every((todo) => todo.isDone);
    const willAllDone =
      nextItems.length > 0 && nextItems.every((todo) => todo.isDone);

    const shouldOpenCompleteDialog =
      canEdit && !isTaskCompleted && !wasAllDone && willAllDone;

    setItems(nextItems);
    setPendingTodoId(todoId);
    setErrorMessage(null);

    startTodoTransition(async () => {
      try {
        await updateTaskTodoDone(taskId, todoId, nextIsDone);

        if (shouldOpenCompleteDialog) {
          setCompleteErrorMessage(null);
          setIsCompleteDialogOpen(true);
        }
      } catch {
        setItems(previousItems);
        setErrorMessage("체크 상태를 변경하지 못했습니다.");
      } finally {
        setPendingTodoId(null);
      }
    });
  };

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white">체크리스트</h2>

        <span className="text-xs font-medium text-app-muted">
          {completedTodoCount}/{items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((todo) => {
            const isUpdating = isTodoPending && pendingTodoId === todo.id;

            return (
              <li
                key={todo.id}
                className="flex items-start gap-3 rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-app-soft"
              >
                {canEdit ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(todo.id, !todo.isDone)}
                    disabled={isTodoPending || isCompletePending}
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
                        className="h-4 w-4 text-app-muted"
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
                        className="h-4 w-4 text-app-muted"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                )}

                <span
                  className={todo.isDone ? "text-app-muted line-through" : ""}
                >
                  {todo.content}
                </span>

                {isUpdating ? (
                  <span className="ml-auto shrink-0 text-xs text-app-disabled">
                    저장 중
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-app-base bg-app-bg px-4 py-5 text-sm text-app-muted">
          등록된 체크리스트가 없습니다.
        </p>
      )}

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
      ) : null}

      {isCompleteDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          role="presentation"
          onClick={handleCloseCompleteDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-task-title"
            className="w-full max-w-sm rounded-2xl border border-app-base bg-app-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5">
              <h2
                id="complete-task-title"
                className="text-lg font-semibold text-white"
              >
                {hasCompleteError
                  ? "작업 상태를 변경하지 못했습니다."
                  : "모든 체크리스트를 완료했어요."}
              </h2>

              <p
                className="mt-2 text-sm leading-6 text-app-muted"
                role={hasCompleteError ? "alert" : undefined}
              >
                {hasCompleteError
                  ? completeErrorMessage
                  : "작업을 완료로 변경할까요?"}
              </p>
            </div>

            {hasCompleteError ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseCompleteDialog}
                  className={listDialogButtonClass}
                >
                  목록으로 이동
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseCompleteDialog}
                  disabled={isCompletePending}
                  className={cancelDialogButtonClass}
                >
                  취소
                </button>

                <button
                  type="button"
                  onClick={handleCompleteTask}
                  disabled={isCompletePending}
                  className={confirmDialogButtonClass}
                  aria-label={isCompletePending ? "완료 처리 중" : "확인"}
                  title={isCompletePending ? "완료 처리 중" : "확인"}
                >
                  {isCompletePending ? (
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    "확인"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}