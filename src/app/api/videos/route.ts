import { NextResponse } from "next/server";
import { findVideos, createVideo } from "@/lib/repositories/video.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { videoSchema, extractYoutubeId } from "@/lib/validations/video";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const page = parseInt(searchParams.get("page") ?? "1");

    const result = await findVideos({ activeOnly, limit, page });
    return NextResponse.json({ data: result, error: null });
  } catch (err: any) {
    console.error("[GET /api/videos]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy danh sách video"}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/videos] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = videoSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/videos] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu video không hợp lệ: ${errorMsg}` }, { status: 422 });
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
  } catch (err: any) {
    console.error("[POST /api/videos]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể tạo video"}` }, { status: 500 });
  }
}
