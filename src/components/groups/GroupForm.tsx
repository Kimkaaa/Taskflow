"use client";

import { useActionState } from "react";
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

type GroupFormProps = {
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  defaultName?: string;
  defaultDescription?: string;
  submitLabel?: string;
};

const inputClass =
  "w-full rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-white outline-none transition placeholder:text-app-muted focus:border-app-focus";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-20 cursor-pointer items-center justify-center rounded-xl bg-app-base/80 text-sm font-semibold text-white disabled:cursor-wait"
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
}: GroupFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const shouldShowError = Boolean(state.error && !isPending);

  return (
    <form action={formAction} className="space-y-4">
      <input
        name="name"
        type="text"
        defaultValue={defaultName}
        placeholder="그룹명"
        className={inputClass}
        maxLength={GROUP_NAME_MAX_LENGTH}
        required
      />

      <input
        name="description"
        type="text"
        defaultValue={defaultDescription}
        placeholder="그룹 설명"
        className={inputClass}
        maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
      />

      {shouldShowError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}