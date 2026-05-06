import type { Task } from "@/types/task";
import { statusLabels } from "@/lib/tasks";

type TaskStatusFormProps = {
  task: Task;
};

export default function TaskStatusForm({ task }: TaskStatusFormProps) {
  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">Status</p>
        <h2 className="mt-2 text-xl font-bold">상태 변경</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          로그인한 사용자는 작업 상태를 변경하고, 변경 사유를 이력으로 남길 수
          있습니다.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1.5fr]">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-slate-700"
          >
            변경할 상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={task.status}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="historyMemo"
            className="block text-sm font-semibold text-slate-700"
          >
            변경 메모
          </label>
          <input
            id="historyMemo"
            name="memo"
            type="text"
            placeholder="예: 구현 시작, 검토 완료, 일정 보류"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          상태 변경 준비 중
        </button>
      </div>
    </form>
  );
}