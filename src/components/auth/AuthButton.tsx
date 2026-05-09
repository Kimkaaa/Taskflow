"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

type AuthButtonProps = {
  isLoggedIn: boolean;
};

const baseButtonClass =
  "inline-flex h-[38px] w-[83px] cursor-pointer items-center justify-center rounded-full border border-app-base bg-app-surface text-sm font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white disabled:cursor-wait disabled:opacity-80";

export default function AuthButton({ isLoggedIn }: AuthButtonProps) {
  const [isPending, setIsPending] = useState(false);

  if (isLoggedIn) {
    return (
      <form
        action="/logout"
        method="post"
        onSubmit={() => {
          setIsPending(true);
        }}
      >
        <button
          type="submit"
          disabled={isPending}
          className={baseButtonClass}
          aria-label={isPending ? "로그아웃 처리 중" : "로그아웃"}
          title={isPending ? "로그아웃 처리 중" : "로그아웃"}
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            "로그아웃"
          )}
        </button>
      </form>
    );
  }

  return (
    <a
      href="/login"
      onClick={() => {
        setIsPending(true);
      }}
      className={baseButtonClass}
      aria-label={isPending ? "로그인 처리 중" : "로그인"}
      title={isPending ? "로그인 처리 중" : "로그인"}
    >
      {isPending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        "로그인"
      )}
    </a>
  );
}
