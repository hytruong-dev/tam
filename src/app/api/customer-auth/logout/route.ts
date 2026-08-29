import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/auth/customer-session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearCustomerSessionCookie();
  return NextResponse.json({ data: { success: true }, error: null });
}
