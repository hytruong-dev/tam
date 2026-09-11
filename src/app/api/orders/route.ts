import { NextRequest, NextResponse } from "next/server";
import { findAllOrders, createOrder, OrderStatus } from "@/lib/repositories/order.repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as OrderStatus) || undefined;
    const search = searchParams.get("q") || undefined;

    const orders = await findAllOrders({ status, search });
    return NextResponse.json({
      success: true,
      total: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.shippingAddress || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ thông tin giao hàng và sản phẩm" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod || "COD",
      items: body.items,
      note: body.note,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đặt hàng mô hình thành công!",
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
