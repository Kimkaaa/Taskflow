const DEFAULT_NEXT_PATH = "/tasks";

export function getSafeNextPath(value: string | null) {
  const next = value?.trim();

  if (!next) {
    return DEFAULT_NEXT_PATH;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_NEXT_PATH;
  }

  try {
    const url = new URL(next, "http://app.local");

    const isTaskPath =
      url.pathname === "/tasks" || url.pathname.startsWith("/tasks/");

    if (!isTaskPath) {
      return DEFAULT_NEXT_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_NEXT_PATH;
  }
}