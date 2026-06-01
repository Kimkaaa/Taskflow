"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { buttonClassNames } from "@/constants/classNames";

type LoginLinkButtonProps = {
  href: string;
};

export default function LoginLinkButton({ href }: LoginLinkButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const label = isPending ? "로그인 중" : "로그인";

  return (
    <Link
      href={href}
      onClick={() => setIsPending(true)}
      className={buttonClassNames.fixedPrimary}
      aria-label={label}
      aria-busy={isPending}
      title={label}
    >
      {isPending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        "로그인"
      )}
    </Link>
  );
}