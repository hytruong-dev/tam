import { NextRequest, NextResponse } from "next/server";
import { findAllUsers } from "@/lib/repositories/user.repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || undefined;
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const users = await findAllUsers({ search, role, status, limit });
    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      total: formatted.length,
      data: formatted,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
