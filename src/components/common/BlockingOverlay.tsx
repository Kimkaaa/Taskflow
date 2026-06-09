"use client";

import { LoaderCircle } from "lucide-react";

type BlockingOverlayProps = {
  message: string;
};

export default function BlockingOverlay({ message }: BlockingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-app-bg px-6"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-3 text-app-muted">
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}