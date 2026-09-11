"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  Tag,
  Video,
  LogOut,
  Users,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tag },
  { href: "/admin/videos", label: "Video 4K", icon: Video },
  { href: "/admin/community", label: "Kiểm duyệt", icon: MessageSquare },
  { href: "/admin/users", label: "Thành viên", icon: Users },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Đã đăng xuất tài khoản Admin");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E17]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Admin Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-heading font-extrabold text-lg text-white hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E05638] to-[#992211] flex items-center justify-center text-white shadow-[0_0_15px_rgba(224,86,56,0.4)] border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-base leading-none">
                  ThienTam <span className="text-[#E05638]">Admin</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold leading-none mt-1">
                  OPERATIONS STUDIO
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop & Tablet Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#141824] p-1.5 rounded-2xl border border-white/10">
            {adminNav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                    active
                      ? "bg-[#E05638] text-white shadow-[0_0_12px_rgba(224,86,56,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
            >
              <span>Xem Web Store</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-xl border border-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Mobile Admin Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#E05638]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer (100% FULL SCREEN WIDTH) */}
      {mobileOpen && (
        <div className="md:hidden w-full bg-[#0B0E17]/98 backdrop-blur-2xl border-t border-white/15 shadow-2xl">
          <div className="container mx-auto px-4 py-4 space-y-3 max-w-7xl">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {adminNav.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border",
                      active
                        ? "bg-[#E05638] text-white border-[#E05638] shadow-[0_0_10px_rgba(224,86,56,0.3)]"
                        : "bg-[#141824] text-gray-300 border-white/5 hover:border-white/20"
                    )}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-200"
              >
                Xem Web Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}