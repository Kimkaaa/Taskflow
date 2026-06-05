import {
  cardClassNames,
  groupClassNames,
} from "@/constants/classNames";

type GroupMemberListItem = {
  id: string;
  nickname: string;
  isOwner: boolean;
  joinedAt: string;
};

type GroupMemberListProps = {
  members: GroupMemberListItem[];
};

export default function GroupMemberList({ members }: GroupMemberListProps) {
  const isScrollable = members.length > 3;
  const listClassName = `mt-4 space-y-3 ${
    isScrollable ? "max-h-[222px] inner-scroll" : ""
  }`;

  return (
    <div className={listClassName}>
      {members.map((member) => (
        <div key={member.id} className={cardClassNames.inset}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-white">
              {member.nickname}
            </p>

            {member.isOwner ? (
              <span className={groupClassNames.roleOwnerBadge}>리더</span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-app-muted">
            참여일 {member.joinedAt}
          </p>
        </div>
      ))}
    </div>
  );
}