"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tv, Package, Tag, Video, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Đã đăng xuất");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-charcoal text-white shadow-md">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-lg hover:text-gold transition-colors"
          >
            <Tv className="w-5 h-5 text-gold" />
            KAKU
          </Link>
          <span className="text-white/30">|</span>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold transition-colors"
          >
            <Package className="w-4 h-4" />
            Sản phẩm
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold transition-colors"
          >
            <Tag className="w-4 h-4" />
            Danh mục
          </Link>
          <Link
            href="/admin/videos"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold transition-colors"
          >
            <Video className="w-4 h-4" />
            Video
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white/60 hover:text-white hover:bg-white/10 text-xs gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng xuất
        </Button>
      </div>
    </header>
  );
}
