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
  unavailableMessage?: string | null;
};

function SubmitButton({
  isAlreadyMember,
  disabled,
}: {
  isAlreadyMember: boolean;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={
        disabled
          ? buttonClassNames.fixedPrimaryInactive
          : buttonClassNames.fixedPrimaryPending
      }
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
  unavailableMessage = null,
}: InviteAcceptFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const isUnavailable = Boolean(unavailableMessage && !isAlreadyMember);
  const shouldShowError = Boolean(state.error && !isPending);

  return (
    <form action={formAction} className="space-y-4">
      {isUnavailable ? (
        <p className={feedbackClassNames.errorBox}>
          {unavailableMessage}
        </p>
      ) : shouldShowError ? (
        <p className={feedbackClassNames.errorBox}>
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        isAlreadyMember={isAlreadyMember}
        disabled={isUnavailable}
      />
    </form>
  );
}