import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminProductTable } from "@/components/admin/ProductTable";
import { getProducts } from "@/lib/services/product.service";
import { productQuerySchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý sản phẩm | Admin" };

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Sản phẩm</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} sản phẩm</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-charcoal font-semibold text-sm px-3 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
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
