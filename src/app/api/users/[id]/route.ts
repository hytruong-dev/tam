import { NextRequest, NextResponse } from "next/server";
import { findUserById, updateUser, deleteUser } from "@/lib/repositories/user.repository";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateUser(id, {
      role: body.role,
      status: body.status,
      displayName: body.displayName,
      avatarUrl: body.avatarUrl,
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updated,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteUser(id);
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: deleted,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
