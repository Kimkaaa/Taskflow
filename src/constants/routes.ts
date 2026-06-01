export const routes = {
  login: (nextPath?: string) =>
    nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login",

  authLogin: (nextPath?: string) =>
    nextPath ? `/auth/login?next=${encodeURIComponent(nextPath)}` : "/auth/login",

  tasks: "/tasks",
  tasksNew: "/tasks/new",
  taskDetail: (taskId: string) => `/tasks/${taskId}`,
  taskEdit: (taskId: string) => `/tasks/${taskId}/edit`,

  groups: "/groups",
  groupsNew: "/groups/new",
  groupDetail: (groupId: string) => `/groups/${groupId}`,
  groupSettings: (groupId: string) => `/groups/${groupId}/settings`,
  invite: (token: string) => `/invite/${token}`,
};

export const routePrefixes = {
  tasks: "/tasks/",
  groups: "/groups/",
  invite: "/invite/",
};