import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Tag, ShieldCheck, RefreshCw, Play, MessageSquare, Users } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/services/product.service";
import { findVideos } from "@/lib/repositories/video.repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ThienTam — Nền tảng Mô hình Figure, Video Review & Cộng đồng Anime",
  description: "ThienTam - Shop mô hình anime, figure chính hãng, video review unbox và cộng đồng người sưu tầm.",
};

const infoItems = [
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Miễn phí đơn từ 499.000đ" },
  { icon: Tag, title: "Hàng chính hãng", desc: "Cam kết 100% authentic" },
  { icon: ShieldCheck, title: "Đóng gói kỹ lưỡng", desc: "An toàn đến tay bạn" },
  { icon: RefreshCw, title: "Đổi trả dễ dàng", desc: "Đổi trả trong 07 ngày" },
];

export default async function HomePage() {
  const [featuredResult, newResult, videoResult] = await Promise.all([
    getProducts({ page: 1, limit: 6, featured: true }, false),
    getProducts({ page: 1, limit: 5, isNew: true, sort: "newest" }, false),
    findVideos({ activeOnly: true, limit: 3 }),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-charcoal text-white py-20 px-4 overflow-hidden relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 max-w-xl">
            <p className="text-copper text-sm tracking-widest uppercase mb-3 font-body font-semibold">
              Mô hình anime & figure chính hãng ThienTam
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Sưu tầm{" "}
              <span className="text-gold">nhân vật yêu thích</span>{" "}
              của bạn
            </h1>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              Hàng nghìn mô hình figure, Nendoroid, Gundam được tuyển chọn kỹ lưỡng.
              Hàng chính hãng, đóng gói cẩn thận, giao tận nơi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white font-semibold px-6 py-3 text-sm transition-colors rounded"
              >
                XEM MÔ HÌNH <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-gold hover:text-gold text-white/80 font-semibold px-6 py-3 text-sm transition-colors rounded"
              >
                <Users className="w-4 h-4" /> CỘNG ĐỒNG
              </Link>
            </div>
          </div>

          {/* Product covers grid */}
          <div className="flex-1 flex justify-center md:justify-end">
            {featuredResult.products.slice(0, 4).length > 0 ? (
              <div className="flex gap-3 items-end">
                {featuredResult.products.slice(0, 4).map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`relative overflow-hidden rounded shadow-xl transition-transform hover:scale-105 ${
                      i === 1
                        ? "w-28 h-40 md:w-36 md:h-52"
                        : i === 0
                        ? "w-24 h-36 md:w-32 md:h-48"
                        : "w-20 h-28 md:w-28 md:h-40"
                    }`}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                      <p className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-white/30 text-sm italic">Chưa có sản phẩm nổi bật</div>
            )}
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-ivory border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {infoItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 py-5 px-4">
                <Icon className="w-6 h-6 text-copper flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Banner Call-out */}
      <section className="py-10 px-4 bg-white border-b border-border">
        <div className="container mx-auto max-w-4xl bg-ivory/50 rounded border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-copper font-semibold text-xs tracking-wider uppercase mb-1">
              <MessageSquare className="w-4 h-4" /> Cộng đồng sưu tầm ThienTam
            </div>
            <h3 className="font-heading text-2xl font-bold text-ink mb-2">Chia sẻ góc trưng bày mô hình của bạn!</h3>
            <p className="text-muted-foreground text-sm">
              Tham gia thảo luận, đăng hình góc sưu tầm và trao đổi cùng hàng ngàn collector khác.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white font-semibold px-6 py-3 text-sm transition-colors rounded whitespace-nowrap"
          >
            THAM GIA CỘNG ĐỒNG <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-copper text-xs tracking-widest uppercase mb-1 font-semibold">Được yêu thích nhất</p>
              <h2 className="font-heading text-2xl font-bold text-ink">Bán chạy</h2>
            </div>
            <Link
              href="/products"
              className="text-sm text-copper hover:underline flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {featuredResult.products.length === 0 ? (
            <p className="text-muted-foreground text-sm">Chưa có sản phẩm nổi bật.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredResult.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      {newResult.products.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-copper text-xs tracking-widest uppercase mb-1 font-semibold">Mới về</p>
                <h2 className="font-heading text-2xl font-bold text-ink">Hàng mới nhất</h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="text-sm text-copper hover:underline flex items-center gap-1 font-medium"
              >
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newResult.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video mới nhất */}
      {videoResult.videos.length > 0 && (
        <section className="py-12 px-4 bg-ivory">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-copper text-xs tracking-widest uppercase mb-1 font-semibold">Kênh YouTube Review</p>
                <h2 className="font-heading text-2xl font-bold text-ink">Video review mới nhất</h2>
              </div>
              <Link
                href="/videos"
                className="text-sm text-copper hover:underline flex items-center gap-1 font-medium"
              >
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoResult.videos.map((video) => (
                <Link
                  key={video.id}
                  href="/videos"
                  className="group"
                >
                  <div className="relative aspect-video overflow-hidden rounded bg-black">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-ink text-sm line-clamp-2 group-hover:text-copper transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-1">
                      {video.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-charcoal text-white py-14 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold mb-1">Đăng ký nhận tin</h3>
            <p className="text-white/60 text-sm">
              Nhận thông tin về mô hình mới, ưu đãi độc quyền và video review dành riêng cho bạn.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 md:w-64 px-4 py-2.5 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-copper"
            />
            <button className="bg-copper hover:bg-copper/90 text-white font-semibold text-sm px-5 py-2.5 transition-colors rounded">
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
