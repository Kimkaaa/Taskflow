"use client";

import { useActionState, useState, type FormEvent } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LoaderCircle, Pencil, Plus, RotateCcw } from "lucide-react";

import SortableTodoItem, {
  type EditableTodo,
} from "@/components/tasks/SortableTodoItem";
import BlockingOverlay from "@/components/common/BlockingOverlay";
import Dialog from "@/components/common/Dialog";
import {
  feedbackClassNames,
  formClassNames,
  taskClassNames,
  dialogClassNames,
} from "@/constants/classNames";
import { TASK_FORM_LIMITS } from "@/constants/taskFormLimits";
import {
  priorityLabels,
  priorityOptions,
  statusLabels,
  statusOptions,
} from "@/constants/taskMeta";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskTodo,
  TaskVisibility,
} from "@/types/task";
import {
  initialTaskActionState,
  type TaskActionState,
} from "@/types/taskAction";

type TaskFormGroupOption = {
  id: string;
  name: string;
};

type TaskFormProps = {
  action: (
    prevState: TaskActionState,
    formData: FormData,
  ) => TaskActionState | Promise<TaskActionState>;
  task?: Task;
  submitLabel: string;
  groups?: TaskFormGroupOption[];
  defaultGroupId?: string | null;
};

const visibilityLabels: Record<TaskVisibility, string> = {
  PRIVATE: "개인",
  GROUP: "그룹",
  PUBLIC: "공개",
};

function getVisibilityOptions(hasGroups: boolean): TaskVisibility[] {
  return hasGroups ? ["PRIVATE", "GROUP", "PUBLIC"] : ["PRIVATE", "PUBLIC"];
}

function getDefaultStatus(task?: Task): TaskStatus {
  return task?.status ?? "TODO";
}

function getDefaultPriority(task?: Task): TaskPriority {
  return task?.priority ?? "HIGH";
}

function getDefaultVisibility({
  task,
  defaultGroupId,
}: {
  task?: Task;
  defaultGroupId?: string | null;
}): TaskVisibility {
  if (task) {
    return task.visibility;
  }

  return defaultGroupId ? "GROUP" : "PRIVATE";
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

function getGroupOptionClass(isSelected: boolean) {
  return isSelected
    ? dialogClassNames.optionButtonSelected
    : dialogClassNames.optionButtonDefault;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={taskClassNames.formSubmitButton}
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

export default function TaskForm({
  action,
  task,
  submitLabel,
  groups = [],
  defaultGroupId = null,
}: TaskFormProps) {
  const defaultStatus = getDefaultStatus(task);
  const defaultPriority = getDefaultPriority(task);
  const defaultVisibility = getDefaultVisibility({ task, defaultGroupId });
  const defaultSelectedGroupId = task?.groupId ?? defaultGroupId ?? "";
  const visibilityOptions = getVisibilityOptions(groups.length > 0);

  const [todos, setTodos] = useState(() => getInitialTodos(task));
  const [selectedVisibility, setSelectedVisibility] =
    useState<TaskVisibility>(defaultVisibility);
  const [selectedGroupId, setSelectedGroupId] = useState(defaultSelectedGroupId);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isErrorHidden, setIsErrorHidden] = useState(false);

  const [state, formAction, isPending] = useActionState(
    action,
    initialTaskActionState,
  );

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

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const shouldShowError = Boolean(state.error && !isErrorHidden && !isPending);
  const isTodoAddDisabled = todos.length >= TASK_FORM_LIMITS.TODO_MAX_COUNT;

  const handleVisibilityChange = (visibility: TaskVisibility) => {
    setSelectedVisibility(visibility);

    if (visibility === "GROUP" && !selectedGroupId) {
      setIsGroupDialogOpen(true);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsGroupDialogOpen(false);
  };

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

  const handleResetForm = () => {
    setTodos(getInitialTodos(task));
    setSelectedVisibility(defaultVisibility);
    setSelectedGroupId(defaultSelectedGroupId);
    setIsGroupDialogOpen(false);
    setIsErrorHidden(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setIsErrorHidden(false);

    if (selectedVisibility === "GROUP" && !selectedGroupId) {
      event.preventDefault();
      setIsGroupDialogOpen(true);
    }
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

  return (
    <>
      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          defaultValue={task?.title ?? ""}
          placeholder="제목"
          className={formClassNames.input}
          maxLength={TASK_FORM_LIMITS.TITLE_MAX_LENGTH}
          required
        />

        <input
          name="description"
          type="text"
          defaultValue={task?.description ?? ""}
          placeholder="메모"
          className={formClassNames.input}
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
                  className={`${taskClassNames.formChipBase} border-app-base bg-app-bg text-app-soft peer-checked:border-app-strong peer-checked:bg-app-base peer-checked:text-white`}
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
                  className={`${taskClassNames.formChipBase} border-app-base bg-app-bg text-app-soft peer-checked:border-app-strong peer-checked:bg-app-base peer-checked:text-white`}
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
            className={formClassNames.dateInput}
            aria-label="마감일"
          />
        </div>

        <input
          name="tags"
          type="text"
          defaultValue={task?.tags.join(", ") ?? ""}
          placeholder="태그 (쉼표로 구분)"
          className={formClassNames.input}
        />

        <div className="space-y-3">
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

        {shouldShowError ? (
          <p className={feedbackClassNames.errorBox}>{state.error}</p>
        ) : null}

        <input
          type="hidden"
          name="groupId"
          value={selectedVisibility === "GROUP" ? selectedGroupId : ""}
        />

        <div className="space-y-3">
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">공개 범위</legend>

            {visibilityOptions.map((visibility) => (
              <label key={visibility}>
                <input
                  type="radio"
                  name="visibility"
                  value={visibility}
                  checked={selectedVisibility === visibility}
                  onChange={() => handleVisibilityChange(visibility)}
                  className="peer sr-only"
                />

                <span
                  className={`${taskClassNames.formChipBase} border-app-base bg-app-bg text-app-soft peer-checked:border-app-strong peer-checked:bg-app-base peer-checked:text-white`}
                >
                  {visibilityLabels[visibility]}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              {selectedVisibility === "GROUP" ? (
                <button
                  type="button"
                  onClick={() => setIsGroupDialogOpen(true)}
                  className="inline-flex h-11 max-w-full cursor-pointer items-center px-1 text-left text-sm font-medium text-app-soft underline-offset-4 transition hover:text-white hover:underline"
                  aria-label="공유 그룹 선택"
                  title={selectedGroup?.name ?? "그룹 선택"}
                >
                  <span className="truncate">
                    {selectedGroup?.name ?? "그룹 선택"}
                  </span>
                </button>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="reset"
                onClick={handleResetForm}
                className={taskClassNames.formResetButton}
                aria-label="초기화"
                title="초기화"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>

              <SubmitButton label={submitLabel} />
            </div>
          </div>
        </div>
      </form>

      <Dialog
        open={isGroupDialogOpen}
        title="그룹 선택"
        description="작업을 공유할 그룹을 선택해 주세요."
        onClose={() => setIsGroupDialogOpen(false)}
      >
        <div className="grid gap-2">
          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelectGroup(group.id)}
                className={getGroupOptionClass(isSelected)}
              >
                {group.name}
              </button>
            );
          })}
        </div>
      </Dialog>

      {isPending ? (
        <BlockingOverlay message={`작업을 ${submitLabel}하는 중입니다.`} />
      ) : null}
    </>
  );
}
