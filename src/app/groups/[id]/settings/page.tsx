import { notFound } from "next/navigation";
import GroupDangerForm from "@/components/groups/GroupDangerForm";
import GroupForm from "@/components/groups/GroupForm";
import GroupInviteSection from "@/components/groups/GroupInviteSection";
import {
  deleteGroup,
  deleteGroupInvite,
  generateGroupInvite,
  leaveGroup,
  updateGroupInfo,
} from "@/app/actions/groups";
import { requireAppUser } from "@/lib/auth";
import { getGroupSettingsDetail } from "@/lib/groups";
import BackLink from "@/components/common/BackLink";
import { routes } from "@/constants/routes";

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

  const updateGroupInfoWithId = updateGroupInfo.bind(null, group.id);
  const deleteGroupWithId = deleteGroup.bind(null, group.id);
  const leaveGroupWithId = leaveGroup.bind(null, group.id);
  const generateGroupInviteWithId = generateGroupInvite.bind(null, group.id);
  const deleteGroupInviteWithId = deleteGroupInvite.bind(null, group.id);

  const dangerTitle = group.isOwner ? "그룹 삭제" : "그룹 나가기";

  const dangerDescription = group.isOwner
    ? "그룹을 삭제하면 멤버 정보와 초대 링크가 삭제되고, 공유된 작업은 개인 작업으로 전환됩니다."
    : "그룹을 나가면 그룹 작업을 더 이상 볼 수 없고, 내가 공유한 작업은 개인 작업으로 전환됩니다.";

  const dangerAction = group.isOwner ? deleteGroupWithId : leaveGroupWithId;
  const dangerLabel = group.isOwner ? "삭제" : "나가기";

  const dangerConfirmTitle = group.isOwner
    ? "그룹을 삭제할까요?"
    : "그룹을 나갈까요?";

  const dangerConfirmDescription = group.isOwner
    ? "그룹 작업은 개인 작업으로 전환됩니다."
    : "내가 공유한 그룹 작업은 개인 작업으로 전환됩니다.";

  const dangerErrorTitle = group.isOwner
    ? "그룹을 삭제할 수 없습니다."
    : "그룹을 나갈 수 없습니다.";

  return (
    <main className="min-h-screen bg-app-bg px-6 py-8 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <BackLink href={routes.groupDetail(group.id)} label="그룹 상세로 돌아가기" />

          <h1 className="text-lg font-bold tracking-tight">
            그룹 관리
          </h1>
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
                  action={updateGroupInfoWithId}
                  defaultName={group.name}
                  defaultDescription={group.description}
                  submitLabel="저장"
                />
              </div>
            ) : (
              <p className="mt-5 text-sm text-app-soft">
                그룹 정보는 리더만 수정할 수 있습니다.
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
            <h2 className="text-sm font-semibold text-red-200">{dangerTitle}</h2>

            <p className="mt-2 text-sm leading-6 text-red-200/80">
              {dangerDescription}
            </p>

            <div className="mt-5">
              <GroupDangerForm
                action={dangerAction}
                label={dangerLabel}
                confirmTitle={dangerConfirmTitle}
                confirmDescription={dangerConfirmDescription}
                errorTitle={dangerErrorTitle}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
