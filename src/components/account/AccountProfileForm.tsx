"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import {
  buttonClassNames,
  feedbackClassNames,
  formClassNames,
} from "@/constants/classNames";
import {
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from "@/constants/user";
import {
  initialAccountActionState,
  type AccountActionState,
} from "@/types/accountAction";

type AccountProfileFormProps = {
  action: (
    prevState: AccountActionState,
    formData: FormData,
  ) => AccountActionState | Promise<AccountActionState>;
  nickname: string;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  const buttonClassName = pending
    ? buttonClassNames.fixedPrimaryPending
    : disabled
      ? buttonClassNames.fixedPrimaryInactive
      : buttonClassNames.fixedPrimary;

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={buttonClassName}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        "저장"
      )}
    </button>
  );
}

export default function AccountProfileForm({
  action,
  nickname,
}: AccountProfileFormProps) {
  const [value, setValue] = useState(nickname);
  const [state, formAction, isPending] = useActionState(
    action,
    initialAccountActionState,
  );

  const isUnchanged = value.trim() === nickname.trim();
  const shouldShowError = Boolean(state.error && !isPending);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <input
          name="nickname"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="닉네임"
          aria-label="닉네임"
          className={formClassNames.input}
          minLength={USER_NICKNAME_MIN_LENGTH}
          maxLength={USER_NICKNAME_MAX_LENGTH}
          required
        />

        <SubmitButton disabled={isUnchanged} />
      </div>

      {shouldShowError ? (
        <p className={feedbackClassNames.errorBox}>{state.error}</p>
      ) : null}
    </form>
  );
}