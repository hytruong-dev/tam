import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { ProductWithCategory } from "@/lib/repositories/product.repository";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPct =
    product.originalPrice && Number(product.originalPrice) > Number(product.price)
      ? getDiscountPercent(Number(product.price), Number(product.originalPrice))
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Book cover */}
      <div className="relative overflow-hidden aspect-[2/3] bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {discountPct && (
          <span className="absolute top-2 left-2 bg-burgundy text-white text-xs font-semibold px-2 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-gold text-charcoal text-xs font-semibold px-2 py-0.5 rounded">
            MỚI
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Badge variant="outline" className="text-[10px] mb-1 border-gold/40 text-gold">
          {product.category.name}
        </Badge>
        <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug mb-1">
          {product.name}
        </h3>
        {product.author && (
          <p className="text-xs text-muted-foreground mb-2">{product.author}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-burgundy">
            {formatPrice(Number(product.price))}
          </span>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(Number(product.originalPrice))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
