import Link from "next/link";
import GroupForm from "@/components/groups/GroupForm";
import { createGroup } from "@/app/actions/groups";
import BackLink from "@/components/common/BackLink";
import {
  buttonClassNames,
  pageClassNames,
  panelClassNames,
} from "@/constants/classNames";
import { USER_GROUP_LIMIT } from "@/constants/group";
import { routes } from "@/constants/routes";
import { requireUser } from "@/lib/auth";
import { getUserGroupCount } from "@/lib/groups";

export default async function NewGroupPage() {
  const user = await requireUser(routes.groupsNew);
  const userGroupCount = await getUserGroupCount(user.id);
  const isGroupLimitReached = userGroupCount >= USER_GROUP_LIMIT;

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />

          <h1 className={pageClassNames.title}>그룹 생성</h1>
        </div>

        {isGroupLimitReached ? (
          <div className={panelClassNames.dashedSurface}>
            <p className="text-lg font-semibold text-white">
              그룹을 더 만들 수 없습니다.
            </p>

            <p className="mt-2 mb-6 text-sm leading-6 text-app-muted">
              참여 가능한 그룹은 최대 {USER_GROUP_LIMIT}개입니다.
            </p>

            <Link
              href={routes.groups}
              className={buttonClassNames.fixedPrimaryWide}
            >
              목록으로 이동
            </Link>
          </div>
        ) : (
          <div className={panelClassNames.surface}>
            <GroupForm action={createGroup} />
          </div>
        )}
      </section>
    </main>
  );
}