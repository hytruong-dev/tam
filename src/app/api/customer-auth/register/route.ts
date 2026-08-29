import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/customer-auth";
import { hashPassword, createCustomerToken, setCustomerSessionCookie } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, displayName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { data: null, error: "Email này đã được đăng ký" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
      },
    });

    const token = await createCustomerToken(user.id);
    await setCustomerSessionCookie(token);

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      error: null,
    }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ data: null, error: "Lỗi máy chủ" }, { status: 500 });
  }
}
