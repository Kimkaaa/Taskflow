import { deleteAccount, updateNickname } from "@/app/actions/account";
import AuthButton from "@/components/auth/AuthButton";
import BackLink from "@/components/common/BackLink";
import DangerActionForm from "@/components/common/DangerActionForm";
import AccountProfileForm from "@/components/account/AccountProfileForm";
import {
  pageClassNames,
  panelClassNames,
  textClassNames,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { requireAppUser } from "@/lib/auth";
import { formatDate } from "@/lib/date";

export default async function MePage() {
  const user = await requireAppUser(routes.me);

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BackLink href={routes.tasks} label="작업 목록으로 돌아가기" />

            <h1 className={pageClassNames.title}>계정</h1>
          </div>

          <AuthButton isLoggedIn />
        </div>

        <div className="grid gap-6">
          <section className={panelClassNames.surface}>
            <h2 className={textClassNames.titleSecondary}>기본 정보</h2>

            <p className="mt-2 text-sm text-app-muted">
              생성일 {formatDate(user.createdAt)}
            </p>

            <AccountProfileForm
              action={updateNickname}
              nickname={user.nickname}
            />
          </section>

          <section className={panelClassNames.danger}>
            <h2 className="text-sm font-semibold text-red-200">계정 탈퇴</h2>

            <p className="mt-2 text-sm leading-6 text-red-200/80">
              계정을 탈퇴하면 작업과 그룹 정보가 삭제됩니다. 내가 만든 그룹의 공유 작업은 개인 작업으로 전환됩니다.
            </p>

            <div className="mt-5">
              <DangerActionForm
                action={deleteAccount}
                label="탈퇴"
                confirmTitle="계정을 탈퇴할까요?"
                confirmDescription="탈퇴 후에는 되돌릴 수 없습니다."
                errorTitle="계정을 탈퇴할 수 없습니다."
                pendingMessage="계정을 탈퇴하는 중입니다."
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}