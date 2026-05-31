import Link from "next/link";
import BackLink from "@/components/common/BackLink";
import {
  pageMainClass,
  pageSectionClass,
} from "@/constants/classNames";

type NotFoundMessageProps = {
  backHref: string;
  backLabel: string;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

export default function NotFoundMessage({
  backHref,
  backLabel,
  title,
  description,
  actionHref,
  actionLabel,
}: NotFoundMessageProps) {
  return (
    <main className={pageMainClass}>
      <section className={pageSectionClass}>
        <div className="mb-6">
          <BackLink href={backHref} label={backLabel} />
        </div>

        <div className="rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-white">{title}</p>

          <p className="mt-2 text-sm leading-6 text-app-muted">
            {description}
          </p>

          <Link
            href={actionHref}
            className="mt-6 inline-flex rounded-xl bg-app-base/80 px-4 py-2 text-sm font-semibold text-white"
          >
            {actionLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}