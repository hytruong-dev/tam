"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, X, CheckCircle2, Loader2, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY">("COD");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      setError("Vui lòng nhập Họ tên, Số điện thoại và Địa chỉ giao hàng.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          paymentMethod,
          note,
          items: [
            {
              productId: product.id,
              productName: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              quantity: 1,
            },
          ],
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Đặt hàng không thành công");
      }

      setCreatedOrder(json.data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#141824] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0E17]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E05638]" />
            <h3 className="font-heading text-lg font-extrabold text-white">Đặt Mua Mô Hình Figure</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdOrder ? (
          /* Order Success State */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Đặt Hàng Thành Công!</h4>
            <p className="text-xs text-gray-300">
              Mã đơn hàng: <span className="font-mono font-bold text-[#E05638] text-sm">{createdOrder.orderNumber}</span>
            </p>
            <p className="text-xs text-gray-400">
              Cảm ơn <span className="font-bold text-white">{createdOrder.customerName}</span>. Đội ngũ ThienTam Studio sẽ gọi điện xác nhận trong vòng 15 phút.
            </p>

            <div className="bg-[#0B0E17] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-gray-400">
                <span>Sản phẩm:</span>
                <span className="text-white font-semibold truncate max-w-[220px]">{product.name}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tổng tiền:</span>
                <span className="text-[#E05638] font-bold">{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Thanh toán:</span>
                <span className="text-white font-semibold uppercase">{createdOrder.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(224,86,56,0.4)]"
            >
              Hoàn Tất & Tiếp Tục Xem Mô Hình
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Summary */}
            <div className="flex items-center gap-4 bg-[#0B0E17] p-3 rounded-2xl border border-white/10">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                <p className="text-sm font-extrabold text-[#E05638] mt-0.5">{formatPrice(product.price)}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Họ tên người nhận <span className="text-[#E05638]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Minh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Số điện thoại <span className="text-[#E05638]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="VD: 0908889999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Email nhận thông báo</label>
                <input
                  type="email"
                  placeholder="VD: minhnv@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">
                  Địa chỉ giao hàng chi tiết <span className="text-[#E05638]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Hình thức thanh toán</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "COD", label: "Thanh toán khi nhận (COD)" },
                    { id: "BANK_TRANSFER", label: "Chuyển khoản Ngân hàng" },
                    { id: "MOMO", label: "Ví MoMo" },
                    { id: "VNPAY", label: "VNPay QR" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all text-left ${
                        paymentMethod === method.id
                          ? "bg-[#E05638]/20 border-[#E05638] text-[#E05638]"
                          : "bg-[#0B0E17] border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Ghi chú đơn hàng (nếu có)</label>
                <input
                  type="text"
                  placeholder="VD: Đóng bọc xốp bọt khí cẩn thận..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(224,86,56,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang tạo đơn hàng...
                </>
              ) : (
                "XÁC NHẬN ĐẶT HÀNG"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
