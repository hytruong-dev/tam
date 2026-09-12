import { NextResponse } from "next/server";
import { reactionSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { toggleReaction } from "@/lib/repositories/community.repository";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/community/reactions] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = reactionSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/community/reactions] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu không hợp lệ: ${errorMsg}` }, { status: 400 });
    }

    const result = await toggleReaction(user.id, parsed.data.targetType, parsed.data.targetId);
    return NextResponse.json({ data: result, error: null });
  } catch (err: any) {
    console.error("[POST /api/community/reactions]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể thực hiện tương tác"}` }, { status: 500 });
  }
}
