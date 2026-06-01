import Link from "next/link";

import InviteAcceptForm from "@/components/groups/InviteAcceptForm";
import { acceptGroupInvite } from "@/app/actions/groups";
import {
  buttonClassNames,
  pageClassNames,
  panelClassNames,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { getCurrentUser, requireAppUser } from "@/lib/auth";
import { getGroupInviteDetail } from "@/lib/groups";
import BackLink from "@/components/common/BackLink";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const currentUser = await getCurrentUser();
  const user = currentUser ? await requireAppUser(routes.invite(token)) : null;
  const invite = await getGroupInviteDetail(token, user?.id ?? null);

  const acceptGroupInviteWithToken = acceptGroupInvite.bind(null, token);

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.tasks} label="작업 목록으로 돌아가기" />

          <h1 className="text-lg font-bold tracking-tight">그룹 초대</h1>
        </div>

        <section className={panelClassNames.surface}>
          {!invite ? (
            <>
              <h2 className="text-lg font-bold text-white">
                초대 링크를 찾을 수 없습니다.
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                잘못되었거나 삭제된 링크입니다.
              </p>
            </>
          ) : !invite.isAvailable ? (
            <>
              <h2 className="text-lg font-bold text-white">
                만료된 초대 링크입니다.
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                그룹 리더에게 새 링크를 요청해주세요.
              </p>
            </>
          ) : !user ? (
            <>
              <h2 className="text-lg font-bold text-white">
                {invite.group.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                로그인 후 그룹에 참여할 수 있습니다.
              </p>

              <div className="mt-5 rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-app-soft">
                <p>만료일 {invite.expiresAt}</p>
              </div>

              <div className="mt-6">
                <Link
                  href={routes.login(routes.invite(token))}
                  className={buttonClassNames.fixedPrimary}
                >
                  로그인
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">
                {invite.group.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                {invite.isAlreadyMember
                  ? "이미 참여 중인 그룹입니다."
                  : "참여하면 그룹 작업을 확인할 수 있습니다."}
              </p>

              {!invite.isAlreadyMember ? (
                <div className="mt-5 rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-app-soft">
                  <p>만료일 {invite.expiresAt}</p>
                </div>
              ) : null}

              <div className={invite.isAlreadyMember ? "mt-5" : "mt-6"}>
                <InviteAcceptForm
                  action={acceptGroupInviteWithToken}
                  isAlreadyMember={invite.isAlreadyMember}
                />
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}