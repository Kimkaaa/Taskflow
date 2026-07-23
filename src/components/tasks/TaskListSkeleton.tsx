import { panelClassNames } from "@/constants/classNames";

const skeletonBase = "animate-pulse rounded bg-app-base";

function TaskCardSkeleton() {
  return (
    <div className={panelClassNames.surface}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className={`${skeletonBase} h-6 w-11 rounded-full`} />
        <div className={`${skeletonBase} h-6 w-8.5 rounded-full`} />
        <div className={`${skeletonBase} h-4 w-25.5`} />
      </div>

      <div className={`${skeletonBase} h-7 w-2/3`} />
      <div className={`${skeletonBase} mt-2 h-5 w-20`} />

      <div className="mt-4">
        <div className={`${skeletonBase} h-6.5 w-14 rounded-md`} />
      </div>
    </div>
  );
}

export default function TaskListSkeleton() {
  return (
    <div role="status" aria-label="작업 목록을 불러오는 중">
      <div className={`${skeletonBase} mb-4 h-5 w-20`} />

      <div className="grid gap-4" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}