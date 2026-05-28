"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Copy, LoaderCircle, Trash2 } from "lucide-react";
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

function GenerateButton({ hasInvite }: { hasInvite: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-app-base/80 px-4 text-sm font-semibold text-white transition hover:bg-app-base disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : hasInvite ? (
        "초대 링크 재발급"
      ) : (
        "초대 링크 생성"
      )}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          링크 취소
        </>
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
    <section className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-white">초대 링크</h2>

      <p className="mt-2 text-sm leading-6 text-app-muted">
        링크를 받은 사용자는 로그인 후 이 그룹에 참여할 수 있습니다. 재발급하면
        기존 링크는 사용할 수 없습니다.
      </p>

      {activeInvite ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-app-base bg-app-bg px-4 py-3">
            <p className="break-all text-sm text-app-soft">
              {invitePath}
            </p>

            <p className="mt-2 text-xs text-app-muted">
              만료일 {activeInvite.expiresAt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!invitePath}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-app-base bg-app-bg px-4 text-sm font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              링크 복사
            </button>

            {copyMessage ? (
              <span className="text-xs text-app-muted">{copyMessage}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-app-base bg-app-bg px-4 py-3 text-sm text-app-muted">
          현재 활성화된 초대 링크가 없습니다.
        </p>
      )}

      {shouldShowGenerateError ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {generateState.error}
        </p>
      ) : null}

      {shouldShowDeleteError ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {deleteState.error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <form
          action={generateFormAction}
          onSubmit={(event) => {
            if (
              activeInvite &&
              !window.confirm(
                "초대 링크를 재발급할까요? 기존 링크는 사용할 수 없습니다.",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <GenerateButton hasInvite={Boolean(activeInvite)} />
        </form>

        {activeInvite ? (
          <form
            action={deleteFormAction}
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "초대 링크를 취소할까요? 기존 링크는 사용할 수 없습니다.",
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <DeleteButton />
          </form>
        ) : null}
      </div>
    </section>
  );
}
