"use client";

import { useEffect } from "react";

type LoginRedirectProps = {
  href: string;
};

export default function LoginRedirect({ href }: LoginRedirectProps) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return null;
}