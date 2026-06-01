import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { getSafeNextPath } from "@/lib/safeRedirect";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL(routes.tasks, request.url));
  }

  return NextResponse.redirect(data.url);
}