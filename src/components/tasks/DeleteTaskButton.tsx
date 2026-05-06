"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteTask } from "@/app/actions/tasks";

type DeleteTaskButtonProps = {
  taskId: string;
};

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteTaskWithId = deleteTask.bind(null, taskId);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#242424] px-4 py-2 text-sm font-medium text-red-300"
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
                className="text-[#a3a3a3] cursor-pointer"
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
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-[#d1d5db]"
              >
                취소
              </button>

              <form action={deleteTaskWithId}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}