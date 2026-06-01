import { redirect } from "next/navigation";

import PageLoading from "@/components/common/PageLoading";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth";
import { getSafeNextPath } from "@/lib/safeRedirect";
import LoginRedirect from "./LoginRedirect";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getNextParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next: nextParam } = await searchParams;
  const next = getSafeNextPath(getNextParam(nextParam));
  const user = await getCurrentUser();

  if (user) {
    redirect(next);
  }

  return (
    <>
      <LoginRedirect href={routes.authLogin(next)} />
      <PageLoading message="로그인 화면으로 이동합니다." />
    </>
  );
}