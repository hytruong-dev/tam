"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, Search, X, Heart, ShoppingBag, User as UserIcon, LogOut, Video, Sparkles, Flame, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Trang chủ", match: (p: string) => p === "/" },
  { href: "/products", label: "Shop Mô Hình", match: (p: string) => p.startsWith("/products") },
  { href: "/videos", label: "Video Review", match: (p: string) => p.startsWith("/videos"), badge: "HOT" },
  { href: "/community", label: "Cộng Đồng Collector", match: (p: string) => p.startsWith("/community") },
];

interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/customer-auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setUser(json.data);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleSearch = (e: React.FormEvent, isMobile = false) => {
    e.preventDefault();
    const input = isMobile ? mobileSearchRef.current : searchRef.current;
    const q = input?.value.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
      if (isMobile) setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/customer-auth/logout", { method: "POST" });
    setUser(null);
    toast.success("Đã đăng xuất");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E17]/95 backdrop-blur-xl text-white border-b border-white/10 shadow-2xl w-full">
      {/* Top Cyberpunk Neon Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-[#992211] via-[#E05638] to-[#992211] text-white py-1.5 px-3 sm:px-4 text-center text-xs font-bold tracking-wide border-b border-white/10 shadow-md">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/90">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
            <span>THIENTAM STUDIO — Cam kết 100% Figure Authentic & Đóng gói chống móp 3 lớp</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0 text-[10px] sm:text-[11px] truncate max-w-full">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse flex-shrink-0" />
            <span className="truncate">Kênh YouTube Review 4K Unbox Mô Hình Hot Nhất!</span>
            <Link href="/videos" className="underline text-yellow-300 hover:text-white font-extrabold ml-1 flex-shrink-0">
              Xem ngay →
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-white/90 font-mono">
            <span>Hotline: 1900 8888 29</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header Bar */}
      <div className="w-full">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Cyberpunk Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 font-bold font-heading tracking-tight hover:opacity-90 transition-all group flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E05638] via-red-600 to-[#7A1809] flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform border border-white/20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center leading-none">
                  <span className="text-[#E05638] font-extrabold text-lg sm:text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(224,86,56,0.5)]">
                    THIENTAM
                  </span>
                  <span className="text-white font-extrabold text-lg sm:text-2xl tracking-tight ml-1">
                    FIGURE
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-amber-400/80 font-bold leading-none mt-0.5 sm:mt-1 hidden sm:block">
                  CYBER & REVIEW STUDIO
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
              {navLinks.map((link) => {
                const active = link.match(pathname);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "transition-all duration-200 hover:text-[#E05638] relative py-1.5 flex items-center gap-1.5",
                      active
                        ? "text-[#E05638] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05638] after:shadow-[0_0_8px_#E05638]"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Glowing Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <form onSubmit={(e) => handleSearch(e, false)} className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Tìm mô hình, Gundam, One Piece, Hot Toys..."
                  className="w-full bg-[#141824] border border-white/15 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] focus:shadow-[0_0_15px_rgba(224,86,56,0.3)] transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Video Review Link - sm and up */}
              <Link
                href="/videos"
                className="hidden sm:flex flex-col items-center gap-0.5 text-gray-300 hover:text-red-500 transition-colors group"
                title="Kênh Video Youtube Review"
              >
                <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-red-400">Video Review</span>
              </Link>

              {/* Wishlist Link - sm and up */}
              <Link
                href="/products"
                className="hidden sm:flex flex-col items-center gap-0.5 text-gray-300 hover:text-[#E05638] transition-colors group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-[#E05638]">Yêu thích</span>
              </Link>

              {/* Cart Link - visible on mobile with badge */}
              <Link
                href="/products"
                className="flex flex-col items-center gap-0.5 text-gray-300 hover:text-[#E05638] transition-colors group relative px-1 sm:px-0"
                title="Giỏ hàng"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-white sm:text-gray-300 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1.5 -right-2 bg-[#E05638] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-red-900/50">
                    3
                  </span>
                </div>
                <span className="hidden sm:inline text-[10px] font-semibold text-gray-400 group-hover:text-[#E05638]">Giỏ hàng</span>
              </Link>

              {/* User Account Link - sm and up */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
                  <Link
                    href="/community"
                    className="flex flex-col items-center gap-0.5 text-gray-300 hover:text-[#E05638]"
                  >
                    <img
                      src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full border-2 border-[#E05638] object-cover shadow-[0_0_8px_rgba(224,86,56,0.5)]"
                    />
                    <span className="text-[10px] font-bold text-gray-200 line-clamp-1 max-w-[70px]">
                      {user.displayName}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white text-xs ml-1"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex flex-col items-center gap-0.5 text-gray-300 hover:text-[#E05638] transition-colors pl-2 border-l border-white/10"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold text-gray-400">Tài khoản</span>
                </Link>
              )}

              {/* Mobile menu trigger */}
              <button
                className="lg:hidden p-2 text-gray-300 hover:text-[#E05638] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-[#E05638]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & iPad 100% FULL SCREEN WIDTH Glass Drawer */}
      {mobileOpen && (
        <div className="lg:hidden w-full bg-[#0B0E17]/98 backdrop-blur-2xl border-t border-white/15 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="container mx-auto px-4 py-5 space-y-4 max-w-7xl">
            {/* Mobile Account Status Bar */}
            <div className="p-3 bg-[#141824] rounded-2xl border border-white/10 flex items-center justify-between">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full border-2 border-[#E05638] object-cover"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-white">{user.displayName}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">Collector Member</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-extrabold text-white hover:text-[#E05638] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E05638]/20 border border-[#E05638]/40 flex items-center justify-center text-[#E05638]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span>Đăng nhập / Đăng ký Tài khoản</span>
                </Link>
              )}

              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 text-xs font-extrabold rounded-lg border border-red-500/30 flex items-center gap-1 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                </button>
              )}
            </div>

            {/* Mobile Search Form */}
            <form onSubmit={(e) => handleSearch(e, true)} className="relative">
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Tìm mô hình, Gundam, One Piece, Hot Toys..."
                className="w-full bg-[#141824] border border-white/20 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "block text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-between font-bold border",
                    link.match(pathname)
                      ? "text-[#E05638] bg-[#E05638]/10 border-[#E05638]/40 shadow-[0_0_15px_rgba(224,86,56,0.2)]"
                      : "text-gray-200 hover:text-white bg-[#141824]/60 border-white/5 hover:border-white/20"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick Mobile Action Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
              <Link
                href="/videos"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 font-bold text-xs hover:bg-red-600/25 transition-all"
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>Video Review 4K</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Admin Studio</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}