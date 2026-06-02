"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import Dialog from "@/components/common/Dialog";
import {
  dialogClassNames,
  buttonClassNames,
} from "@/constants/classNames";
import BlockingOverlay from "@/components/common/BlockingOverlay";
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
  pendingMessage: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={dialogClassNames.dangerButton}
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
  pendingMessage,
}: GroupDangerFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    action,
    initialGroupActionState,
  );

  const errorMessage = !isPending ? state.error : undefined;

  const handleClose = () => {
    if (isPending) {
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassNames.fixedDanger}
      >
        {label}
      </button>

      <Dialog
        open={isOpen}
        title={errorMessage ? errorTitle : confirmTitle}
        description={errorMessage ?? confirmDescription}
        onClose={handleClose}
        preventClose={isPending}
      >
        {errorMessage ? (
          <div className={dialogClassNames.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={dialogClassNames.listButton}
            >
              닫기
            </button>
          </div>
        ) : (
          <form action={formAction} className={dialogClassNames.actions}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className={dialogClassNames.cancelButton}
            >
              취소
            </button>

            <SubmitButton label={label} />
          </form>
        )}
      </Dialog>

      {isPending ? <BlockingOverlay message={pendingMessage} /> : null}
    </>
  );
}