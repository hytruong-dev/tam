import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyCustomerToken,
  createCustomerAccessToken,
  createCustomerRefreshToken,
  setCustomerSessionCookies,
  clearCustomerSessionCookie,
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} from "@/lib/auth/customer-session";
import { findUserById } from "@/lib/repositories/user.repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    let refreshToken = cookieStore.get("customer_refresh_token")?.value;

    // Cho phép truyền refreshToken trong body JSON nếu client gửi lên
    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch {
        // body rỗng
      }
    }

    if (!refreshToken) {
      await clearCustomerSessionCookie();
      return NextResponse.json(
        { data: null, error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" },
        { status: 401 }
      );
    }

    const verified = await verifyCustomerToken(refreshToken, "refresh");
    if (!verified) {
      await clearCustomerSessionCookie();
      return NextResponse.json(
        { data: null, error: "Refresh token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    const user = await findUserById(verified.userId);
    if (!user || user.status !== "ACTIVE") {
      await clearCustomerSessionCookie();
      return NextResponse.json(
        { data: null, error: "Tài khoản không tồn tại hoặc đã bị khóa" },
        { status: 403 }
      );
    }

    // Cấp lại bộ đôi AccessToken mới (15 phút) và RefreshToken gia hạn mới (30 ngày)
    const newAccessToken = await createCustomerAccessToken(user.id);
    const newRefreshToken = await createCustomerRefreshToken(user.id);
    await setCustomerSessionCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: ACCESS_TOKEN_DURATION,
        refreshExpiresIn: REFRESH_TOKEN_DURATION,
      },
      error: null,
    });
  } catch (err: any) {
    console.error("[customer/refresh]", err);
    await clearCustomerSessionCookie();
    return NextResponse.json(
      { data: null, error: err.message || "Lỗi gia hạn phiên làm việc" },
      { status: 500 }
    );
  }
}
