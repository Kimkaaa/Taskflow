"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, GripVertical, Square, Trash2 } from "lucide-react";
import { TASK_FORM_LIMITS } from "@/constants/taskFormLimits";

export type EditableTodo = {
  id: string;
  content: string;
  isDone: boolean;
};

type SortableTodoItemProps = {
  todo: EditableTodo;
  onContentChange: (todoId: string, content: string) => void;
  onDoneChange: (todoId: string) => void;
  onRemove: (todoId: string) => void;
};

function isExistingTodoId(id: string) {
  return !id.startsWith("new-");
}

export default function SortableTodoItem({
  todo,
  onContentChange,
  onDoneChange,
  onRemove,
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 ${
        isDragging ? "relative z-10 opacity-80" : ""
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-4 shrink-0 cursor-grab items-center justify-center text-app-disabled transition hover:text-app-soft active:cursor-grabbing"
        aria-label="체크리스트 순서 변경"
        title="순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-app-base bg-app-bg px-3 py-2">
        <input
          type="hidden"
          name="todoId"
          value={isExistingTodoId(todo.id) ? todo.id : ""}
        />

        <input
          type="hidden"
          name="todoIsDone"
          value={todo.isDone ? "true" : "false"}
        />

        <button
          type="button"
          onClick={() => onDoneChange(todo.id)}
          className="shrink-0 text-app-muted transition hover:text-white"
          aria-label={
            todo.isDone
              ? "체크리스트 미완료로 변경"
              : "체크리스트 완료로 변경"
          }
        >
          {todo.isDone ? (
            <CheckSquare
              className="h-4 w-4 text-emerald-300"
              aria-hidden="true"
            />
          ) : (
            <Square className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <input
          name="todoContent"
          type="text"
          value={todo.content}
          onChange={(event) => onContentChange(todo.id, event.target.value)}
          placeholder="체크리스트"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-app-disabled"
          maxLength={TASK_FORM_LIMITS.TODO_MAX_LENGTH}
        />

        <button
          type="button"
          onClick={() => onRemove(todo.id)}
          className="shrink-0 cursor-pointer text-app-disabled transition hover:text-red-300"
          aria-label="체크리스트 항목 삭제"
          title="삭제"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}