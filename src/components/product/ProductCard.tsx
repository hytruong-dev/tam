import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
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
    <div className="group bg-[#141824] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E05638]/70 hover:shadow-[0_0_25px_rgba(224,86,56,0.3)] transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#0B0E17] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        </Link>

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPct && (
            <span className="bg-[#E05638] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(224,86,56,0.5)]">
              -{discountPct}%
            </span>
          )}
          {product.productStatus === "PREORDER" && (
            <span className="bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.5)] uppercase tracking-wider">
              Pre-Order
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.5)] uppercase tracking-wider">
              Mới về
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#E05638] hover:bg-black/80 hover:border-[#E05638]/50 transition-all z-10"
          aria-label="Thêm vào yêu thích"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Scale/Brand tag overlay */}
        {product.scale && (
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/10">
            {product.scale}
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#141824]">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-extrabold text-[#E05638] uppercase tracking-wider bg-[#E05638]/15 border border-[#E05638]/30 px-1.5 py-0.5 rounded-md">
              {product.category?.name || "Figure"}
            </span>
            {product.brand && (
              <span className="text-[10px] text-gray-400 truncate font-semibold">
                • {product.brand}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs font-bold text-gray-100 line-clamp-2 leading-snug group-hover:text-[#E05638] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-[#E05638] drop-shadow-[0_0_8px_rgba(224,86,56,0.3)]">
              {formatPrice(Number(product.price))}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-[11px] text-gray-500 line-through">
                {formatPrice(Number(product.originalPrice))}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              <span className="text-[11px] font-extrabold text-amber-300">4.9</span>
              <span className="text-[10px] text-gray-500">(120+)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Authentic
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}