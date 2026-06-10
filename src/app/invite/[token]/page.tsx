import Link from "next/link";
import type { ReactNode } from "react";
import { Users } from "lucide-react";

import LoginLinkButton from "@/components/common/LoginLinkButton";
import InviteAcceptForm from "@/components/groups/InviteAcceptForm";
import { acceptGroupInvite } from "@/app/actions/groups";
import {
  buttonClassNames,
  pageClassNames,
  panelClassNames,
  textClassNames,
} from "@/constants/classNames";
import {
  GROUP_MEMBER_LIMIT,
  USER_GROUP_LIMIT,
} from "@/constants/group";
import { routes } from "@/constants/routes";
import { getCurrentUser, requireAppUser } from "@/lib/auth";
import {
  getGroupInviteDetail,
  type GroupInviteUnavailableReason,
} from "@/lib/groups";
import BackLink from "@/components/common/BackLink";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

type InviteMessagePanelProps = {
  title: string;
  message: string;
};

type InviteGroupPanelProps = {
  title: string;
  message: string;
  expiresAt?: string;
  children?: ReactNode;
};

function getUnavailableMessage(reason: GroupInviteUnavailableReason | null) {
  if (reason === "USER_GROUP_LIMIT_REACHED") {
    return `참여 가능한 그룹은 최대 ${USER_GROUP_LIMIT}개입니다.`;
  }

  if (reason === "GROUP_MEMBER_LIMIT_REACHED") {
    return `그룹 멤버는 최대 ${GROUP_MEMBER_LIMIT}명까지 참여할 수 있습니다.`;
  }

  return null;
}

function InviteMessagePanel({
  title,
  message,
}: InviteMessagePanelProps) {
  return (
    <section className={panelClassNames.messageSurface}>
      <h2 className={textClassNames.titlePrimary}>{title}</h2>

      <p className="mt-3 text-sm leading-6 text-app-muted">
        {message}
      </p>

      <div className="mt-6">
        <Link
          href={routes.tasks}
          className={buttonClassNames.fixedPrimaryWide}
        >
          목록으로 이동
        </Link>
      </div>
    </section>
  );
}

function InviteGroupPanel({
  title,
  message,
  expiresAt,
  children,
}: InviteGroupPanelProps) {
  return (
    <section className={panelClassNames.surface}>
      <h2 className={textClassNames.titlePrimary}>{title}</h2>

      <p className="mt-3 text-sm leading-6 text-app-muted">
        {message}
      </p>

      {expiresAt ? (
        <div className="mt-5 rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-app-soft">
          <p>만료일 {expiresAt}</p>
        </div>
      ) : null}

      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const currentUser = await getCurrentUser();
  const user = currentUser ? await requireAppUser(routes.invite(token)) : null;
  const invite = await getGroupInviteDetail(token, user?.id ?? null);

  const acceptGroupInviteWithToken = acceptGroupInvite.bind(null, token);
  const unavailableMessage = getUnavailableMessage(
    invite?.unavailableReason ?? null,
  );

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.tasks} label="작업 목록으로 돌아가기" />

          <h1 className={pageClassNames.title}>그룹 초대</h1>
        </div>

        {!invite ? (
          <InviteMessagePanel
            title="초대 링크를 찾을 수 없습니다."
            message="잘못되었거나 삭제된 링크입니다."
          />
        ) : !invite.isAvailable ? (
          <InviteMessagePanel
            title="만료된 초대 링크입니다."
            message="그룹 리더에게 새 링크를 요청해주세요."
          />
        ) : !user ? (
          <InviteGroupPanel
            title={invite.group.name}
            message="로그인 후 그룹에 참여할 수 있습니다."
            expiresAt={invite.expiresAt}
          >
            <LoginLinkButton href={routes.login(routes.invite(token))} />
          </InviteGroupPanel>
        ) : invite.isAlreadyMember ? (
          <InviteGroupPanel
            title={invite.group.name}
            message="이미 참여 중인 그룹입니다."
          >
            <Link
              href={routes.groupDetail(invite.group.id)}
              className={buttonClassNames.fixedPrimary}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              이동
            </Link>
          </InviteGroupPanel>
        ) : unavailableMessage ? (
          <InviteMessagePanel
            title="그룹에 참여할 수 없습니다."
            message={unavailableMessage}
          />
        ) : (
          <InviteGroupPanel
            title={invite.group.name}
            message="참여하면 그룹 작업을 확인할 수 있습니다."
            expiresAt={invite.expiresAt}
          >
            <InviteAcceptForm action={acceptGroupInviteWithToken} />
          </InviteGroupPanel>
        )}
      </section>
    </main>
  );
}