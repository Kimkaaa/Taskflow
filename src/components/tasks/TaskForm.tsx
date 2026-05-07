"use client";

import { useState } from "react";
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
  Pencil,
  Plus,
  RotateCcw,
  Square,
  Trash2,
} from "lucide-react";
import type { Task, TaskPriority, TaskStatus, TaskTodo } from "@/types/task";

type TaskFormProps = {
  action: (formData: FormData) => void | Promise<void>;
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

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const priorityOptions: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

const statusLabels: Record<TaskStatus, string> = {
  TODO: "예정",
  IN_PROGRESS: "진행",
  DONE: "완료",
};

const priorityLabels: Record<TaskPriority, string> = {
  HIGH: "상",
  MEDIUM: "중",
  LOW: "하",
};

const inputClass =
  "w-full rounded-xl border border-[#3a3a3a] bg-[#191919] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#a3a3a3] focus:border-[#6b7280]";

const chipBaseClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition";

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
      className={`flex items-center gap-1 ${
        isDragging ? "relative z-10 opacity-80" : ""
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-4 shrink-0 cursor-grab items-center justify-center text-[#737373] transition hover:text-[#d1d5db] active:cursor-grabbing"
        aria-label="체크리스트 순서 변경"
        title="순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#191919] px-3 py-2">
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
          className="shrink-0 text-[#a3a3a3] transition hover:text-white"
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
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
        />

        <button
          type="button"
          onClick={() => onRemove(todo.id)}
          className="shrink-0 text-[#737373] transition hover:text-red-300"
          aria-label="체크리스트 항목 삭제"
          title="삭제"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function TaskForm({ action, task, submitLabel }: TaskFormProps) {
  const defaultStatus = getDefaultStatus(task);
  const defaultPriority = getDefaultPriority(task);
  const [todos, setTodos] = useState(() => getInitialTodos(task));

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
        placeholder="설명"
        className={inputClass}
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
        placeholder="태그 (쉼표로 구분)"
        className={inputClass}
      />

      <div className="space-y-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddTodo}
            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-[#3a3a3a] bg-[#242424] px-3 text-xs font-medium text-[#d1d5db] transition hover:bg-[#2b2b2b] hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            추가
          </button>
        </div>

        <DndContext
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
            onClick={handleResetTodos}
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
