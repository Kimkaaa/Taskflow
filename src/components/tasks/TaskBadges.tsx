import {
  priorityBadgeStyles,
  priorityLabels,
  statusBadgeStyles,
  statusLabels,
} from "@/constants/taskMeta";
import type { TaskPriority, TaskStatus } from "@/types/task";

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

const badgeBaseClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span className={`${badgeBaseClass} ${statusBadgeStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <span className={`${badgeBaseClass} ${priorityBadgeStyles[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
}