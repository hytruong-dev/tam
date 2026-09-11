import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { AdminCategoryTable } from "@/components/admin/CategoryTable";
import { findAllCategories } from "@/lib/repositories/category.repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý danh mục | ThienTam Admin" };

export default async function AdminCategoriesPage() {
  const categories = await findAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <Tag className="w-4 h-4" /> QUẢN LÝ DANH MỤC
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Danh Mục Mô Hình</h1>
          <p className="text-gray-400 text-xs">Tổng cộng {categories.length} danh mục phân loại</p>
        </div>
        <Link
          href="/admin/categories/create"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Tạo Danh Mục Mới
        </Link>
      </div>

      <AdminCategoryTable categories={categories} />
    </div>
  );
}
