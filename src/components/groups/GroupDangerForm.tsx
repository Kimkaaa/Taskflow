"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  dialogCancelButtonClass,
  dialogDangerButtonClass,
} from "@/constants/taskClassNames";
import {
  initialGroupActionState,
  type GroupActionState,
} from "@/types/groupAction";

type GroupDangerFormProps = {
  action: (
    prevState: GroupActionState,
    formData: FormData,
  ) => GroupActionState | Promise<GroupActionState>;
  label: string;
  confirmTitle: string;
  confirmDescription: string;
  errorTitle: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={dialogDangerButtonClass}
      aria-label={pending ? `${label} 중` : label}
      title={pending ? `${label} 중` : label}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        label
      )}
    </button>
  );
}

export default function GroupDangerForm({
  action,
  label,
  confirmTitle,
  confirmDescription,
  errorTitle,
}: GroupDangerFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const errorMessage = !isPending ? state.error : undefined;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-300"
      >
        {label}
      </button>

      <ConfirmDialog
        open={isOpen}
        title={confirmTitle}
        description={confirmDescription}
        onClose={handleClose}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
        errorActionLabel="닫기"
      >
        <form action={formAction} className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className={dialogCancelButtonClass}
          >
            취소
          </button>

          <SubmitButton label={label} />
        </form>
      </ConfirmDialog>
    </>
  );
}