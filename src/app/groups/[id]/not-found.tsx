import NotFoundMessage from "@/components/common/NotFoundMessage";
import { routes } from "@/constants/routes";

export default function GroupNotFound() {
  return (
    <NotFoundMessage
      backHref={routes.groups}
      backLabel="그룹 목록으로 돌아가기"
      title="그룹을 찾을 수 없습니다."
      description="삭제되었거나 권한이 없는 그룹일 수 있습니다."
      actionHref={routes.groups}
      actionLabel="목록으로 이동"
    />
  );
}