"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckSquare,
  GripVertical,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCcw,
  Square,
  Trash2,
} from "lucide-react";
import { TASK_FORM_LIMITS } from "@/constants/taskFormLimits";
import {
  priorityLabels,
  priorityOptions,
  statusLabels,
  statusOptions,
} from "@/constants/taskMeta";
import type { Task, TaskPriority, TaskStatus, TaskTodo } from "@/types/task";
import {
  initialTaskActionState,
  type TaskActionState,
} from "@/types/taskAction";

type TaskFormProps = {
  action: (
    prevState: TaskActionState,
    formData: FormData,
  ) => TaskActionState | Promise<TaskActionState>;
  task?: Task;
  submitLabel: string;
};

type EditableTodo = {
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

const inputClass =
  "w-full rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-white outline-none transition placeholder:text-app-muted focus:border-app-focus";

const chipBaseClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition";

const submitButtonClass =
  "inline-flex h-11 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-80";

function getDefaultStatus(task?: Task): TaskStatus {
  return task?.status ?? "TODO";
}

function getDefaultPriority(task?: Task): TaskPriority {
  return task?.priority ?? "HIGH";
}

function toEditableTodo(todo: TaskTodo): EditableTodo {
  return {
    id: todo.id,
    content: todo.content,
    isDone: todo.isDone,
  };
}

function createEmptyTodo(): EditableTodo {
  return {
    id: `new-${crypto.randomUUID()}`,
    content: "",
    isDone: false,
  };
}

function getInitialTodos(task?: Task): EditableTodo[] {
  if (!task) {
    return [createEmptyTodo()];
  }

  if (task.todos.length === 0) {
    return [createEmptyTodo()];
  }

  return task.todos.map(toEditableTodo);
}

function isExistingTodoId(id: string) {
  return !id.startsWith("new-");
}

function SortableTodoItem({
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
      className={`flex items-center gap-1 ${isDragging ? "relative z-10 opacity-80" : ""
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
            todo.isDone ? "체크리스트 미완료로 변경" : "체크리스트 완료로 변경"
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={submitButtonClass}
      aria-label={pending ? `${label} 중` : label}
      title={pending ? `${label} 중` : label}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}

export default function TaskForm({ action, task, submitLabel }: TaskFormProps) {
  const defaultStatus = getDefaultStatus(task);
  const defaultPriority = getDefaultPriority(task);
  const [todos, setTodos] = useState(() => getInitialTodos(task));
  const [isErrorHidden, setIsErrorHidden] = useState(false);
  const [state, formAction] = useActionState(action, initialTaskActionState);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleTodoContentChange = (todoId: string, content: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            content,
          }
          : todo,
      ),
    );
  };

  const handleTodoDoneChange = (todoId: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? {
            ...todo,
            isDone: !todo.isDone,
          }
          : todo,
      ),
    );
  };

  const handleAddTodo = () => {
    setTodos((currentTodos) => [...currentTodos, createEmptyTodo()]);
  };

  const handleRemoveTodo = (todoId: string) => {
    setTodos((currentTodos) => {
      const nextTodos = currentTodos.filter((todo) => todo.id !== todoId);

      return nextTodos.length > 0 ? nextTodos : [createEmptyTodo()];
    });
  };

  const handleResetTodos = () => {
    setTodos(getInitialTodos(task));
    setIsErrorHidden(true);
  };

  const handleTodoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setTodos((currentTodos) => {
      const oldIndex = currentTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = currentTodos.findIndex((todo) => todo.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return currentTodos;
      }

      return arrayMove(currentTodos, oldIndex, newIndex);
    });
  };

  const isTodoAddDisabled = todos.length >= TASK_FORM_LIMITS.TODO_MAX_COUNT;

  return (
    <form
      action={formAction}
      onSubmit={() => {
        setIsErrorHidden(false);
      }}
      className="space-y-4"
    >
      <input
        name="title"
        type="text"
        defaultValue={task?.title ?? ""}
        placeholder="제목"
        className={inputClass}
        maxLength={TASK_FORM_LIMITS.TITLE_MAX_LENGTH}
        required
      />

      <input
        name="description"
        type="text"
        defaultValue={task?.description ?? ""}
        placeholder="메모"
        className={inputClass}
        maxLength={TASK_FORM_LIMITS.DESCRIPTION_MAX_LENGTH}
      />

      <div className="grid items-center gap-3 min-[600px]:grid-cols-[max-content_max-content_180px] min-[600px]:justify-between">
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
                className={`${chipBaseClass} border-app-base bg-app-bg text-app-soft peer-checked:border-app-strong peer-checked:bg-app-base peer-checked:text-white`}
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
                className={`${chipBaseClass} border-app-base bg-app-bg text-app-soft peer-checked:border-app-strong peer-checked:bg-app-base peer-checked:text-white`}
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
        placeholder="태그 (쉼표로 구분)"
        className={inputClass}
      />

      <div className="space-y-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddTodo}
            disabled={isTodoAddDisabled}
            className="inline-flex h-9 cursor-pointer shrink-0 items-center gap-1 rounded-full border border-app-base bg-app-surface px-3 text-xs font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-app-surface disabled:hover:text-app-soft"
            aria-label={
              isTodoAddDisabled
                ? `체크리스트는 최대 ${TASK_FORM_LIMITS.TODO_MAX_COUNT}개까지 추가할 수 있습니다.`
                : "체크리스트 추가"
            }
            title={
              isTodoAddDisabled
                ? `체크리스트는 최대 ${TASK_FORM_LIMITS.TODO_MAX_COUNT}개까지 추가할 수 있습니다.`
                : "체크리스트 추가"
            }
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            추가
          </button>
        </div>

        <DndContext
          id="task-todo-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleTodoDragEnd}
        >
          <SortableContext
            items={todos.map((todo) => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onContentChange={handleTodoContentChange}
                  onDoneChange={handleTodoDoneChange}
                  onRemove={handleRemoveTodo}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {state.error && !isErrorHidden ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-app-soft">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={task?.isPublic ?? true}
            className="h-4 w-4 cursor-pointer accent-app-base"
          />
          공개
        </label>

        <div className="flex items-center gap-2">
          <button
            type="reset"
            onClick={handleResetTodos}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-app-muted transition hover:text-white"
            aria-label="초기화"
            title="초기화"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>

          <SubmitButton label={submitLabel} />
        </div>
      </div>
    </form>
  );
}