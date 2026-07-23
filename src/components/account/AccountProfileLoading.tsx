import { panelClassNames, textClassNames, skeletonBase } from "@/constants/classNames";

export default function AccountProfileLoading() {
    return (
        <section className={panelClassNames.surface}>
            <h2 className={textClassNames.titleSecondary}>기본 정보</h2>

            <div className={`${skeletonBase} mt-2 h-5 w-30`} />

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className={`${skeletonBase} h-11.5 w-full rounded-xl`} />

                <div className={`${skeletonBase} h-10 w-20 rounded-xl`} />
            </div>
        </section>
    );
}