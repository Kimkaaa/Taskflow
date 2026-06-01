export const routes = {
  login: (nextPath?: string) =>
    nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login",

  tasks: "/tasks",
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