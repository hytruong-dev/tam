import { NextResponse } from "next/server";
import { reactionSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { toggleReaction } from "@/lib/repositories/community.repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const result = await toggleReaction(user.id, parsed.data.targetType, parsed.data.targetId);
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    console.error("[POST /api/community/reactions]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
