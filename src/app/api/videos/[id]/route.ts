import { NextResponse } from "next/server";
import {
  findVideoById,
  updateVideo,
  deleteVideo,
} from "@/lib/repositories/video.repository";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { videoSchema, extractYoutubeId } from "@/lib/validations/video";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await findVideoById(id);
    if (!video) {
      return NextResponse.json({ data: null, error: "Không tìm thấy video" }, { status: 404 });
    }
    return NextResponse.json({ data: video, error: null });
  } catch (err) {
    console.error("[GET /api/videos/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = videoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 422 });
    }

    const existing = await findVideoById(id);
    if (!existing) {
      return NextResponse.json({ data: null, error: "Không tìm thấy video" }, { status: 404 });
    }

    const youtubeId = extractYoutubeId(parsed.data.youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json({ data: null, error: "Link YouTube không hợp lệ" }, { status: 422 });
    }

    const video = await updateVideo(id, {
      title: parsed.data.title,
      youtubeUrl: parsed.data.youtubeUrl,
      youtubeId,
      description: parsed.data.description ?? null,
      isActive: parsed.data.isActive,
    });

    return NextResponse.json({ data: video, error: null });
  } catch (err) {
    console.error("[PUT /api/videos/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await findVideoById(id);
    if (!existing) {
      return NextResponse.json({ data: null, error: "Không tìm thấy video" }, { status: 404 });
    }

    const video = await deleteVideo(id);
    return NextResponse.json({ data: video, error: null });
  } catch (err) {
    console.error("[DELETE /api/videos/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
