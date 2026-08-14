import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";

export const dynamic = "force-dynamic";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // still perform the comparison to avoid timing differences
    timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("[auth] ADMIN_PASSWORD is not set");
      return NextResponse.json(
        { data: null, error: "Lỗi cấu hình máy chủ" },
        { status: 500 }
      );
    }

    const isValid = safeCompare(parsed.data.password, adminPassword);

    if (!isValid) {
      return NextResponse.json(
        { data: null, error: "Mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { data: null, error: "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}
