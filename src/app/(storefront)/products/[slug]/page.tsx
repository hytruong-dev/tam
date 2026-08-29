import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Metadata } from "next";
import { ShoppingBag, CheckCircle, XCircle, Play, Tag, ShieldCheck, Box } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: product.seoTitle || product.name,
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
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-8 flex items-center gap-2 overflow-x-auto">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gold">Mô hình</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gold">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Cover image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative aspect-[2/3] w-full max-w-sm shadow-2xl rounded overflow-hidden bg-black/5">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {discountPct && (
              <span className="absolute top-3 left-3 bg-copper text-white text-xs font-bold px-3 py-1 rounded">
                -{discountPct}%
              </span>
            )}
            {product.productStatus === "PREORDER" && (
              <span className="absolute top-3 right-3 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded">
                PRE-ORDER
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-gold/20 text-gold border-gold/40 font-body">
              {product.category.name}
            </Badge>
            {product.sku && (
              <span className="text-xs font-mono text-muted-foreground">SKU: {product.sku}</span>
            )}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-copper">
              {formatPrice(Number(product.price))}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(Number(product.originalPrice))}
              </span>
            )}
          </div>

          {/* Stock & Status */}
          <div className="flex items-center gap-2 mb-6">
            {inStock ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Còn hàng trong kho ({product.stock} sản phẩm)
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Tạm hết hàng</span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-l-2 border-gold pl-4">
            {product.shortDescription}
          </p>

          {/* Figure Specs Table */}
          <div className="bg-white rounded border border-border p-4 mb-6 text-sm">
            <h3 className="font-semibold text-ink mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-gold">
              <Box className="w-4 h-4 text-gold" /> Thông số kỹ thuật mô hình
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              {product.brand && (
                <div>
                  <span className="text-muted-foreground">Hãng sản xuất: </span>
                  <span className="font-semibold text-ink">{product.brand}</span>
                </div>
              )}
              {product.series && (
                <div>
                  <span className="text-muted-foreground">Series / Anime: </span>
                  <span className="font-semibold text-ink">{product.series}</span>
                </div>
              )}
              {product.scale && (
                <div>
                  <span className="text-muted-foreground">Tỷ lệ (Scale): </span>
                  <span className="font-semibold text-ink">{product.scale}</span>
                </div>
              )}
              {product.material && (
                <div>
                  <span className="text-muted-foreground">Chất liệu: </span>
                  <span className="font-semibold text-ink">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-muted-foreground">Kích thước: </span>
                  <span className="font-semibold text-ink">{product.dimensions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <Button
            disabled={!inStock}
            className="w-full sm:w-auto bg-copper hover:bg-copper/90 text-white rounded px-8 py-3 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {inStock ? "LIÊN HỆ ĐẶT MÔ HÌNH" : "HẾT HÀNG"}
          </Button>
        </div>
      </div>

      {/* Related Videos */}
      {product.videoProducts && product.videoProducts.length > 0 && (
        <section className="mb-16 bg-white p-6 rounded border border-border">
          <h2 className="font-heading text-xl font-bold text-ink mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-600 fill-red-600" /> Video Review Sản Phẩm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.videoProducts.map(({ video }) => (
              <Link key={video.id} href="/videos" className="group">
                <div className="relative aspect-video rounded overflow-hidden bg-black">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <h4 className="font-medium text-sm text-ink mt-2 group-hover:text-copper transition-colors line-clamp-1">
                  {video.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {product.description && (
        <div className="bg-white rounded border border-border p-6 mb-16">
          <h2 className="font-heading text-xl font-bold text-ink mb-4">Chi tiết mô hình</h2>
          <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
