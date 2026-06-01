import { redirect } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import TaskForm from "@/components/tasks/TaskForm";
import { pageClassNames, panelClassNames } from "@/constants/classNames";
import { createTask } from "@/app/actions/tasks";
import { requireAppUser } from "@/lib/auth";
import { getMyGroupOptions } from "@/lib/groups";

type NewTaskPageProps = {
  searchParams: Promise<{
    groupId?: string | string[];
  }>;
};

function getFirstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function NewTaskPage({
  searchParams,
}: NewTaskPageProps) {
  const params = await searchParams;
  const defaultGroupId = getFirstParam(params.groupId) ?? null;
  const user = await requireAppUser();
  const groups = await getMyGroupOptions(user.id);

  if (defaultGroupId) {
    const hasGroup = groups.some((group) => group.id === defaultGroupId);

    if (!hasGroup) {
      redirect("/tasks/new");
    }
  }

  return (
    <main className={pageClassNames.main}>
      <section className={pageClassNames.section}>
        <div className="mb-6">
          <BackLink href="/tasks" label="작업 목록으로 돌아가기" />
        </div>

        <div className={panelClassNames.surface}>
          <TaskForm
            action={createTask}
            submitLabel="등록"
            groups={groups}
            defaultGroupId={defaultGroupId}
          />
        </div>
      </section>
    </main>
  );
}