import { Pencil, RotateCcw } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import { priorityLabels, statusLabels } from "@/lib/tasks";

type TaskFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  task?: Task;
  submitLabel: string;
};

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const priorityOptions: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

const inputClass =
  "w-full rounded-xl border border-[#3a3a3a] bg-[#191919] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#a3a3a3] focus:border-[#6b7280]";

const chipBaseClass =
  "inline-flex h-10 cursor-pointer items-center justify-center rounded-full border px-4 text-sm font-medium transition";

function getDefaultStatus(task?: Task): TaskStatus {
  return task?.status ?? "TODO";
}

function getDefaultPriority(task?: Task): TaskPriority {
  return task?.priority ?? "HIGH";
}

function getDefaultTodos(task?: Task) {
  return task?.todos.map((todo) => todo.content).join("\n") ?? "";
}

export default function TaskForm({
  action,
  task,
  submitLabel,
}: TaskFormProps) {
  const defaultStatus = getDefaultStatus(task);
  const defaultPriority = getDefaultPriority(task);

  return (
    <form action={action} className="space-y-4">
      <input
        name="title"
        type="text"
        defaultValue={task?.title ?? ""}
        placeholder="제목"
        className={inputClass}
        required
      />

      <input
        name="description"
        type="text"
        defaultValue={task?.description ?? ""}
        placeholder="작업 내용을 간단히 정리해주세요."
        className={inputClass}
        required
      />

      <div className="grid items-center gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">상태</legend>

          {statusOptions.map((status) => (
            <label key={status}>
              <input
                type="radio"
                name="status"
                value={status}
                defaultChecked={defaultStatus === status}
                className="peer sr-only"
              />

              <span
                className={`${chipBaseClass} border-[#3a3a3a] bg-[#191919] text-[#d1d5db] peer-checked:border-[#555555] peer-checked:bg-[#3a3a3a] peer-checked:text-white`}
              >
                {statusLabels[status]}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">중요도</legend>

          {priorityOptions.map((priority) => (
            <label key={priority}>
              <input
                type="radio"
                name="priority"
                value={priority}
                defaultChecked={defaultPriority === priority}
                className="peer sr-only"
              />

              <span
                className={`${chipBaseClass} border-[#3a3a3a] bg-[#191919] text-[#d1d5db] peer-checked:border-[#555555] peer-checked:bg-[#3a3a3a] peer-checked:text-white`}
              >
                {priorityLabels[priority]}
              </span>
            </label>
          ))}
        </fieldset>

        <input
          name="dueDate"
          type="date"
          defaultValue={task?.dueDate ?? ""}
          className={inputClass}
          aria-label="마감일"
        />
      </div>

      <input
        name="tags"
        type="text"
        defaultValue={task?.tags.join(", ") ?? ""}
        placeholder="태그는 쉼표로 구분해 입력합니다."
        className={inputClass}
      />

      <textarea
        name="todos"
        defaultValue={getDefaultTodos(task)}
        placeholder="한 줄에 하나씩 입력하면 체크리스트 항목으로 저장됩니다."
        className={`${inputClass} min-h-40 resize-none leading-6`}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-[#d1d5db]">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={task?.isPublic ?? true}
            className="h-4 w-4 accent-[#3a3a3a]"
          />

          공개
        </label>

        <div className="flex items-center gap-2">
          <button
            type="reset"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-[#a3a3a3] transition hover:text-white"
            aria-label="초기화"
            title="초기화"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="submit"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a3a3a]/80 px-4 text-sm font-semibold text-white"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}