import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/customer-auth";
import { hashPassword, createCustomerToken, setCustomerSessionCookie } from "@/lib/auth/customer-session";
import { findUserByEmail, createUser } from "@/lib/repositories/user.repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Dữ liệu không hợp lệ. Email, tên hiển thị (ít nhất 2 ký tự) và mật khẩu (ít nhất 6 ký tự)." },
        { status: 400 }
      );
    }

    const { email, password, displayName } = parsed.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { data: null, error: "Email này đã được đăng ký tài khoản" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = await createUser({
      email,
      passwordHash,
      displayName,
    });

    const token = await createCustomerToken(user.id);
    await setCustomerSessionCookie(token);

    return NextResponse.json(
      {
        data: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[register]", err);
    return NextResponse.json(
      { data: null, error: err.message || "Lỗi tạo tài khoản máy chủ" },
      { status: 500 }
    );
  }
}
