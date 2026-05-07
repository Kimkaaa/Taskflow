import { NextRequest, NextResponse } from "next/server";
import { getPublicTaskPage, parseTaskQuery } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query = parseTaskQuery({
    keyword: searchParams.get("keyword") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
  });

  const cursor = searchParams.get("cursor") ?? undefined;

  const taskPage = await getPublicTaskPage(query, {
    cursor,
  });

  return NextResponse.json(taskPage);
}
