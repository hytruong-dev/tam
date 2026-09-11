"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Headphones, CreditCard, Award, Video, Box, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#070910] text-gray-400 mt-auto border-t border-white/10">
      {/* Policy highlights bar */}
      <div className="border-b border-white/10 py-7 bg-[#0B0E17]/80">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 bg-[#141824]/60 p-3.5 rounded-xl border border-white/5 hover:border-[#E05638]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#E05638]/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#E05638]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">100% Authentic Figure</h5>
                <p className="text-[11px] text-gray-400">Bandai, Good Smile, Hot Toys</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#141824]/60 p-3.5 rounded-xl border border-white/5 hover:border-red-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-600/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">YouTube Review 4K</h5>
                <p className="text-[11px] text-gray-400">Video unbox & đánh giá thực tế</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#141824]/60 p-3.5 rounded-xl border border-white/5 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Đóng Gói 3 Lớp Xốp</h5>
                <p className="text-[11px] text-gray-400">Chống móp góc hộp 100%</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#141824]/60 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Cộng Đồng 50K+ Member</h5>
                <p className="text-[11px] text-gray-400">Giao lưu góc trưng bày & săn deal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex items-center leading-none">
                <span className="text-[#E05638] font-extrabold text-xl tracking-tighter">THIENTAM</span>
                <span className="text-white font-extrabold text-xl tracking-tight ml-1">FIGURE</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              ThienTam Figure Studio – Hệ sinh thái mô hình Anime, Gundam, Statue cao cấp kết hợp kênh YouTube Review 4K độc quyền cho Collector Việt Nam.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Link
                href="/videos"
                className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="Kênh YouTube ThienTam Studio"
              >
                <Video className="w-4 h-4" />
              </Link>
              <span className="w-9 h-9 rounded-xl bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center hover:bg-[#E05638] hover:text-white transition-all cursor-pointer text-xs font-bold">
                FB
              </span>
              <span className="w-9 h-9 rounded-xl bg-white/5 text-gray-300 border border-white/10 flex items-center justify-center hover:bg-[#E05638] hover:text-white transition-all cursor-pointer text-xs font-bold">
                IG
              </span>
            </div>
          </div>

          {/* Về ThienTam */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Về ThienTam Studio</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="hover:text-[#E05638] transition-colors">Giới thiệu Showroom</Link></li>
              <li><Link href="/videos" className="hover:text-[#E05638] transition-colors">Kênh YouTube Studio</Link></li>
              <li><Link href="/community" className="hover:text-[#E05638] transition-colors">Diễn Đàn Collector</Link></li>
              <li><Link href="/" className="hover:text-[#E05638] transition-colors">Điều khoản & Bảo mật</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Hỗ trợ Collector</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products" className="hover:text-[#E05638] transition-colors">Hướng dẫn Pre-order</Link></li>
              <li><Link href="/" className="hover:text-[#E05638] transition-colors">Quy trình bọc hàng 3 lớp</Link></li>
              <li><Link href="/" className="hover:text-[#E05638] transition-colors">Chính sách đổi trả 7 ngày</Link></li>
              <li><Link href="/" className="hover:text-[#E05638] transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
            </ul>
          </div>

          {/* Danh mục Mô Hình */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Danh mục Mô Hình</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products?category=anime" className="hover:text-[#E05638] transition-colors">Anime Figure Scale</Link></li>
              <li><Link href="/products?category=mecha" className="hover:text-[#E05638] transition-colors">Mecha & Gundam Model Kit</Link></li>
              <li><Link href="/products?category=marvel" className="hover:text-[#E05638] transition-colors">Marvel & Movie Statues</Link></li>
              <li><Link href="/products?category=game" className="hover:text-[#E05638] transition-colors">Game Characters</Link></li>
              <li><Link href="/products?category=blind-box" className="hover:text-[#E05638] transition-colors">Blind Box & Nendoroid</Link></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Thông tin liên hệ</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E05638] mt-0.5 flex-shrink-0" />
                <span>Showroom: 12 Đường Sưu Tầm, P.10, Q.10, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E05638] flex-shrink-0" />
                <span>Hotline: 1900 8888 29</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E05638] flex-shrink-0" />
                <span>contact@thientamfigure.vn</span>
              </li>
            </ul>

            <h4 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">Đăng ký nhận tin</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full bg-[#141824] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
              />
              <button className="bg-[#E05638] hover:bg-[#E05638]/90 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-red-900/30">
                Gửi
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom copyright */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 ThienTam Figure Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-300">
              100% AUTHENTIC GUARANTEE
            </span>
            <span className="bg-red-600/80 text-white px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-sm">
              YOUTUBE VERIFIED CHANNEL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}