import { NextResponse } from "next/server";
import { postSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { createPost } from "@/lib/repositories/community.repository";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Vui lòng đăng nhập để đăng bài" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/community/posts] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/community/posts] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu bài viết không hợp lệ: ${errorMsg}` }, { status: 400 });
    }

    const post = await createPost({
      authorId: user.id,
      content: parsed.data.content,
      topic: parsed.data.topic,
      mediaUrls: parsed.data.mediaUrls,
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/community/posts] Unexpected error:", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể xử lý yêu cầu"}` }, { status: 500 });
  }
}
