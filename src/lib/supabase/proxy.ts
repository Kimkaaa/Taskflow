import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routePrefixes, routes } from "@/constants/routes";

function isProtectedTaskPath(pathname: string) {
  return (
    pathname === routes.tasksNew ||
    (pathname.startsWith(routePrefixes.tasks) && pathname.endsWith("/edit"))
  );
}

function isProtectedGroupPath(pathname: string) {
  return pathname === routes.groups || pathname.startsWith(routePrefixes.groups);
}

function isProtectedMePath(pathname: string) {
  return pathname === routes.me;
}

function isProtectedPath(pathname: string) {
  return (
    isProtectedTaskPath(pathname) ||
    isProtectedGroupPath(pathname) ||
    isProtectedMePath(pathname)
  );
}

function getNextPath(request: NextRequest) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(
    new URL(routes.login(getNextPath(request)), request.url),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();

  if (isProtectedPath(request.nextUrl.pathname) && (error || !data?.claims)) {
    return redirectToLogin(request);
  }

  return supabaseResponse;
}