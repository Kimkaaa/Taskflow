import { routes } from "@/constants/routes";
import {
  priorityOptions,
  statusOptions,
  taskScopeOptions,
} from "@/constants/taskMeta";
import type {
  TaskPriority,
  TaskQuery,
  TaskScope,
  TaskStatus,
} from "@/types/task";

function getFirstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isOneOf<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return options.includes(value as T);
}

function isTaskStatus(value: string): value is TaskStatus {
  return isOneOf(statusOptions, value);
}

function isTaskPriority(value: string): value is TaskPriority {
  return isOneOf(priorityOptions, value);
}

function isTaskScope(value: string): value is TaskScope {
  return isOneOf(taskScopeOptions, value);
}

export function parseTaskQuery(
  params: Record<string, string | string[] | undefined>,
): TaskQuery {
  const keyword = getFirstParam(params.keyword)?.trim() ?? "";
  const status = getFirstParam(params.status);
  const priority = getFirstParam(params.priority);
  const tag = getFirstParam(params.tag)?.trim() ?? "";
  const scope = getFirstParam(params.scope);

  return {
    keyword: keyword || undefined,
    status: status && isTaskStatus(status) ? status : undefined,
    priority: priority && isTaskPriority(priority) ? priority : undefined,
    tag: tag || undefined,
    scope: scope && isTaskScope(scope) && scope !== "all" ? scope : undefined,
  };
}

export function createTaskQueryParams(query: TaskQuery) {
  const params = new URLSearchParams();

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.priority) {
    params.set("priority", query.priority);
  }

  if (query.tag) {
    params.set("tag", query.tag);
  }

  if (query.scope) {
    params.set("scope", query.scope);
  }

  return params;
}

export function createTaskListHref(query: TaskQuery) {
  const params = createTaskQueryParams(query);
  const queryString = params.toString();

  return queryString ? `${routes.tasks}?${queryString}` : routes.tasks;
}

export function createTaskApiUrl(query: TaskQuery, cursor: string) {
  const params = createTaskQueryParams(query);

  params.set("cursor", cursor);

  return `/api/tasks?${params.toString()}`;
}