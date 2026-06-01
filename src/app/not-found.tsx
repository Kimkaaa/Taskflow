import NotFoundMessage from "@/components/common/NotFoundMessage";
import { routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <NotFoundMessage
      backHref={routes.tasks}
      backLabel="작업 목록으로 돌아가기"
      title="페이지를 찾을 수 없습니다."
      description="주소가 잘못되었거나 이동된 페이지일 수 있습니다."
      actionHref={routes.tasks}
      actionLabel="목록으로 이동"
    />
  );
}