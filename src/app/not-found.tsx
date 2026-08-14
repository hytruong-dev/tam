import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <BookOpen className="w-16 h-16 text-gold mx-auto mb-4" />
        <h1 className="font-heading text-5xl font-bold text-ink mb-2">404</h1>
        <h2 className="font-heading text-xl font-semibold text-ink mb-3">Trang không tồn tại</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="inline-flex items-center bg-charcoal hover:bg-charcoal/90 text-ivory font-semibold px-6 py-2.5 transition-colors text-sm">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
