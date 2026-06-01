"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
} from "@/constants/group";
import {
  buttonClassNames,
  feedbackClassNames,
  formClassNames,
} from "@/constants/classNames";

type GroupFormProps = {
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  defaultName?: string;
  defaultDescription?: string;
  submitLabel?: string;
  disableWhenUnchanged?: boolean;
};

function SubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
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
        label
      )}
    </button>
  );
}

export default function GroupForm({
  action,
  defaultName = "",
  defaultDescription = "",
  submitLabel = "생성",
  disableWhenUnchanged = false,
}: GroupFormProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);

  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const shouldShowError = Boolean(state.error && !isPending);

  const isUnchanged =
    name.trim() === defaultName.trim() &&
    description.trim() === defaultDescription.trim();

  const isSubmitDisabled = disableWhenUnchanged && isUnchanged;

  return (
    <form action={formAction} className="space-y-4">
      <input
        name="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="그룹명"
        className={formClassNames.input}
        maxLength={GROUP_NAME_MAX_LENGTH}
        required
      />

      <input
        name="description"
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="그룹 설명"
        className={formClassNames.input}
        maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
      />

      {shouldShowError ? (
        <p className={feedbackClassNames.errorBox}>
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={submitLabel} disabled={isSubmitDisabled} />
      </div>
    </form>
  );
}