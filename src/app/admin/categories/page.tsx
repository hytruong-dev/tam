import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminCategoryTable } from "@/components/admin/CategoryTable";
import { findAllCategories } from "@/lib/repositories/category.repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý danh mục | Admin" };

export default async function AdminCategoriesPage() {
  const categories = await findAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Danh mục</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{categories.length} danh mục</p>
        </div>
        <Link
          href="/admin/categories/create"
          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-charcoal font-semibold text-sm px-3 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Link>
      </div>

      <AdminCategoryTable categories={categories} />
    </div>
  );
}
