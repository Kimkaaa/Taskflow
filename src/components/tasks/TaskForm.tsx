import type { Task } from "@/types/task";
import { priorityLabels, statusLabels } from "@/lib/tasks";

type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task;
};

export default function TaskForm({ mode, task }: TaskFormProps) {
  const isEditMode = mode === "edit";

  return (
    <form className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-slate-700"
        >
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={task?.title ?? ""}
          placeholder="작업 제목을 입력하세요"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700"
        >
          설명
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={task?.description ?? ""}
          placeholder="작업 내용을 입력하세요"
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-slate-700"
          >
            상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={task?.status ?? "TODO"}
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
            htmlFor="priority"
            className="block text-sm font-semibold text-slate-700"
          >
            우선순위
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={task?.priority ?? "MEDIUM"}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-semibold text-slate-700"
        >
          마감일
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={task?.dueDate ?? ""}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-semibold text-slate-700"
        >
          태그
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={task?.tags.join(", ") ?? ""}
          placeholder="예: 포트폴리오, Next.js, 블로그"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
        <p className="mt-2 text-xs text-slate-500">
          여러 태그는 쉼표로 구분해서 입력합니다.
        </p>
      </div>

      <div>
        <label
          htmlFor="memo"
          className="block text-sm font-semibold text-slate-700"
        >
          메모
        </label>
        <textarea
          id="memo"
          name="memo"
          defaultValue={task?.memo ?? ""}
          placeholder="추가 메모를 입력하세요"
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-900"
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
        <input
          name="isPublic"
          type="checkbox"
          defaultChecked={task?.isPublic ?? true}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-700">
            공개 작업으로 설정
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            체크하면 비로그인 사용자도 이 작업을 조회할 수 있습니다.
          </span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          취소
        </button>

        <button
          type="button"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {isEditMode ? "작업 수정" : "작업 등록"}
        </button>
      </div>
    </form>
  );
}