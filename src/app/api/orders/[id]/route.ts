import { NextRequest, NextResponse } from "next/server";
import { findOrderById, updateOrderStatus, OrderStatus } from "@/lib/repositories/order.repository";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await findOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, data: null, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to fetch order" },
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

    if (!body.status) {
      return NextResponse.json(
        { success: false, data: null, error: "Missing order status" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, body.status as OrderStatus);
    if (!updated) {
      return NextResponse.json(
        { success: false, data: null, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      data: updated,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
