import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import InviteAcceptForm from "@/components/groups/InviteAcceptForm";
import { acceptGroupInvite } from "@/app/actions/groups";
import { routes } from "@/constants/routes";
import { getCurrentUser, requireAppUser } from "@/lib/auth";
import { getGroupInviteDetail } from "@/lib/groups";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?next=${encodeURIComponent(routes.invite(token))}`);
  }

  const user = await requireAppUser();
  const invite = await getGroupInviteDetail(token, user.id);

  const acceptGroupInviteWithToken = acceptGroupInvite.bind(null, token);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href={routes.groups}
            className="inline-flex items-center gap-2 text-sm font-medium text-app-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            그룹 목록으로 돌아가기
          </Link>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            그룹 초대
          </h1>
        </div>

        <section className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
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