"use client";

import { useActionState, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import {
  buttonClassNames,
  feedbackClassNames,
  formClassNames,
} from "@/constants/classNames";
import { USER_NICKNAME_MAX_LENGTH } from "@/constants/user";
import { getNicknameValidationMessage } from "@/lib/userForm";
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
  const [savedNickname, setSavedNickname] = useState(nickname);
  const [isServerErrorHidden, setIsServerErrorHidden] = useState(false);

  const handleFormAction = async (
    prevState: AccountActionState,
    formData: FormData,
  ) => {
    const result = await action(prevState, formData);

    if (result.savedNickname) {
      setValue(result.savedNickname);
      setSavedNickname(result.savedNickname);
      setIsServerErrorHidden(false);
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    handleFormAction,
    initialAccountActionState,
  );

  const trimmedValue = value.trim();
  const isUnchanged = trimmedValue === savedNickname.trim();

  const clientError = isUnchanged
    ? null
    : getNicknameValidationMessage(trimmedValue);

  const serverError =
    state.error && !isServerErrorHidden && !isPending ? state.error : null;

  const errorMessage = clientError ?? serverError;
  const isSubmitDisabled = isUnchanged || Boolean(clientError);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setIsServerErrorHidden(false);

    if (isSubmitDisabled) {
      event.preventDefault();
    }
  };

  return (
    <form
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="mt-5 space-y-4"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <input
          name="nickname"
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsServerErrorHidden(true);
          }}
          placeholder="닉네임"
          aria-label="닉네임"
          className={formClassNames.input}
          maxLength={USER_NICKNAME_MAX_LENGTH}
        />

        <SubmitButton disabled={isSubmitDisabled} />
      </div>

      {errorMessage ? (
        <p className={feedbackClassNames.errorBox}>{errorMessage}</p>
      ) : null}
    </form>
  );
}