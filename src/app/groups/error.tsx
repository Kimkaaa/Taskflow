"use client";

import ErrorMessage from "@/components/common/ErrorMessage";
import { routes } from "@/constants/routes";

type GroupsErrorProps = {
  reset: () => void;
};

export default function GroupsError({ reset }: GroupsErrorProps) {
  return (
    <ErrorMessage
      title="그룹 정보를 불러오지 못했습니다."
      description="일시적인 오류일 수 있습니다. 다시 시도하거나 목록으로 이동해 주세요."
      actionHref={routes.groups}
      actionLabel="목록으로 이동"
      reset={reset}
    />
  );
}