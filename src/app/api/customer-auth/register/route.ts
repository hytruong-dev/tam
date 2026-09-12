import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/customer-auth";
import {
  hashPassword,
  createCustomerTokens,
  setCustomerSessionCookies,
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} from "@/lib/auth/customer-session";
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

    // Tạo bộ đôi Access Token (15m) & Refresh Token (30d)
    const { accessToken, refreshToken } = await createCustomerTokens(user.id);
    await setCustomerSessionCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        data: {
          user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            role: user.role,
          },
          accessToken,
          refreshToken,
          expiresIn: ACCESS_TOKEN_DURATION,
          refreshExpiresIn: REFRESH_TOKEN_DURATION,
          // Dữ liệu tương thích cấp cao
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
