import { NextResponse } from "next/server";
import { findCommunityFeed } from "@/lib/repositories/community.repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const topic = searchParams.get("topic") ?? undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;

    const result = await findCommunityFeed({ cursor, topic, limit });
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    console.error("[GET /api/community/feed]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
