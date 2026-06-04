import AuthButton from "@/components/auth/AuthButton";
import BackLink from "@/components/common/BackLink";
import {
    pageClassNames,
    panelClassNames,
    textClassNames,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { requireAppUser } from "@/lib/auth";

export default async function MePage() {
    const user = await requireAppUser(routes.me);

    return (
        <main className={pageClassNames.main}>
            <section className={pageClassNames.section}>
                <div className="mb-6 flex items-center gap-2">
                    <BackLink href={routes.tasks} label="작업 목록으로 돌아가기" />

                    <h1 className={pageClassNames.title}>계정</h1>
                </div>

                <section className={panelClassNames.surface}>
                    <h2 className={textClassNames.titleSecondary}>기본 정보</h2>

                    <p className="mt-2 text-sm text-app-muted">
                        가입일 2026-05-06
                    </p>

                    <div className="mt-5 rounded-xl border border-app-base bg-app-bg px-4 py-3">
                        <p className="text-sm font-medium text-white">
                            {user.nickname}
                        </p>
                    </div>

                    <div className="mt-5">
                        <AuthButton isLoggedIn />
                    </div>
                </section>
            </section>
        </main>
    );
}