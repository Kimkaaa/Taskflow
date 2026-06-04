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

type DangerActionState = {
  error?: string;
};

type DangerActionFormProps = {
  action: (
    prevState: DangerActionState,
    formData: FormData,
  ) => DangerActionState | Promise<DangerActionState>;
  label: string;
  confirmTitle: string;
  confirmDescription: string;
  errorTitle: string;
  pendingMessage: string;
};

type DangerActionFormInnerProps = DangerActionFormProps & {
  onReset: () => void;
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

function DangerActionFormInner({
  action,
  label,
  confirmTitle,
  confirmDescription,
  errorTitle,
  pendingMessage,
  onReset,
}: DangerActionFormInnerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, {});
  const errorMessage = !isPending ? state.error : undefined;

  const handleClose = () => {
    if (isPending) {
      return;
    }

    setIsOpen(false);
    onReset();
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

export default function DangerActionForm(props: DangerActionFormProps) {
  const [formKey, setFormKey] = useState(0);

  const handleReset = () => {
    setFormKey((currentKey) => currentKey + 1);
  };

  return (
    <DangerActionFormInner
      key={formKey}
      {...props}
      onReset={handleReset}
    />
  );
}