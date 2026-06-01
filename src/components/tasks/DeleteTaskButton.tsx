"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteTask } from "@/app/actions/tasks";
import {
  dialogClassNames,
  taskClassNames,
} from "@/constants/classNames";
import { initialTaskActionState } from "@/types/taskAction";

type DeleteTaskButtonProps = {
  taskId: string;
};

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={dialogClassNames.dangerButton}
      aria-label={pending ? "삭제 중" : "삭제"}
      title={pending ? "삭제 중" : "삭제"}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        "삭제"
      )}
    </button>
  );
}

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const router = useRouter();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const deleteTaskWithId = deleteTask.bind(null, taskId);
  const [state, formAction] = useActionState(
    deleteTaskWithId,
    initialTaskActionState,
  );

  const errorMessage = state.error;
  const hasDeleteError = Boolean(errorMessage);

  const handleClose = () => {
    if (hasDeleteError) {
      router.replace("/tasks");
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={taskClassNames.deleteActionButton}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        삭제
      </button>

      {isOpen ? (
        <div
          className={dialogClassNames.overlay}
          role="presentation"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={dialogClassNames.panel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-white">
                  {hasDeleteError
                    ? "작업을 삭제할 수 없습니다."
                    : "작업을 삭제할까요?"}
                </h2>

                <p
                  className="mt-2 text-sm leading-6 text-app-muted"
                  role={hasDeleteError ? "alert" : undefined}
                >
                  {hasDeleteError
                    ? errorMessage
                    : "삭제한 작업은 되돌릴 수 없습니다."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer text-app-muted"
                aria-label={hasDeleteError ? "작업 목록으로 이동" : "닫기"}
                title={hasDeleteError ? "작업 목록으로 이동" : "닫기"}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {hasDeleteError ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className={dialogClassNames.listButton}
                >
                  목록으로 이동
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className={dialogClassNames.cancelButton}
                >
                  취소
                </button>

                <form action={formAction}>
                  <DeleteSubmitButton />
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}