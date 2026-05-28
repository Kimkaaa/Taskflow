import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GroupDangerForm from "@/components/groups/GroupDangerForm";
import GroupForm from "@/components/groups/GroupForm";
import GroupInviteSection from "@/components/groups/GroupInviteSection";
import {
  deleteGroup,
  deleteGroupInvite,
  generateGroupInvite,
  leaveGroup,
  updateGroupName,
} from "@/app/actions/groups";
import { requireAppUser } from "@/lib/auth";
import { getGroupSettingsDetail } from "@/lib/groups";

type GroupSettingsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupSettingsPage({
  params,
}: GroupSettingsPageProps) {
  const { id } = await params;
  const user = await requireAppUser();
  const group = await getGroupSettingsDetail(id, user.id);

  if (!group) {
    notFound();
  }

  const updateGroupNameWithId = updateGroupName.bind(null, group.id);
  const deleteGroupWithId = deleteGroup.bind(null, group.id);
  const leaveGroupWithId = leaveGroup.bind(null, group.id);
  const generateGroupInviteWithId = generateGroupInvite.bind(null, group.id);
  const deleteGroupInviteWithId = deleteGroupInvite.bind(null, group.id);

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href={`/groups/${group.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-app-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            그룹 상세로 돌아가기
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-app-muted">Group Settings</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              그룹 관리
            </h1>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white">기본 정보</h2>

            <p className="mt-2 text-sm text-app-muted">
              생성일 {group.createdAt} · 멤버 {group.members.length}명
            </p>

            {group.isOwner ? (
              <div className="mt-5">
                <GroupForm
                  action={updateGroupNameWithId}
                  defaultName={group.name}
                  submitLabel="저장"
                />
              </div>
            ) : (
              <p className="mt-5 text-sm text-app-soft">
                그룹명은 리더만 수정할 수 있습니다.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white">멤버</h2>

            <div className="mt-4 grid gap-3">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-app-base bg-app-bg px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {member.nickname}
                    </p>

                    {member.isOwner ? (
                      <span className="rounded-full bg-app-base px-2 py-0.5 text-xs font-medium text-white">
                        리더
                      </span>
                    ) : (
                      <span className="text-xs text-app-muted">멤버</span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-app-muted">
                    참여일 {member.joinedAt}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {group.isOwner ? (
            <GroupInviteSection
              activeInvite={group.activeInvite}
              generateAction={generateGroupInviteWithId}
              deleteAction={deleteGroupInviteWithId}
            />
          ) : null}

          <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-red-200">위험 구역</h2>

            {group.isOwner ? (
              <>
                <p className="mt-2 text-sm leading-6 text-red-200/80">
                  그룹을 삭제하면 그룹 멤버와 초대 링크가 삭제됩니다. 그룹에
                  공유된 작업은 삭제되지 않고 각 작성자의 개인 작업으로
                  전환됩니다.
                </p>

                <div className="mt-5">
                  <GroupDangerForm
                    action={deleteGroupWithId}
                    label="그룹 삭제"
                    confirmMessage="그룹을 삭제할까요? 그룹 작업은 개인 작업으로 전환됩니다."
                  />
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-red-200/80">
                  그룹을 나가면 이 그룹의 작업 목록을 더 이상 볼 수 없습니다.
                  내가 이 그룹에 공유한 작업은 개인 작업으로 전환됩니다.
                </p>

                <div className="mt-5">
                  <GroupDangerForm
                    action={leaveGroupWithId}
                    label="그룹 나가기"
                    confirmMessage="그룹을 나갈까요? 내가 공유한 그룹 작업은 개인 작업으로 전환됩니다."
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
