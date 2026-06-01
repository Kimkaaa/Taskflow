import GroupForm from "@/components/groups/GroupForm";
import { createGroup } from "@/app/actions/groups";
import BackLink from "@/components/common/BackLink";
import {
  groupPanelClass,
  pageMainClass,
  pageSectionClass,
} from "@/constants/classNames";
import { routes } from "@/constants/routes";

export default function NewGroupPage() {
  return (
    <main className={pageMainClass}>
      <section className={pageSectionClass}>
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.groups} label="그룹 목록으로 돌아가기" />

          <h1 className="text-lg font-bold tracking-tight">
            그룹 생성
          </h1>
        </div>

        <div className={groupPanelClass}>
          <GroupForm action={createGroup} />
        </div>
      </section>
    </main>
  );
}