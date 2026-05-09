"use client";

import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";

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
      className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-app-base/80 text-white shadow-lg backdrop-blur transition"
    >
      {isPending ? (
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
      ) : (
        <Plus className="h-6 w-6" aria-hidden="true" />
      )}
    </a>
  );
}