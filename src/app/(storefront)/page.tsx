import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ChevronRight, ShieldCheck, Truck, Sparkles, MessageSquare, Tag, Video, Flame, Award, Heart, Star } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/services/product.service";
import { findVideos } from "@/lib/repositories/video.repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ThienTam Figure Studio — Shop Mô Hình Figure Dark Cyberpunk & Video Review",
  description: "Shop mô hình Anime Figure, Gundam, Statue chính hãng 100% Authentic, video review unbox YouTube 4K và diễn đàn Collector Việt Nam.",
};

const categoryBadges = [
  { name: "Tất cả Figure", icon: "✨", slug: "" },
  { name: "Anime Figure", icon: "🌀", slug: "anime" },
  { name: "Mecha & Gundam", icon: "🤖", slug: "mecha" },
  { name: "Marvel & Movie", icon: "⭐", slug: "marvel" },
  { name: "Game Characters", icon: "🎮", slug: "game" },
  { name: "Blind Box & Nendoroid", icon: "🎁", slug: "blind-box" },
];

export default async function HomePage() {
  const [featuredResult, newResult, videoResult] = await Promise.all([
    getProducts({ page: 1, limit: 8, featured: true }, false),
    getProducts({ page: 1, limit: 6, isNew: true }, false),
    findVideos({ activeOnly: true, limit: 3 }),
  ]);

  const featuredProducts = featuredResult.products;
  const newProducts = newResult.products;
  const videos = videoResult.videos;
  const mainVideo = videos[0];

  return (
    <div className="bg-[#0B0E17] text-gray-100 min-h-screen">
      {/* Hero Banner Section (Cyberpunk 3D Glow) */}
      <section className="bg-[#090C14] text-white pt-10 pb-16 px-4 relative overflow-hidden border-b border-white/10">
        {/* Background neon glow spheres */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E05638]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E05638]/15 border border-[#E05638]/40 px-4 py-1.5 rounded-full text-xs text-[#E05638] font-extrabold tracking-wide shadow-[0_0_15px_rgba(224,86,56,0.3)]">
                <Flame className="w-4 h-4 animate-pulse text-[#E05638]" />
                <span>CYBERPUNK FIGURE & YOUTUBE STUDIO</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Thế Giới Figure <br />
                <span className="bg-gradient-to-r from-[#E05638] via-amber-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(224,86,56,0.4)]">
                  Đam Mê Hóa Bộ Sưu Tập
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg">
                ThienTam Studio cung cấp mô hình Figure Anime, Gundam, Statue chính hãng 100% Authentic. Kết hợp kênh YouTube Video Review Unbox 4K góc quay sắc nét cho Collector.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold px-7 py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(224,86,56,0.4)] hover:scale-105"
                >
                  Săn Mô Hình Ngay <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all backdrop-blur-md group shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span>Xem YouTube Review 4K</span>
                </Link>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-6 border-t border-white/10 max-w-lg">
                <div className="flex items-center gap-2 bg-[#141824]/60 p-2.5 rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-[#E05638]" />
                  <div>
                    <p className="text-[11px] font-bold text-white">Chính Hãng 100%</p>
                    <p className="text-[10px] text-gray-400">Full Box Authentic</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#141824]/60 p-2.5 rounded-xl border border-white/5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-[11px] font-bold text-white">Bọc Xốp Nổ 3 Lớp</p>
                    <p className="text-[10px] text-gray-400">Chống móp hộp</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#141824]/60 p-2.5 rounded-xl border border-white/5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-[11px] font-bold text-white">Pre-Order Chuẩn</p>
                    <p className="text-[10px] text-gray-400">Cập nhật nhanh nhất</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Banner Hero Image with Neon Frame */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] max-w-xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(224,86,56,0.3)] border-2 border-[#E05638]/50 group">
                <Image
                  src="/images/hero-gundam.jpg"
                  alt="ThienTam Hero Gundam Figure Studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div>
                    <span className="bg-[#E05638] text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(224,86,56,0.5)]">
                      Siêu Phẩm Nổi Bật
                    </span>
                    <h3 className="text-white text-base font-extrabold mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      MGEX 1/100 Strike Freedom Gundam
                    </h3>
                  </div>
                  <Link
                    href="/products/gundam-mgex-strike-freedom"
                    className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#E05638] transition-colors border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-10 max-w-7xl space-y-12">
        {/* Category Badges Filter Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto py-2 px-1 max-w-full no-scrollbar">
          {categoryBadges.map((cat) => (
            <Link
              key={cat.name}
              href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
              className="flex items-center gap-2 bg-[#141824] hover:bg-[#E05638] hover:text-white px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold transition-all whitespace-nowrap group hover:border-[#E05638] hover:shadow-[0_0_15px_rgba(224,86,56,0.4)]"
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* SECTION: Featured Products Grid */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#E05638] text-xs font-extrabold uppercase tracking-wider drop-shadow-[0_0_8px_rgba(224,86,56,0.4)]">
                <Sparkles className="w-4 h-4 text-amber-400" /> MÔ HÌNH NỔI BẬT
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Figure & Model Kit Hot Nhất
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#E05638] hover:underline flex items-center gap-1"
            >
              Xem tất cả mô hình <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-[#141824] p-12 text-center rounded-2xl border border-white/10 text-gray-400">
              Chưa có sản phẩm mô hình nổi bật nào.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION: YOUTUBE VIDEO REVIEW STUDIO SPOTLIGHT */}
        <section className="bg-gradient-to-br from-[#0F131F] via-[#161B29] to-[#241014] rounded-3xl p-6 lg:p-10 text-white shadow-2xl relative overflow-hidden border border-red-500/30">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 relative z-10 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3.5 py-1 rounded-full text-red-400 text-xs font-extrabold mb-2 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <Video className="w-4 h-4 text-red-500" /> THIENTAM YOUTUBE REVIEW STUDIO
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Video Review Unbox Mô Hình Chi Tiết 4K
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Trải nghiệm cận cảnh chi tiết khớp nối, đường sơn mạ vàng và biên độ cử động của các siêu phẩm Figure trước khi chốt đơn.
              </p>
            </div>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105"
            >
              Kênh Video Review <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Main Video Highlight */}
            <div className="lg:col-span-7 bg-[#141824] rounded-2xl overflow-hidden border border-red-500/30 group shadow-xl">
              <Link href="/videos" className="block relative aspect-video bg-black">
                <Image
                  src={
                    mainVideo
                      ? `https://img.youtube.com/vi/${mainVideo.youtubeId}/hqdefault.jpg`
                      : "/images/video-freedom-thumb.jpg"
                  }
                  alt={mainVideo ? mainVideo.title : "Review MGEX Strike Freedom Gundam"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform border border-white/20">
                    <Play className="w-7 h-7 text-white ml-1 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-white/10">
                  FULL HD 4K REVIEW
                </div>
              </Link>
              <div className="p-5">
                <h3 className="font-extrabold text-base text-white group-hover:text-red-400 transition-colors line-clamp-2">
                  {mainVideo ? mainVideo.title : "Review MGEX 1/100 Strike Freedom Gundam - Siêu Phẩm Mạ Vàng"}
                </h3>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {mainVideo
                    ? mainVideo.description
                    : "Đánh giá chi tiết bộ khung kim loại mạ vàng 3 lớp và khả năng cử động biên độ cao của MGEX Strike Freedom."}
                </p>
              </div>
            </div>

            {/* Side Video List */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {videos.length > 1 ? (
                videos.slice(1, 4).map((vid) => (
                  <Link
                    key={vid.id}
                    href="/videos"
                    className="flex gap-3 bg-[#141824] p-3 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-[#1c2233] transition-all group"
                  >
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <Image
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        fill
                        sizes="112px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-3 h-3 text-white ml-0.5 fill-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                        {vid.description || "Video unbox & review chất lượng cao."}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3 bg-[#141824] p-3 rounded-xl border border-white/10">
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <Image src="/images/luffy-gear5.png" alt="Luffy Gear 5" fill sizes="112px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-2">Review Luffy Gear 5 Kaido Battle</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Trận chiến Đảo Quỷ Wano Kuni</p>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-[#141824] p-3 rounded-xl border border-white/10">
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <Image src="/images/ironman-mark85.png" alt="Iron Man Mark 85" fill sizes="112px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-2">Unbox Hot Toys Iron Man Mark 85 Diecast</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Siêu phẩm Avenger Endgame</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-red-600/10 border border-red-500/30 p-4 rounded-xl text-center">
                <p className="text-xs text-gray-200 font-bold">Đăng ký kênh YouTube ThienTam Studio</p>
                <Link
                  href="/videos"
                  className="inline-block text-xs font-extrabold text-red-400 hover:text-white mt-1 underline"
                >
                  Xem thêm 20+ video review khác →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: New Arrivals Figure */}
        {newProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <Tag className="w-4 h-4" /> MỚI VỀ KHO
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Mô Hình Figure Cập Nhật Mới
                </h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="text-xs font-bold text-[#E05638] hover:underline flex items-center gap-1"
              >
                Xem tất cả hàng mới <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Collector Community Forum */}
        <section className="bg-[#141824] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#E05638]/15 border border-[#E05638]/30 text-[#E05638] text-xs font-extrabold px-3.5 py-1 rounded-full">
                <MessageSquare className="w-4 h-4" /> DIỄN ĐÀN COLLECTOR THIENTAM
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Khoe Góc Trưng Bày & Thảo Luận Sưu Tầm!
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Tham gia cộng đồng cùng hơn 50.000 Collector Việt Nam: Đăng tải ảnh tủ trưng bày figure, viết bài đánh giá chất lượng sơn và săn deal độc quyền từ các hội nhóm.
              </p>
              <div className="pt-2">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(224,86,56,0.4)]"
                >
                  Tham Gia Diễn Đàn Ngay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black shadow-xl border border-white/10">
                <Image src="/images/luffy-gear5.png" alt="Góc khoe mô hình" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex items-end">
                  <span className="text-white text-[10px] font-extrabold">#ShowGocTrungBay</span>
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black shadow-xl border border-white/10">
                <Image src="/images/naruto-community.png" alt="Cộng đồng Naruto" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex items-end">
                  <span className="text-white text-[10px] font-extrabold">#ReviewFigure</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}