"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Copy, LoaderCircle, Trash2 } from "lucide-react";
import Dialog from "@/components/common/Dialog";
import {
  panelClassNames,
  dialogClassNames,
  cardClassNames,
  textClassNames,
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
  isMemberLimitReached: boolean;
};

type InviteDeleteDialogProps = {
  open: boolean;
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  onClose: () => void;
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

function InviteDeleteDialog({
  open,
  action,
  onClose,
}: InviteDeleteDialogProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const errorMessage = !isPending ? state.error : undefined;

  const handleClose = () => {
    if (isPending) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      title={
        errorMessage
          ? "초대 링크를 삭제할 수 없습니다."
          : "초대 링크를 삭제할까요?"
      }
      description={errorMessage ?? "기존 링크는 더 이상 사용할 수 없습니다."}
      onClose={handleClose}
      preventClose={isPending}
    >
      {errorMessage ? (
        <div className={dialogClassNames.actions}>
          <button
            type="button"
            onClick={handleClose}
            className={dialogClassNames.listButton}
          >
            닫기
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
  );
}

export default function GroupInviteSection({
  activeInvite,
  generateAction,
  deleteAction,
  isMemberLimitReached,
}: GroupInviteSectionProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteDialogKey, setDeleteDialogKey] = useState(0);

  const [generateState, generateFormAction, isGeneratePending] = useActionState(
    generateAction,
    initialGroupActionState,
  );

  const invitePath = activeInvite?.invitePath ?? "";

  const shouldShowGenerateError = Boolean(
    generateState.error && !isGeneratePending,
  );

  const isInviteCreateBlocked = !activeInvite && isMemberLimitReached;
  const isInviteShareBlocked = Boolean(activeInvite) && isMemberLimitReached;

  const handleCopy = async () => {
    if (!invitePath || isMemberLimitReached) {
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

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setDeleteDialogKey((currentKey) => currentKey + 1);
  };

  return (
    <>
      <section className={panelClassNames.surface}>
        <h2 className={textClassNames.titleSecondary}>초대 링크</h2>

        <p className="mt-2 text-sm leading-6 text-app-muted">
          링크를 받은 사용자는 로그인 후 그룹에 참여할 수 있습니다.
        </p>

        {activeInvite ? (
          <div className="mt-5 space-y-3">
            <div className={cardClassNames.inset}>
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
                  disabled={!invitePath || isMemberLimitReached}
                  className={
                    isMemberLimitReached
                      ? "inline-flex h-10 w-20 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-app-base bg-app-bg text-sm font-medium text-app-muted transition"
                      : "inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-app-base bg-app-bg text-sm font-medium text-app-soft transition hover:text-white disabled:cursor-not-allowed"
                  }
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

              {copyMessage ? (
                <p className="mt-2 text-xs text-app-muted">{copyMessage}</p>
              ) : null}
            </div>
          </div>
        ) : isInviteCreateBlocked ? (
          <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            현재 멤버가 가득 차 초대 링크를 생성할 수 없습니다.
          </p>
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

        {shouldShowGenerateError || isInviteShareBlocked ? (
          <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {shouldShowGenerateError
              ? generateState.error
              : "현재 멤버가 가득 차 새 멤버는 참여할 수 없습니다."}
          </p>
        ) : null}
      </section>

      <InviteDeleteDialog
        key={deleteDialogKey}
        open={isDeleteDialogOpen}
        action={deleteAction}
        onClose={handleDeleteDialogClose}
      />
    </>
  );
}