import TaskList from "@/components/tasks/TaskList";
import type { TaskQuery, TaskSummary } from "@/types/task";

type TaskBoardProps = {
  query: TaskQuery;
  tasks: TaskSummary[];
  nextCursor: string | null;
  totalCount: number | undefined;
};

export default function TaskBoard({
  query,
  tasks,
  nextCursor,
  totalCount,
}: TaskBoardProps) {
  return (
    <>
      <div className="mb-4 text-sm text-app-muted">
        총{" "}
        <span className="font-semibold text-white">
          {totalCount ?? tasks.length}
        </span>
        개의 작업
      </div>

      <TaskList
        initialTasks={tasks}
        initialNextCursor={nextCursor}
        query={query}
      />
    </>
  );
}