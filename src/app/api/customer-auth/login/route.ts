import { NextResponse } from "next/server";
import { customerLoginSchema } from "@/lib/validations/customer-auth";
import { verifyPassword, createCustomerToken, setCustomerSessionCookie } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { data: null, error: "Email hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { data: null, error: "Tài khoản của bạn đã bị tạm khóa" },
        { status: 403 }
      );
    }

    const token = await createCustomerToken(user.id);
    await setCustomerSessionCookie(token);

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
  } catch (err) {
    console.error("[customer/login]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
