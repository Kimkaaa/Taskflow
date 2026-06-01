"use client";

import Link from "next/link";
import { CircleAlert, RotateCcw } from "lucide-react";
import { buttonClassNames, pageClassNames, panelClassNames } from "@/constants/classNames";

type ErrorMessageProps = {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  reset: () => void;
};

export default function ErrorMessage({
  title,
  description,
  actionHref,
  actionLabel,
  reset,
}: ErrorMessageProps) {
  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 h-10" aria-hidden="true" />

        <div className={panelClassNames.messageSurface}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-300">
            <CircleAlert className="h-6 w-6" aria-hidden="true" />
          </div>

          <p className="mt-5 text-lg font-semibold text-white">{title}</p>

          <p className="mt-2 text-sm leading-6 text-app-muted">
            {description}
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={reset}
              className={buttonClassNames.fixedPrimaryWide}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              다시 시도
            </button>

            <Link
              href={actionHref}
              className={buttonClassNames.fixedSecondaryWide}
            >
              {actionLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}