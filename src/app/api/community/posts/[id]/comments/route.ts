import { NextResponse } from "next/server";
import { commentSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { findPostComments, createComment } from "@/lib/repositories/community.repository";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const comments = await findPostComments(id);
    return NextResponse.json({ data: comments, error: null });
  } catch (err: any) {
    console.error("[GET /api/community/posts/[id]/comments]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể lấy bình luận"}` }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Vui lòng đăng nhập để bình luận" }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json().catch((err) => {
      console.error("[POST /api/community/posts/[id]/comments] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = commentSchema.safeParse({ ...body, postId });
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/community/posts/[id]/comments] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu bình luận không hợp lệ: ${errorMsg}` }, { status: 400 });
    }

    const comment = await createComment({
      postId,
      authorId: user.id,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });

    return NextResponse.json({ data: comment, error: null }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/community/posts/[id]/comments]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể gửi bình luận"}` }, { status: 500 });
  }
}
