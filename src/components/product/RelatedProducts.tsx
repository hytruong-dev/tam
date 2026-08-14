import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithCategory } from "@/lib/repositories/product.repository";

interface RelatedProductsProps {
  products: ProductWithCategory[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-ink">Sản phẩm liên quan</h2>
        <Link href="/products" className="text-sm text-gold hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
