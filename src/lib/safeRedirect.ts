const DEFAULT_NEXT_PATH = "/tasks";

function isAllowedNextPath(pathname: string) {
  return (
    pathname === "/tasks" ||
    pathname.startsWith("/tasks/") ||
    pathname === "/groups" ||
    pathname.startsWith("/groups/") ||
    pathname.startsWith("/invite/")
  );
}

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

    if (!isAllowedNextPath(url.pathname)) {
      return DEFAULT_NEXT_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_NEXT_PATH;
  }
}