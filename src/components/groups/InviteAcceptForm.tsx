"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, UserPlus } from "lucide-react";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";
import { buttonClassNames, feedbackClassNames } from "@/constants/classNames";

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
      className={buttonClassNames.fixedPrimaryPending}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {isAlreadyMember ? "이동" : "참여"}
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
        <p className={feedbackClassNames.errorBox}>
          {state.error}
        </p>
      ) : null}

      <SubmitButton isAlreadyMember={isAlreadyMember} />
    </form>
  );
}