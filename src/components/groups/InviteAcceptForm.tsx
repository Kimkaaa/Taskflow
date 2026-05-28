"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, UserPlus } from "lucide-react";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";

type InviteAcceptFormProps = {
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  isAlreadyMember: boolean;
};

function SubmitButton({ isAlreadyMember }: { isAlreadyMember: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-app-base/80 px-5 text-sm font-semibold text-white transition hover:bg-app-base disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {isAlreadyMember ? "그룹으로 이동" : "그룹 참여"}
        </>
      )}
    </button>
  );
}

export default function InviteAcceptForm({
  action,
  isAlreadyMember,
}: InviteAcceptFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const shouldShowError = Boolean(state.error && !isPending);

  return (
    <form action={formAction} className="space-y-4">
      {shouldShowError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <SubmitButton isAlreadyMember={isAlreadyMember} />
    </form>
  );
}