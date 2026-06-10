import Link from "next/link";
import BackLink from "@/components/common/BackLink";
import {
  buttonClassNames,
  pageClassNames,
  panelClassNames,
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
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6">
          <BackLink href={backHref} label={backLabel} />
        </div>

        <div className={panelClassNames.dashedSurface}>
          <p className="text-lg font-semibold text-white">{title}</p>

          <p className="mt-3 mb-6 text-sm leading-6 text-app-muted">
            {description}
          </p>

          <Link
            href={actionHref}
            className={buttonClassNames.fixedPrimaryWide}
          >
            {actionLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}