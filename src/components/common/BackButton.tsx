"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { navigationClassNames } from "@/constants/classNames";

type BackButtonProps = {
  label: string;
};

export default function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      title={label}
      className={navigationClassNames.back}
    >
      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}