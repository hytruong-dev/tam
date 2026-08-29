import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/auth/customer-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentCustomer();
  if (!user) {
    return NextResponse.json({ data: null, error: "Chưa đăng nhập" }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
    error: null,
  });
}
