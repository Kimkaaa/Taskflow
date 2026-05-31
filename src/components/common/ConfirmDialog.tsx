"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { dialogListButtonClass } from "@/constants/taskClassNames";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  closeLabel?: string;
  errorTitle?: string;
  errorMessage?: string;
  errorActionLabel?: string;
  children: React.ReactNode;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  onClose,
  closeLabel = "닫기",
  errorTitle,
  errorMessage,
  errorActionLabel = "닫기",
  children,
}: ConfirmDialogProps) {
  const titleId = useId();
  const hasError = Boolean(errorMessage);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-2xl border border-app-base bg-app-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {hasError ? errorTitle : title}
            </h2>

            <p
              className="mt-2 text-sm leading-6 text-app-muted"
              role={hasError ? "alert" : undefined}
            >
              {hasError ? errorMessage : description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-app-muted"
            aria-label={hasError ? errorActionLabel : closeLabel}
            title={hasError ? errorActionLabel : closeLabel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {hasError ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={dialogListButtonClass}
            >
              {errorActionLabel}
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}