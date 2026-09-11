import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Metadata } from "next";
import { ShoppingBag, CheckCircle, XCircle, Play, Tag, ShieldCheck, Box, Sparkles, Truck, Award, Heart, MessageCircle } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy mô hình" };

  return {
    title: `${product.name} | ThienTam Figure Studio`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);

  const discountPct =
    product.originalPrice && Number(product.originalPrice) > Number(product.price)
      ? getDiscountPercent(Number(product.price), Number(product.originalPrice))
      : null;

  const inStock = product.stock > 0;

  return (
    <div className="bg-[#0B0E17] min-h-screen py-8 text-gray-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2 overflow-x-auto bg-[#141824] px-4 py-3 rounded-xl border border-white/10 shadow-md">
          <Link href="/" className="hover:text-[#E05638] font-semibold">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#E05638] font-semibold">Mô hình Figure</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#E05638] font-semibold">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white font-extrabold truncate">{product.name}</span>
        </nav>

        {/* Main Product Info Card */}
        <div className="bg-[#141824] rounded-3xl border border-white/10 shadow-2xl p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Cover image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-md shadow-2xl rounded-2xl overflow-hidden bg-[#0B0E17] border-2 border-[#E05638]/40 group">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, 450px"
                />
                {discountPct && (
                  <span className="absolute top-3 left-3 bg-[#E05638] text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-[0_0_10px_rgba(224,86,56,0.5)]">
                    -{discountPct}%
                  </span>
                )}
                {product.productStatus === "PREORDER" && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-extrabold px-3 py-1 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.5)] uppercase tracking-wider">
                    Pre-Order
                  </span>
                )}
              </div>
            </div>

            {/* Right Info */}
            <div className="md:col-span-7 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#E05638]/15 text-[#E05638] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-[#E05638]/30">
                  {product.category.name}
                </span>
                {product.brand && (
                  <span className="text-xs bg-white/5 text-gray-300 border border-white/10 font-bold px-2.5 py-1 rounded-full">
                    Hãng: {product.brand}
                  </span>
                )}
                {product.sku && (
                  <span className="text-xs font-mono text-gray-500">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="bg-[#0B0E17] p-4 rounded-2xl border border-white/10 flex items-baseline gap-4 shadow-inner">
                <span className="text-3xl font-extrabold text-[#E05638] drop-shadow-[0_0_10px_rgba(224,86,56,0.4)]">
                  {formatPrice(Number(product.price))}
                </span>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-base text-gray-500 line-through font-medium">
                    {formatPrice(Number(product.originalPrice))}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                {inStock ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Còn hàng sẵn tại showroom ({product.stock} mô hình)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/30 font-bold">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Tạm hết hàng sẵn - Đặt hàng theo yêu cầu</span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed border-l-4 border-[#E05638] pl-4 py-1">
                {product.shortDescription}
              </p>

              {/* Figure Specs Table */}
              <div className="bg-[#0B0E17]/80 rounded-2xl border border-white/10 p-4 text-xs">
                <h3 className="font-extrabold text-white mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-[#E05638]">
                  <Box className="w-4 h-4 text-[#E05638]" /> Thông Số Kỹ Thuật Mô Hình
                </h3>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  {product.brand && (
                    <div>
                      <span className="text-gray-400">Hãng sản xuất: </span>
                      <span className="font-bold text-white">{product.brand}</span>
                    </div>
                  )}
                  {product.series && (
                    <div>
                      <span className="text-gray-400">Anime / Series: </span>
                      <span className="font-bold text-white">{product.series}</span>
                    </div>
                  )}
                  {product.scale && (
                    <div>
                      <span className="text-gray-400">Tỷ lệ (Scale): </span>
                      <span className="font-bold text-white">{product.scale}</span>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <span className="text-gray-400">Chất liệu: </span>
                      <span className="font-bold text-white">{product.material}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <span className="text-gray-400">Kích thước: </span>
                      <span className="font-bold text-white">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  disabled={!inStock}
                  className="flex-1 min-w-[200px] bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold rounded-xl py-3.5 px-6 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(224,86,56,0.4)] transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {inStock ? "LIÊN HỆ ĐẶT MÔ HÌNH" : "TẠM HẾT HÀNG"}
                </button>
                <Link
                  href="/community"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl py-3.5 px-5 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tư Vấn Collector
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related YouTube Videos */}
        {product.videoProducts && product.videoProducts.length > 0 && (
          <section className="bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <h2 className="font-heading text-xl font-extrabold text-white">
                Video Review Youtube Sản Phẩm 4K
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.videoProducts.map(({ video }) => (
                <Link key={video.id} href="/videos" className="group block bg-[#0B0E17] rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all">
                  <div className="relative aspect-video bg-black">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {video.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Full Description */}
        {product.description && (
          <div className="bg-[#141824] rounded-3xl border border-white/10 shadow-xl p-6 lg:p-8">
            <h2 className="font-heading text-xl font-extrabold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E05638]" /> Chi Tiết & Đánh Giá Mô Hình
            </h2>
            <div className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}