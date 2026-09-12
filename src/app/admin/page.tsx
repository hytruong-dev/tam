export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Video,
  Tag,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { findProducts } from "@/lib/repositories/product.repository";
import { findVideos } from "@/lib/repositories/video.repository";
import { findAllCategories } from "@/lib/repositories/category.repository";
import { findCommunityFeed } from "@/lib/repositories/community.repository";
import { findAllOrders } from "@/lib/repositories/order.repository";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [{ products, total: totalProducts }, { videos, total: totalVideos }, categories, { posts }, orders] =
    await Promise.all([
      findProducts({ page: 1, limit: 5 }, true),
      findVideos({ limit: 4 }),
      findAllCategories(),
      findCommunityFeed({ limit: 4 }),
      findAllOrders(),
    ]);

  const kpis = [
    {
      title: "Tổng số Mô Hình",
      value: totalProducts,
      subtitle: "Trong kho hàng Studio",
      icon: Package,
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-400",
      href: "/admin/products",
    },
    {
      title: "Đơn Đặt Hàng",
      value: orders.length,
      subtitle: "Khách mua Figure",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      href: "/admin/orders",
    },
    {
      title: "Video Review 4K",
      value: totalVideos,
      subtitle: "Đã xuất bản YouTube",
      icon: Video,
      color: "from-red-600 to-rose-700",
      textColor: "text-red-400",
      href: "/admin/videos",
    },
    {
      title: "Danh Mục Figure",
      value: categories.length,
      subtitle: "Anime / Gunpla / Movie",
      icon: Tag,
      color: "from-amber-500 to-yellow-600",
      textColor: "text-amber-400",
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-[#141824] via-[#1A2033] to-[#2B1015] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E05638]/20 border border-[#E05638]/40 px-3 py-1 rounded-full text-[#E05638] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> THIENTAM FIGURE OPERATIONS SUITE
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Bảng Điều Khiển Quản Trị Studio
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
              Quản lý danh mục sản phẩm, video YouTube 4K review, duyệt bài viết cộng đồng và theo dõi trạng thái vận hành hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/create"
              className="inline-flex items-center gap-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(224,86,56,0.4)]"
            >
              <Plus className="w-4 h-4" />
              Tạo Mô Hình Mới
            </Link>
            <Link
              href="/admin/videos/create"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <Plus className="w-4 h-4" />
              Thêm Video Review
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              href={kpi.href}
              className="group bg-[#141824] rounded-2xl p-5 border border-white/10 hover:border-[#E05638]/50 transition-all duration-300 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-bold">{kpi.title}</span>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white group-hover:text-[#E05638] transition-colors">
                  {kpi.value}
                </span>
                <span className={`text-[10px] font-bold ${kpi.textColor} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" /> Hoạt động
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{kpi.subtitle}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Recent Products & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Products Table */}
        <div className="lg:col-span-8 bg-[#141824] rounded-3xl border border-white/10 p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#E05638]" />
              <h2 className="font-heading text-lg font-extrabold text-white">
                Sản Phẩm Mô Hình Mới Cập Nhật
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#E05638] hover:underline flex items-center gap-1"
            >
              Tất cả sản phẩm ({totalProducts}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Mô hình</th>
                  <th className="pb-3">Danh mục</th>
                  <th className="pb-3">Giá bán</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3 text-right pr-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0B0E17] border border-white/10 flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white group-hover:text-[#E05638] transition-colors truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">{product.sku || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-300 font-medium">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="py-3 font-bold text-[#E05638]">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="py-3">
                      {product.productStatus === "PREORDER" ? (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          Pre-Order
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          Có sẵn
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 text-[11px] transition-colors"
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Operations Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Operations Quick Links Card */}
          <div className="bg-[#141824] rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="font-heading text-base font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" /> Tác Vụ Nhanh
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/admin/products/create"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-[#E05638]/50 hover:bg-[#1c2233] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E05638]/20 text-[#E05638] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#E05638] transition-colors">
                      Thêm Mô Hình Mới
                    </p>
                    <p className="text-[10px] text-gray-400">Đăng sản phẩm Figure mới vào shop</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/admin/videos/create"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-red-500/50 hover:bg-[#1c2233] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      Thêm Video Review 4K
                    </p>
                    <p className="text-[10px] text-gray-400">Gắn link YouTube unbox mô hình</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/admin/categories/create"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-amber-500/50 hover:bg-[#1c2233] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Tạo Danh Mục Mới
                    </p>
                    <p className="text-[10px] text-gray-400">Phân loại Gunpla, Anime, Movie</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/admin/community"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-emerald-500/50 hover:bg-[#1c2233] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Duyệt Bài Diễn Đàn
                    </p>
                    <p className="text-[10px] text-gray-400">Kiểm duyệt bài viết từ Collector</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* System Status Alert */}
          <div className="bg-[#0B0E17] rounded-3xl border border-emerald-500/30 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Hệ Thống Đang Vận Hành Ổn Định</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Tất cả API, hệ thống render Server Components và kết nối CDN hình ảnh đang chạy ở tốc độ cao nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
