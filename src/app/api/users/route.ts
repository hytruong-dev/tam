import { NextRequest, NextResponse } from "next/server";
import { findAllUsers } from "@/lib/repositories/user.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || undefined;
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const users = await findAllUsers({ search, role, status, limit });
    return NextResponse.json({
      success: true,
      total: users.length,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
