import { NextResponse } from "next/server";
import { postSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { createPost } from "@/lib/repositories/community.repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Vui lòng đăng nhập để đăng bài" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 400 });
    }

    const post = await createPost({
      authorId: user.id,
      content: parsed.data.content,
      topic: parsed.data.topic,
      mediaUrls: parsed.data.mediaUrls,
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/posts]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
