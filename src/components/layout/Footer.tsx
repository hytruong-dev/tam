import Link from "next/link";
import { Tv } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-heading text-lg font-bold mb-3">
              <Tv className="w-5 h-5 text-gold" />
              KAKU
            </Link>
            <p className="text-sm leading-relaxed">
              Shop mô hình anime & figure chính hãng. Cập nhật video review mới nhất mỗi tuần.
            </p>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Danh mục</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=figure" className="hover:text-gold transition-colors">Figure</Link></li>
              <li><Link href="/products?category=nendoroid" className="hover:text-gold transition-colors">Nendoroid</Link></li>
              <li><Link href="/products?category=gundam" className="hover:text-gold transition-colors">Gundam / Model Kit</Link></li>
              <li><Link href="/products?category=funko-pop" className="hover:text-gold transition-colors">Funko Pop</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors">Tất cả sản phẩm</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Hướng dẫn đặt hàng</span></li>
              <li><span className="cursor-default">Chính sách giao hàng</span></li>
              <li><span className="cursor-default">Chính sách đổi trả</span></li>
              <li><span className="cursor-default">Câu hỏi thường gặp</span></li>
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Kết nối</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/videos" className="hover:text-gold transition-colors">Video review</Link></li>
              <li><span className="cursor-default">Giới thiệu</span></li>
              <li><span className="cursor-default">Liên hệ</span></li>
              <li><span className="cursor-default">Tuyển dụng</span></li>
            </ul>
            <div className="flex gap-3 mt-5">
              {["FB", "YT", "TK", "IG"].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] cursor-pointer hover:border-gold hover:text-gold transition-colors font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2024 Kaku. All rights reserved.</p>
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
