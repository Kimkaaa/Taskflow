import type { TaskHistory } from "@/types/task";
import { statusLabels } from "@/lib/tasks";

type TaskHistoryListProps = {
  histories: TaskHistory[];
};

export default function TaskHistoryList({ histories }: TaskHistoryListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">History</p>
        <h2 className="mt-2 text-xl font-bold">상태 변경 이력</h2>
      </div>

      {histories.length > 0 ? (
        <ol className="mt-6 space-y-4">
          {histories.map((history) => (
            <li
              key={history.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {history.fromStatus ? (
                    <>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        {statusLabels[history.fromStatus]}
                      </span>
                      <span className="text-slate-400">→</span>
                    </>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                      생성
                    </span>
                  )}

                  <span className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">
                    {statusLabels[history.toStatus]}
                  </span>
                </div>

                <time className="text-sm text-slate-500">
                  {history.createdAt}
                </time>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {history.memo ?? "변경 메모가 없습니다."}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-500">
            아직 상태 변경 이력이 없습니다.
          </p>
        </div>
      )}
    </section>
  );
}