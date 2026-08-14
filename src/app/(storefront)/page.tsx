import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Tag, ShieldCheck, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/services/product.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kaku Books — Khám phá thế giới qua từng trang sách",
};

const infoItems = [
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Miễn phí đơn từ 399.000đ" },
  { icon: Tag, title: "Ưu đãi thành viên", desc: "Giảm thêm đến 10%" },
  { icon: ShieldCheck, title: "Sản phẩm chính hãng", desc: "Cam kết 100% bản quyền" },
  { icon: RefreshCw, title: "Đổi trả dễ dàng", desc: "Đổi trả trong 07 ngày" },
];

export default async function HomePage() {
  const [featuredResult, newResult] = await Promise.all([
    getProducts({ page: 1, limit: 6, featured: true }, false),
    getProducts({ page: 1, limit: 5, isNew: true, sort: "newest" }, false),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-charcoal text-white py-20 px-4 overflow-hidden relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 max-w-xl">
            <p className="text-gold text-sm tracking-widest uppercase mb-3 font-body">Tuyển chọn truyện đặc sắc</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Khám phá thế giới{" "}
              <span className="text-gold">qua từng trang sách</span>
            </h1>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              Hàng nghìn đầu manga và tiểu thuyết đồ họa được tuyển chọn kỹ lưỡng. Từ hành động kịch tính đến lãng mạn ngọt ngào.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-charcoal font-semibold px-6 py-3 text-sm transition-colors"
            >
              MUA NGAY <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Book covers grid */}
          <div className="flex-1 flex justify-center md:justify-end">
            {featuredResult.products.slice(0, 4).length > 0 ? (
              <div className="flex gap-3 items-end">
                {featuredResult.products.slice(0, 4).map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`relative overflow-hidden rounded shadow-xl transition-transform hover:scale-105 ${
                      i === 1 ? "w-28 h-40 md:w-36 md:h-52" : i === 0 ? "w-24 h-36 md:w-32 md:h-48" : "w-22 h-32 md:w-28 md:h-40"
                    }`}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                      <p className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">{product.name}</p>
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
                <Icon className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold text-xs tracking-widest uppercase mb-1">Được yêu thích nhất</p>
              <h2 className="font-heading text-2xl font-bold text-ink">Bán chạy</h2>
            </div>
            <Link href="/products" className="text-sm text-gold hover:underline flex items-center gap-1">
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
                <p className="text-gold text-xs tracking-widest uppercase mb-1">Mới về</p>
                <h2 className="font-heading text-2xl font-bold text-ink">Phát hành mới</h2>
              </div>
              <Link href="/products?sort=newest" className="text-sm text-gold hover:underline flex items-center gap-1">
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

      {/* Newsletter */}
      <section className="bg-charcoal text-white py-14 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold mb-1">Đăng ký nhận tin</h3>
            <p className="text-white/60 text-sm">Nhận thông tin về truyện mới, ưu đãi độc quyền dành riêng cho bạn.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 md:w-64 px-4 py-2.5 bg-white/10 border border-white/20 rounded-none text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold"
            />
            <button className="bg-gold hover:bg-gold/90 text-charcoal font-semibold text-sm px-5 py-2.5 transition-colors">
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
