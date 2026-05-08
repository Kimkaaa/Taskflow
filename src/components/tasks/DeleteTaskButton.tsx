"use client";

import { useState } from "react";
import { LoaderCircle, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteTask } from "@/app/actions/tasks";

type DeleteTaskButtonProps = {
  taskId: string;
};

const deleteTriggerButtonClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-red-300";

const dialogActionButtonBaseClass =
  "inline-flex h-9 w-14 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold";

const cancelDialogButtonClass = `${dialogActionButtonBaseClass} text-[#d1d5db]`;

const deleteDialogButtonClass = `${dialogActionButtonBaseClass} bg-red-500/15 text-red-300 disabled:cursor-wait disabled:opacity-80`;

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={deleteDialogButtonClass}
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
  const [isOpen, setIsOpen] = useState(false);

  const deleteTaskWithId = deleteTask.bind(null, taskId);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={deleteTriggerButtonClass}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        삭제
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            className="w-full max-w-sm rounded-2xl border border-[#3a3a3a] bg-[#242424] p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="delete-task-title"
                  className="text-lg font-semibold text-white"
                >
                  작업을 삭제할까요?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#a3a3a3]">
                  삭제한 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-[#a3a3a3]"
                aria-label="닫기"
                title="닫기"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={cancelDialogButtonClass}
              >
                취소
              </button>

              <form action={deleteTaskWithId}>
                <DeleteSubmitButton />
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}