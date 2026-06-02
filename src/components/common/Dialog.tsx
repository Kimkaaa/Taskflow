"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { dialogClassNames } from "@/constants/classNames";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  preventClose?: boolean;
};

export default function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  preventClose = false,
}: DialogProps) {
  const titleId = useId();

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (preventClose) {
      return;
    }

    onClose();
  };

  const handleOverlayClick = () => {
    if (!closeOnOverlayClick || preventClose) {
      return;
    }

    onClose();
  };

  return (
    <div
      className={dialogClassNames.overlay}
      role="presentation"
      onClick={handleOverlayClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={dialogClassNames.panel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {title}
            </h2>

            {description ? (
              <p className="mt-2 text-sm leading-6 text-app-muted">
                {description}
              </p>
            ) : null}
          </div>

          {showCloseButton ? (
            <button
              type="button"
              onClick={handleClose}
              className={dialogClassNames.closeButton}
              aria-label="닫기"
              title="닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {children}
      </section>
    </div>
  );
}