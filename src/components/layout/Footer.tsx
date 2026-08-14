import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-heading text-lg font-bold mb-3">
              <BookOpen className="w-5 h-5 text-gold" />
              KAKU BOOKS
            </Link>
            <p className="text-sm leading-relaxed">
              Nhà sách trực tuyến chuyên về manga và tiểu thuyết đồ họa tuyển chọn.
            </p>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Danh mục</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=truyen-tranh" className="hover:text-gold transition-colors">Truyện tranh</Link></li>
              <li><Link href="/products?category=tieu-thuyet" className="hover:text-gold transition-colors">Tiểu thuyết</Link></li>
              <li><Link href="/products?category=tam-ly-lang-man" className="hover:text-gold transition-colors">Tâm lý, Lãng mạn</Link></li>
              <li><Link href="/products?category=gia-tuong-ky-ao" className="hover:text-gold transition-colors">Giả tưởng, Kỳ ảo</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors">Bộ sưu tập</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Hướng dẫn mua hàng</span></li>
              <li><span className="cursor-default">Chính sách giao hàng</span></li>
              <li><span className="cursor-default">Chính sách đổi trả</span></li>
              <li><span className="cursor-default">Câu hỏi thường gặp</span></li>
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Giới thiệu</span></li>
              <li><span className="cursor-default">Tin tức</span></li>
              <li><span className="cursor-default">Tuyển dụng</span></li>
              <li><span className="cursor-default">Liên hệ</span></li>
            </ul>
            <div className="flex gap-3 mt-5">
              {["f", "ig", "yt", "tk"].map((s) => (
                <span key={s} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs cursor-pointer hover:border-gold hover:text-gold transition-colors uppercase">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2024 Kaku Books. All rights reserved.</p>
          <div className="flex gap-4">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>MoMo</span>
            <span>ZaloPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
