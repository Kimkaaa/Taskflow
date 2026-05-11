import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type BackLinkProps = {
  href: string;
  label: string;
};

const backLinkClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full text-app-soft";

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} aria-label={label} title={label} className={backLinkClass}>
      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}