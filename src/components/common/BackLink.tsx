import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { backNavigationClass } from "@/constants/taskClassNames";

type BackLinkProps = {
  href: string;
  label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} aria-label={label} title={label} className={backNavigationClass}>
      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}