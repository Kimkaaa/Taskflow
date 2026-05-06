import type { TaskHistory } from "@/types/task";

export const taskHistories: TaskHistory[] = [
  {
    id: "1",
    taskId: "1",
    fromStatus: null,
    toStatus: "TODO",
    memo: "포트폴리오 PDF 정리 작업 생성",
    createdAt: "2026-05-01",
  },
  {
    id: "2",
    taskId: "1",
    fromStatus: "TODO",
    toStatus: "IN_PROGRESS",
    memo: "소개 페이지와 프로젝트 설명 정리 시작",
    createdAt: "2026-05-03",
  },
  {
    id: "3",
    taskId: "2",
    fromStatus: null,
    toStatus: "TODO",
    memo: "Next.js 개인 프로젝트 구현 계획 추가",
    createdAt: "2026-05-06",
  },
  {
    id: "4",
    taskId: "3",
    fromStatus: null,
    toStatus: "TODO",
    memo: "블로그 글감 등록",
    createdAt: "2026-05-03",
  },
  {
    id: "5",
    taskId: "3",
    fromStatus: "TODO",
    toStatus: "HOLD",
    memo: "TaskFlow 구현을 먼저 진행하기 위해 보류",
    createdAt: "2026-05-05",
  },
];