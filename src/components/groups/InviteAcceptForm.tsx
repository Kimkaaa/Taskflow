"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, UserPlus } from "lucide-react";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";
import {
  buttonClassNames,
  feedbackClassNames,
} from "@/constants/classNames";
import BlockingOverlay from "@/components/common/BlockingOverlay";

type InviteAcceptFormProps = {
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClassNames.fixedPrimary}
      aria-label={pending ? "참여 중" : "참여"}
      title={pending ? "참여 중" : "참여"}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          참여
        </>
      )}
    </button>
  );
}

export default function InviteAcceptForm({ action }: InviteAcceptFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  return (
    <>
      <form action={formAction}>
        {state.error ? (
          <p className={`${feedbackClassNames.errorBox} mb-4`}>
            {state.error}
          </p>
        ) : null}

        <SubmitButton />
      </form>

      {isPending ? (
        <BlockingOverlay message="그룹에 참여하는 중입니다." />
      ) : null}
    </>
  );
}