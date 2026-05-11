import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { backNavigationClass } from "@/constants/taskClassNames";

type BackLinkProps = {
  href: string;
  label: string;
  replace?: boolean;
};

export default function BackLink({ href, label, replace = false }: BackLinkProps) {
  return (
    <Link href={href} replace={replace} aria-label={label} title={label} className={backNavigationClass}>
      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}