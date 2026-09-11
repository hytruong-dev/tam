import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { AdminProductTable } from "@/components/admin/ProductTable";
import { getProducts } from "@/lib/services/product.service";
import { productQuerySchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý sản phẩm Mô hình | ThienTam Admin" };

interface AdminProductsPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const rawParams = await searchParams;

  const parsed = productQuerySchema.safeParse({
    q: rawParams.q,
    page: rawParams.page,
    limit: rawParams.limit ?? "20",
    admin: "true",
  });

  const query = parsed.success ? parsed.data : { page: 1, limit: 20 };
  const { products, total, totalPages } = await getProducts(query, true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[#E05638] text-xs font-extrabold uppercase tracking-wider">
            <Package className="w-4 h-4" /> QUẢN LÝ KHO MÔ HÌNH
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Danh Sách Mô Hình Figure</h1>
          <p className="text-gray-400 text-xs">Tổng cộng {total} sản phẩm mô hình trong kho</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(224,86,56,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Thêm Mô Hình Mới
        </Link>
      </div>

      <AdminProductTable
        products={products}
        page={parsed.success ? parsed.data.page : 1}
        totalPages={totalPages}
        query={rawParams.q ?? ""}
      />
    </div>
  );
}
