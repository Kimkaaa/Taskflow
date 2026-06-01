"use client";

import Link from "next/link";
import { CircleAlert, RotateCcw } from "lucide-react";
import { pageClassNames } from "@/constants/classNames";

type TasksErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function TasksError({ error, reset }: TasksErrorProps) {
  console.error(error);

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 h-10" aria-hidden="true" />

        <div className="rounded-2xl border border-app-base bg-app-surface p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-300">
            <CircleAlert className="h-6 w-6" aria-hidden="true" />
          </div>

          <p className="mt-5 text-lg font-semibold text-white">
            작업 정보를 불러오지 못했습니다.
          </p>

          <p className="mt-2 text-sm leading-6 text-app-muted">
            일시적인 오류일 수 있습니다. 다시 시도하거나 목록으로 이동해 주세요.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-app-base/80 px-4 py-2 text-sm font-semibold text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              다시 시도
            </button>

            <Link
              href="/tasks"
              className="inline-flex rounded-xl border border-app-base bg-app-bg px-4 py-2 text-sm font-medium text-app-soft"
            >
              목록으로 이동
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}