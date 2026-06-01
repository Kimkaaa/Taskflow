"use client";

import { X } from "lucide-react";
import { dialogClassNames } from "@/constants/classNames";

type TaskFormGroupOption = {
  id: string;
  name: string;
};

type TaskGroupSelectDialogProps = {
  open: boolean;
  groups: TaskFormGroupOption[];
  selectedGroupId: string;
  onSelect: (groupId: string) => void;
  onClose: () => void;
};

export default function TaskGroupSelectDialog({
  open,
  groups,
  selectedGroupId,
  onSelect,
  onClose,
}: TaskGroupSelectDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={dialogClassNames.overlay} role="presentation" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-group-select-title"
        className={dialogClassNames.panel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="task-group-select-title"
              className="text-lg font-semibold text-white"
            >
              그룹 선택
            </h2>

            <p className="mt-2 text-sm leading-6 text-app-muted">
              작업을 공유할 그룹을 선택해 주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={dialogClassNames.closeButton}
            aria-label="닫기"
            title="닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-2">
          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelect(group.id)}
                className={
                  isSelected
                    ? "rounded-xl border border-app-strong bg-app-base px-4 py-3 text-left text-sm font-semibold text-white"
                    : "rounded-xl border border-app-base bg-app-bg px-4 py-3 text-left text-sm font-medium text-app-soft"
                }
              >
                {group.name}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}