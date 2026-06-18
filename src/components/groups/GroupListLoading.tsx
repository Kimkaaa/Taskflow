import { panelClassNames } from "@/constants/classNames";

const skeletonBase = "animate-pulse rounded bg-app-base";

export default function GroupListLoading() {
  return (
    <>
      <div className="mb-3 flex items-center justify-between text-app-muted">
        <div className={`${skeletonBase} h-5 w-8`} />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={panelClassNames.surface}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`${skeletonBase} h-7 w-23`} />
                  <div className={`${skeletonBase} h-6 w-9 rounded-full`} />
                </div>

                <div className={`${skeletonBase} mt-3 h-5 w-30`} />
              </div>

              <div className="grid shrink-0 grid-cols-[auto_auto] gap-x-3 gap-y-2">
                <div className={`${skeletonBase} h-5 w-6`} />
                <div className={`${skeletonBase} h-5 w-10`} />
                <div className={`${skeletonBase} h-5 w-6`} />
                <div className={`${skeletonBase} h-5 w-10`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}