import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton";
import { getProducts } from "@/lib/services/product.service";
import { findAllCategories } from "@/lib/repositories/category.repository";
import { productQuerySchema } from "@/lib/validations/product";
import { Sparkles, Box } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cửa Hàng Mô Hình Figure Cyberpunk | ThienTam Studio",
  description: "Danh sách mô hình Anime Figure, Nendoroid, Gundam, Statue cao cấp 100% Authentic tại ThienTam Figure Studio.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;

  const parsed = productQuerySchema.safeParse({
    q: rawParams.q,
    category: rawParams.category,
    sort: rawParams.sort,
    page: rawParams.page,
    limit: rawParams.limit,
  });

  const query = parsed.success ? parsed.data : { page: 1, limit: 12 };
  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts(query, false),
    findAllCategories(),
  ]);

  return (
    <div className="bg-[#0B0E17] min-h-screen py-8 text-gray-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Title Header */}
        <div className="bg-[#141824] p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E05638] text-xs font-extrabold uppercase tracking-wider mb-1 drop-shadow-[0_0_8px_rgba(224,86,56,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> THIENTAM FIGURE STORE
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Kho Mô Hình & Figure Premium
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {total > 0 ? `Đang hiển thị ${total} sản phẩm mô hình chính hãng` : "Không tìm thấy sản phẩm"}
              {parsed.success && parsed.data.q ? ` khớp với từ khóa "${parsed.data.q}"` : ""}
            </p>
          </div>
          <div className="bg-[#E05638]/15 text-[#E05638] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border border-[#E05638]/30 shadow-[0_0_10px_rgba(224,86,56,0.2)]">
            <Box className="w-4 h-4" /> 100% Full Box Authentic
          </div>
        </div>

        {/* Filters Bar */}
        <Suspense fallback={null}>
          <ProductFilters categories={categories} />
        </Suspense>

        {/* Product Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          {products.length === 0 ? (
            <div className="bg-[#141824] p-12 text-center rounded-2xl border border-white/10 shadow-xl my-6">
              <EmptyState
                title="Chưa tìm thấy mẫu mô hình này"
                description="Hãy thử đổi từ khóa tìm kiếm hoặc bấm chọn danh mục khác nhé!"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <Pagination page={parsed.success ? parsed.data.page : 1} totalPages={totalPages} />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}