import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { pbkdf2Sync, randomBytes } from "crypto";
import { findUserById } from "@/lib/repositories/user.repository";
import type { User } from "@prisma/client";

const CUSTOMER_COOKIE = "customer_session";
const CUSTOMER_SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days

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

export async function createCustomerToken(userId: string): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CUSTOMER_SESSION_DURATION}s`)
    .sign(secret);
}

export async function verifyCustomerToken(token: string): Promise<{ userId: string } | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function setCustomerSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_DURATION,
  });
}

export async function clearCustomerSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
}

export async function getCurrentCustomer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
    if (!token) return null;

    const verified = await verifyCustomerToken(token);
    if (!verified) return null;

    const user = await findUserById(verified.userId);
    if (user && user.status === "ACTIVE") return user;
    return null;
  } catch {
    return null;
  }
}
