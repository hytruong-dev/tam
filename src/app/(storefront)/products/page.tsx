import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton";
import { getProducts } from "@/lib/services/product.service";
import { findAllCategories } from "@/lib/repositories/category.repository";
import { productQuerySchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mô hình & Figure | Kaku",
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
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ink mb-1">Bộ sưu tập</h1>
        <p className="text-muted-foreground text-sm">
          {total > 0 ? `${total} sản phẩm` : "Không có sản phẩm"}
          {parsed.success && parsed.data.q ? ` cho "${parsed.data.q}"` : ""}
        </p>
      </div>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length === 0 ? (
          <EmptyState
            title="Không tìm thấy sản phẩm"
            description="Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination page={parsed.success ? parsed.data.page : 1} totalPages={totalPages} />
          </>
        )}
      </Suspense>
    </div>
  );
}
