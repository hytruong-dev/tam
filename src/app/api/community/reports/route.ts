import { NextResponse } from "next/server";
import { reportSchema } from "@/lib/validations/community";
import { getCurrentCustomer } from "@/lib/auth/customer-session";
import { createReport, findPendingReports } from "@/lib/repositories/community.repository";
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reports = await findPendingReports();
    return NextResponse.json({ success: true, total: reports.length, data: reports });
  } catch (err: any) {
    console.error("[GET /api/community/reports]", err);
    return NextResponse.json({ success: false, data: [], error: err.message || "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentCustomer();
    if (!user) {
      return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[POST /api/community/reports] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/community/reports] Validation error:", errorMsg);
      return NextResponse.json({ data: null, error: `Dữ liệu báo cáo không hợp lệ: ${errorMsg}` }, { status: 400 });
    }

    const report = await createReport({
      reporterId: user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
    });

    return NextResponse.json({ data: report, error: null }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/community/reports]", err);
    return NextResponse.json({ data: null, error: `Lỗi máy chủ: ${err.message || "Không thể gửi báo cáo"}` }, { status: 500 });
  }
}
