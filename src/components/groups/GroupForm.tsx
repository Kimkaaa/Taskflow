"use client";

import { useActionState, useState, type FormEvent } from "react";
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
import {
  getGroupDescriptionValidationMessage,
  getGroupNameValidationMessage,
} from "@/lib/groupForm";

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
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
  const [isServerErrorHidden, setIsServerErrorHidden] = useState(false);

  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const nameClientError =
    isNameTouched || name.length > 0
      ? getGroupNameValidationMessage(name)
      : null;

  const descriptionClientError =
    isDescriptionTouched || description.length > 0
      ? getGroupDescriptionValidationMessage(description)
      : null;

  const clientError = nameClientError ?? descriptionClientError;

  const serverError =
    state.error && !isServerErrorHidden && !isPending ? state.error : null;

  const errorMessage = clientError ?? serverError;

  const isUnchanged =
    name.trim() === defaultName.trim() &&
    description.trim() === defaultDescription.trim();

  const isSubmitDisabled =
    Boolean(clientError) || (disableWhenUnchanged && isUnchanged);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setIsNameTouched(true);
    setIsDescriptionTouched(true);
    setIsServerErrorHidden(false);

    const nextError =
      getGroupNameValidationMessage(name) ??
      getGroupDescriptionValidationMessage(description);

    if (nextError || (disableWhenUnchanged && isUnchanged)) {
      event.preventDefault();
    }
  };

  return (
    <form
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="name"
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setIsNameTouched(true);
          setIsServerErrorHidden(true);
        }}
        placeholder="그룹명"
        className={formClassNames.input}
        maxLength={GROUP_NAME_MAX_LENGTH}
      />

      <input
        name="description"
        type="text"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          setIsDescriptionTouched(true);
          setIsServerErrorHidden(true);
        }}
        placeholder="그룹 설명"
        className={formClassNames.input}
        maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
      />

      {errorMessage ? (
        <p className={feedbackClassNames.errorBox}>{errorMessage}</p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={submitLabel} disabled={isSubmitDisabled} />
      </div>
    </form>
  );
}