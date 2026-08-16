import { NextResponse } from "next/server";
import { findVideos, createVideo } from "@/lib/repositories/video.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { videoSchema, extractYoutubeId } from "@/lib/validations/video";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const page = parseInt(searchParams.get("page") ?? "1");

    const result = await findVideos({ activeOnly, limit, page });
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    console.error("[GET /api/videos]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = videoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 422 });
    }

    const youtubeId = extractYoutubeId(parsed.data.youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json({ data: null, error: "Link YouTube không hợp lệ" }, { status: 422 });
    }

    const video = await createVideo({
      title: parsed.data.title,
      youtubeUrl: parsed.data.youtubeUrl,
      youtubeId,
      description: parsed.data.description ?? null,
      isActive: parsed.data.isActive ?? true,
    });

    return NextResponse.json({ data: video, error: null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/videos]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
