import { panelClassNames, textClassNames } from "@/constants/classNames";

const skeletonBase = "animate-pulse rounded bg-app-base";

function ActivityStatLoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-app-base bg-app-bg px-4 py-3 text-left">
      <div className="flex items-center justify-between sm:gap-2">
        <p className={textClassNames.meta}>{label}</p>
      </div>

      <div className={`${skeletonBase} mt-2 h-8 w-8`} />
    </div>
  );
}

export default function AccountActivityLoading() {
  return (
    <section className={panelClassNames.surface}>
      <h2 className={textClassNames.titleSecondary}>내 활동</h2>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <ActivityStatLoadingCard label="이번 주" />
        <ActivityStatLoadingCard label="전체 완료" />
        <ActivityStatLoadingCard label="뱃지" />
      </div>
    </section>
  );
}