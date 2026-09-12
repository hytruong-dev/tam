import { findAllOrders } from "@/lib/repositories/order.repository";
import { OrderTableClient } from "@/components/admin/OrderTableClient";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý Đơn hàng | ThienTam Admin",
  description: "Danh sách đơn đặt hàng mô hình Figure từ khách hàng Studio.",
};

export default async function AdminOrdersPage() {
  const orders = await findAllOrders();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[#E05638] text-xs font-extrabold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" /> QUẢN LÝ ĐƠN ĐẶT HÀNG MÔ HÌNH
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Danh Sách Đơn Hàng</h1>
          <p className="text-gray-400 text-xs">Tổng số {orders.length} đơn hàng trong hệ thống Studio</p>
        </div>
      </div>

      {/* Interactive Table Client */}
      <OrderTableClient initialOrders={orders} />
    </div>
  );
}
