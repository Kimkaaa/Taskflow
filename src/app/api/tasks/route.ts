import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTaskPage } from "@/lib/tasks";
import { parseTaskQuery } from "@/lib/taskQuery";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query = parseTaskQuery({
    keyword: searchParams.get("keyword") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    scope: searchParams.get("scope") ?? undefined,
    groupId: searchParams.get("groupId") ?? undefined,
  });

  const cursor = searchParams.get("cursor") ?? undefined;
  const user = await getCurrentUser();

  const taskPage = await getTaskPage(query, {
    cursor,
    viewerId: user?.id,
  });

  return NextResponse.json(taskPage);
}