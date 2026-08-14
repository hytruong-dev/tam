import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Metadata } from "next";
import { ShoppingBag, CheckCircle, XCircle } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: product.name,
    description: product.shortDescription,
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

  const [relatedProducts] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
  ]);

  const discountPct =
    product.originalPrice && Number(product.originalPrice) > Number(product.price)
      ? getDiscountPercent(Number(product.price), Number(product.originalPrice))
      : null;

  const inStock = product.stock > 0;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gold">Bộ sưu tập</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gold">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Cover image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative aspect-[2/3] w-full max-w-xs shadow-2xl overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 80vw, 320px"
            />
            {discountPct && (
              <span className="absolute top-3 left-3 bg-burgundy text-white text-xs font-bold px-3 py-1">
                -{discountPct}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <Badge className="bg-gold/20 text-gold border-gold/40 mb-3 font-body">
            {product.category.name}
          </Badge>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-2 leading-tight">
            {product.name}
          </h1>

          {product.author && (
            <p className="text-muted-foreground text-sm mb-4">
              Tác giả: <span className="text-ink font-medium">{product.author}</span>
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-burgundy">
              {formatPrice(Number(product.price))}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(Number(product.originalPrice))}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {inStock ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Còn hàng ({product.stock} cuốn)
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Hết hàng</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-l-2 border-gold pl-4">
            {product.shortDescription}
          </p>

          {/* Buy button (UI only) */}
          <Button
            disabled={!inStock}
            className="w-full sm:w-auto bg-charcoal hover:bg-charcoal/90 text-ivory rounded-none px-8 py-3 font-semibold text-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {inStock ? "MUA NGAY" : "HẾT HÀNG"}
          </Button>

          {/* Full description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="font-heading text-lg font-semibold text-ink mb-3">Mô tả sản phẩm</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
