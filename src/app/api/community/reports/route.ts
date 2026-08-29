import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { createReport } from "@/lib/repositories/community.repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const report = await createReport({
      reporterId: user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
    });

    return NextResponse.json({ data: report, error: null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community/reports]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
