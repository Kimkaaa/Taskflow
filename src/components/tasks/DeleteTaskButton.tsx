"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteTask } from "@/app/actions/tasks";
import BlockingOverlay from "@/components/common/BlockingOverlay";
import Dialog from "@/components/common/Dialog";
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
  const [isOpen, setIsOpen] = useState(false);

  const deleteTaskWithId = deleteTask.bind(null, taskId);
  const [state, formAction, isPending] = useActionState(
    deleteTaskWithId,
    initialTaskActionState,
  );

  const errorMessage = state.error;
  const hasDeleteError = Boolean(errorMessage);

  const handleClose = () => {
    if (isPending) {
      return;
    }

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

      <Dialog
        open={isOpen}
        title={hasDeleteError ? "작업을 삭제할 수 없습니다." : "작업을 삭제할까요?"}
        description={
          hasDeleteError ? errorMessage ?? undefined : "삭제한 작업은 되돌릴 수 없습니다."
        }
        onClose={handleClose}
        preventClose={isPending}
      >
        {hasDeleteError ? (
          <div className={dialogClassNames.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={dialogClassNames.listButton}
            >
              목록으로 이동
            </button>
          </div>
        ) : (
          <form action={formAction} className={dialogClassNames.actions}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className={dialogClassNames.cancelButton}
            >
              취소
            </button>

            <DeleteSubmitButton />
          </form>
        )}
      </Dialog>

      {isPending ? <BlockingOverlay message="작업을 삭제하는 중입니다." /> : null}
    </>
  );
}