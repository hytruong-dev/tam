"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/repositories/order.repository";
import { Search, Filter, CheckCircle2, Clock, Truck, XCircle, ChevronDown, Package } from "lucide-react";

interface OrderTableClientProps {
  initialOrders: Order[];
}

export function OrderTableClient({ initialOrders }: OrderTableClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.customerEmail.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case "CONFIRMED":
        return <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Đã xác nhận</span>;
      case "SHIPPING":
        return <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Đang giao hàng</span>;
      case "COMPLETED":
        return <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Hoàn thành</span>;
      case "CANCELLED":
        return <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Đã hủy</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-[#141824] p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, Tên, SĐT, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0E17] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-gray-400 font-bold flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#E05638]" /> Trạng thái:
          </span>
          {["ALL", "PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                statusFilter === st
                  ? "bg-[#E05638] text-white border-[#E05638] shadow-[0_0_10px_rgba(224,86,56,0.4)]"
                  : "bg-[#0B0E17] text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {st === "ALL" ? "Tất cả" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#141824] p-12 rounded-3xl border border-white/10 text-center text-xs text-gray-400">
          Không tìm thấy đơn hàng nào khớp với tìm kiếm.
        </div>
      ) : (
        <div className="bg-[#141824] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0E17] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">Mã Đơn Hàng</th>
                  <th className="p-4">Khách Hàng</th>
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Thanh Toán</th>
                  <th className="p-4">Tổng Tiền</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Cập Nhật Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#E05638]">{ord.orderNumber}</span>
                      <p className="text-[10px] text-gray-500">{new Date(ord.createdAt).toLocaleDateString("vi-VN")}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{ord.customerName}</p>
                      <p className="text-gray-400 font-mono text-[11px]">{ord.customerPhone}</p>
                      <p className="text-gray-500 text-[10px] truncate max-w-[150px]">{ord.shippingAddress}</p>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-300">
                            <Package className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="font-semibold truncate max-w-[160px]">{item.productName}</span>
                            <span className="text-gray-500 font-mono">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-gray-300">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-white text-sm">
                      {formatPrice(ord.totalAmount)}
                    </td>

                    <td className="p-4">
                      {getStatusBadge(ord.orderStatus)}
                    </td>

                    <td className="p-4 text-right">
                      <select
                        disabled={updatingId === ord.id}
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#0B0E17] border border-white/20 text-white rounded-xl text-xs py-1.5 px-2.5 focus:outline-none focus:border-[#E05638] cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
