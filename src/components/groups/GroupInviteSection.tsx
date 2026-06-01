"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Copy, LoaderCircle, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  dialogCancelButtonClass,
  dialogDangerButtonClass,
  groupPanelClass,
} from "@/constants/classNames";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";

type ActiveGroupInvite = {
  invitePath: string;
  expiresAt: string;
};

type GroupInviteSectionProps = {
  activeInvite: ActiveGroupInvite | null;
  generateAction: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  deleteAction: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
};

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold text-white transition disabled:cursor-wait"
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        "생성"
      )}
    </button>
  );
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={dialogDangerButtonClass}
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

export default function GroupInviteSection({
  activeInvite,
  generateAction,
  deleteAction,
}: GroupInviteSectionProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [generateState, generateFormAction, isGeneratePending] = useActionState(
    generateAction,
    initialGroupActionState,
  );

  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteAction,
    initialGroupActionState,
  );

  const invitePath = activeInvite?.invitePath ?? "";

  const shouldShowGenerateError = Boolean(
    generateState.error && !isGeneratePending,
  );

  const shouldShowDeleteError = Boolean(deleteState.error && !isDeletePending);

  const handleCopy = async () => {
    if (!invitePath) {
      return;
    }

    try {
      const inviteUrl = new URL(invitePath, window.location.origin).toString();

      await navigator.clipboard.writeText(inviteUrl);
      setCopyMessage("초대 링크를 복사했습니다.");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 1500);
    } catch {
      setCopyMessage("초대 링크 복사에 실패했습니다.");
    }
  };

  return (
    <>
      <section className={groupPanelClass}>
        <h2 className="text-sm font-semibold text-white">초대 링크</h2>

        <p className="mt-2 text-sm leading-6 text-app-muted">
          링크를 받은 사용자는 로그인 후 그룹에 참여할 수 있습니다.
        </p>

        {activeInvite ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-app-base bg-app-bg px-4 py-3">
              <p className="break-all text-sm text-app-soft">{invitePath}</p>

              <p className="mt-2 text-xs text-app-muted">
                만료일 {activeInvite.expiresAt}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!invitePath}
                  className="inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-app-base bg-app-bg text-sm font-medium text-app-soft transition hover:text-white disabled:cursor-not-allowed"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  복사
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 text-sm font-semibold text-red-200"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  삭제
                </button>
              </div>

              <p className="mt-2 min-h-4 text-xs text-app-muted">
                {copyMessage}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-5 rounded-xl border border-dashed border-app-base bg-app-bg px-4 py-3 text-sm text-app-muted">
              현재 활성화된 초대 링크가 없습니다.
            </p>

            <form action={generateFormAction} className="mt-5">
              <GenerateButton />
            </form>
          </>
        )}

        {shouldShowGenerateError ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {generateState.error}
          </p>
        ) : null}
      </section>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="초대 링크를 삭제할까요?"
        description="기존 링크는 더 이상 사용할 수 없습니다."
        onClose={() => setIsDeleteDialogOpen(false)}
        errorTitle="초대 링크를 삭제할 수 없습니다."
        errorMessage={shouldShowDeleteError ? deleteState.error : undefined}
        errorActionLabel="닫기"
      >
        <form action={deleteFormAction} className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(false)}
            className={dialogCancelButtonClass}
          >
            취소
          </button>

          <DeleteSubmitButton />
        </form>
      </ConfirmDialog>
    </>
  );
}