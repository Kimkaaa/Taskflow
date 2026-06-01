import GroupForm from "@/components/groups/GroupForm";
import { createGroup } from "@/app/actions/groups";
import BackLink from "@/components/common/BackLink";
import {
  pageClassNames,
  panelClassNames,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";
import { requireAppUser } from "@/lib/auth";

export default async function NewGroupPage() {
  await requireAppUser(routes.groupsNew);

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />

          <h1 className="text-lg font-bold tracking-tight">
            그룹 생성
          </h1>
        </div>

        <div className={panelClassNames.surface}>
          <GroupForm action={createGroup} />
        </div>
      </section>
    </main>
  );
}