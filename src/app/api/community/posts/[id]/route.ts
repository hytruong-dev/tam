import { NextResponse } from "next/server";
import { findPostById, deletePost } from "@/lib/repositories/community.repository";
import { getCurrentCustomer } from "@/lib/auth/customer-session";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const post = await findPostById(id);
    if (!post) {
      return NextResponse.json({ data: null, error: "Bài viết không tồn tại" }, { status: 404 });
    }
    return NextResponse.json({ data: post, error: null });
  } catch (err) {
    console.error("[GET /api/community/posts/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const isAdminOrMod = user.role === "ADMIN" || user.role === "MODERATOR";
    const success = await deletePost(id, user.id, isAdminOrMod);

    if (!success) {
      return NextResponse.json({ data: null, error: "Không có quyền xóa bài viết này" }, { status: 403 });
    }

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (err) {
    console.error("[DELETE /api/community/posts/[id]]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
