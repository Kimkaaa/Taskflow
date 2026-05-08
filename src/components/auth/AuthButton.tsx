"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

type AuthButtonProps = {
  isLoggedIn: boolean;
};

const baseButtonClass =
  "inline-flex h-[38px] w-[83px] cursor-pointer items-center justify-center rounded-full border border-[#3a3a3a] bg-[#242424] text-sm font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] hover:text-white disabled:cursor-wait disabled:opacity-80";

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
