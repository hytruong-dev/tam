import Link from "next/link";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0E17] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-[#141824] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(224,86,56,0.4)]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-6xl font-extrabold text-white tracking-wider">404</h1>
        <h2 className="font-heading text-xl font-bold text-gray-200">Trang Không Tồn Tại</h2>
        <p className="text-gray-400 text-xs leading-relaxed">
          Đường dẫn mô hình figure bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#E05638] hover:bg-[#E05638]/90 text-white font-extrabold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(224,86,56,0.4)] transition-all text-xs"
          >
            <Home className="w-4 h-4" /> Về Trang Chủ Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
