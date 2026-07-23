"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import TaskListLoading from "@/components/tasks/TaskListLoading";
import TaskListSkeleton from "@/components/tasks/TaskListSkeleton";

type TaskListLoadingContextValue = {
  hasFilterNavigationStarted: boolean;
  markFilterNavigationStarted: () => void;
};

const TaskListLoadingContext =
  createContext<TaskListLoadingContextValue | null>(null);

function useTaskListLoadingContext() {
  const context = useContext(TaskListLoadingContext);

  if (!context) {
    throw new Error(
      "TaskListLoadingState must be used within TaskListLoadingProvider.",
    );
  }

  return context;
}

export function TaskListLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasFilterNavigationStarted, setHasFilterNavigationStarted] =
    useState(false);

  return (
    <TaskListLoadingContext.Provider
      value={{
        hasFilterNavigationStarted,
        markFilterNavigationStarted: () => {
          setHasFilterNavigationStarted(true);
        },
      }}
    >
      {children}
    </TaskListLoadingContext.Provider>
  );
}

export function useTaskListNavigation() {
  return useTaskListLoadingContext().markFilterNavigationStarted;
}

export function TaskListFallback() {
  const { hasFilterNavigationStarted } = useTaskListLoadingContext();

  return hasFilterNavigationStarted ? (
    <TaskListLoading />
  ) : (
    <TaskListSkeleton />
  );
}