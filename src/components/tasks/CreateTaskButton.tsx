"use client";

import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { taskClassNames } from "@/constants/classNames";

type CreateTaskButtonProps = {
  href: string;
};

export default function CreateTaskButton({ href }: CreateTaskButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <a
      href={href}
      onClick={() => {
        setIsPending(true);
      }}
      aria-label={isPending ? "작업 등록 페이지로 이동 중" : "작업 등록"}
      title={isPending ? "작업 등록 페이지로 이동 중" : "작업 등록"}
      className={taskClassNames.floatingCreateButton}
    >
      {isPending ? (
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
      ) : (
        <Plus className="h-6 w-6" aria-hidden="true" />
      )}
    </a>
  );
}