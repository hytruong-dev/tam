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
import { formatZodError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch((err) => {
      console.error("[POST /api/customer-auth/register] JSON parse error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json({ data: null, error: "Dữ liệu gửi lên không đúng định dạng JSON" }, { status: 400 });
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = formatZodError(parsed.error);
      console.error("[POST /api/customer-auth/register] Validation error:", errorMsg);
      return NextResponse.json(
        { data: null, error: `Dữ liệu đăng ký không hợp lệ: ${errorMsg}` },
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
      { data: null, error: `Lỗi máy chủ: ${err.message || "Tạo tài khoản thất bại"}` },
      { status: 500 }
    );
  }
}
