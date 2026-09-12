import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { pbkdf2Sync, randomBytes } from "crypto";
import { findUserById } from "@/lib/repositories/user.repository";
import type { User } from "@prisma/client";

const ACCESS_COOKIE = "customer_access_token";
const REFRESH_COOKIE = "customer_refresh_token";
const LEGACY_COOKIE = "customer_session";

// Lifetime settings
export const ACCESS_TOKEN_DURATION = 15 * 60; // 15 phút (900s)
export const REFRESH_TOKEN_DURATION = 30 * 24 * 60 * 60; // 30 ngày (2,592,000s)

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || "customer-session-default-secret-key-32chars";
  return new TextEncoder().encode(secret);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combined: string): boolean {
  const [salt, originalHash] = combined.split(":");
  if (!salt || !originalHash) return false;
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

/**
 * Tạo Access Token ngắn hạn (15 phút)
 */
export async function createCustomerAccessToken(userId: string): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ userId, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_DURATION}s`)
    .sign(secret);
}

/**
 * Tạo Refresh Token dài hạn (30 ngày)
 */
export async function createCustomerRefreshToken(userId: string): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ userId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_DURATION}s`)
    .sign(secret);
}

/**
 * Tạo bộ đôi Access Token & Refresh Token
 */
export async function createCustomerTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
  const [accessToken, refreshToken] = await Promise.all([
    createCustomerAccessToken(userId),
    createCustomerRefreshToken(userId),
  ]);
  return { accessToken, refreshToken };
}

/**
 * Xác thực JWT Token
 */
export async function verifyCustomerToken(
  token: string,
  expectedType?: "access" | "refresh"
): Promise<{ userId: string; type?: string } | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    if (expectedType && payload.type && payload.type !== expectedType) {
      return null;
    }
    return { userId: payload.userId as string, type: payload.type as string };
  } catch {
    return null;
  }
}

/**
 * Thiết lập cả AccessToken (15m) & RefreshToken (30d) vào Cookie HttpOnly
 */
export async function setCustomerSessionCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_DURATION,
  });

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_DURATION,
  });
}

/**
 * Hàm tương thích legacy
 */
export async function setCustomerSessionCookie(token: string): Promise<void> {
  const refreshToken = await createCustomerRefreshToken(
    (await verifyCustomerToken(token))?.userId || "user-id"
  );
  await setCustomerSessionCookies(token, refreshToken);
}

/**
 * Xóa sạch tất cả các phiên token trong Cookie
 */
export async function clearCustomerSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(LEGACY_COOKIE);
}

/**
 * Lấy thông tin tài khoản hiện tại:
 * 1. Thử xác thực với Access Token (15m).
 * 2. Nếu Access Token hết hạn/thiếu -> Thử Refresh Token (30 ngày).
 * 3. Nếu Refresh Token hợp lệ -> Tự động cấp Access Token mới & cập nhật Cookie!
 * 4. Nếu cả 2 hết hạn -> Xóa cookie & trả về null (Đăng xuất tự động).
 */
export async function getCurrentCustomer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value || cookieStore.get(LEGACY_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    // Bước 1: Thử Access Token trước
    if (accessToken) {
      const verifiedAccess = await verifyCustomerToken(accessToken, "access");
      if (verifiedAccess) {
        const user = await findUserById(verifiedAccess.userId);
        if (user && user.status === "ACTIVE") return user;
      }
    }

    // Bước 2: Nếu Access Token hết hạn nhưng còn Refresh Token (30 ngày)
    if (refreshToken) {
      const verifiedRefresh = await verifyCustomerToken(refreshToken, "refresh");
      if (verifiedRefresh) {
        const user = await findUserById(verifiedRefresh.userId);
        if (user && user.status === "ACTIVE") {
          // Tự động Cấp lại Access Token 15 phút mới và gia hạn Cookie
          const newAccessToken = await createCustomerAccessToken(user.id);
          cookieStore.set(ACCESS_COOKIE, newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: ACCESS_TOKEN_DURATION,
          });
          return user;
        }
      }
    }

    // Bước 3: Cả AccessToken & RefreshToken đều không hợp lệ hoặc đã hết hạn -> Tự động Logout
    if (accessToken || refreshToken) {
      await clearCustomerSessionCookie();
    }
    return null;
  } catch {
    return null;
  }
}
