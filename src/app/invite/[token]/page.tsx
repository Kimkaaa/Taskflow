import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import InviteAcceptForm from "@/components/groups/InviteAcceptForm";
import { acceptGroupInvite } from "@/app/actions/groups";
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
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const user = await requireAppUser();
  const invite = await getGroupInviteDetail(token, user.id);

  const acceptGroupInviteWithToken = acceptGroupInvite.bind(null, token);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 text-sm font-medium text-app-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            그룹 목록으로 돌아가기
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-app-muted">Group Invite</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              그룹 초대
            </h1>
          </div>
        </div>

        <section className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
          {!invite ? (
            <>
              <h2 className="text-lg font-bold text-white">
                초대 링크를 찾을 수 없습니다.
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                링크가 잘못되었거나 취소 또는 재발급되어 더 이상 사용할 수 없는
                초대 링크입니다.
              </p>
            </>
          ) : !invite.isAvailable ? (
            <>
              <h2 className="text-lg font-bold text-white">
                만료된 초대 링크입니다.
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                초대 링크가 만료되었습니다. 그룹 리더에게 새 초대 링크를
                요청해주세요.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">
                {invite.group.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-app-muted">
                이 그룹에 참여하면 그룹에 공유된 작업을 확인할 수 있습니다.
              </p>

              <div className="mt-5 rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-app-soft">
                <p>현재 멤버 {invite.group.memberCount}명</p>
                <p className="mt-1">초대 만료일 {invite.expiresAt}</p>

                {invite.isAlreadyMember ? (
                  <p className="mt-1 text-app-muted">
                    이미 참여 중인 그룹입니다.
                  </p>
                ) : null}
              </div>

              <div className="mt-6">
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