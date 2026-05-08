import { LoaderCircle } from "lucide-react";

export default function TaskListLoading() {
  return (
    <div
      className="flex min-h-[320px] items-center justify-center"
      aria-label="작업 목록을 불러오는 중"
    >
      <LoaderCircle
        className="h-6 w-6 animate-spin text-[#a3a3a3]"
        aria-hidden="true"
      />
    </div>
  );
}