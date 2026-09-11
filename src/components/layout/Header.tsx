"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  X,
  Heart,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Video,
  Sparkles,
  Flame,
  ShieldCheck,
  Package,
  MessageSquare,
  ChevronRight,
  Settings,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Trang chủ", icon: Sparkles, match: (p: string) => p === "/" },
  { href: "/products", label: "Shop Mô Hình", icon: Package, match: (p: string) => p.startsWith("/products") },
  { href: "/videos", label: "Video Review 4K", icon: Video, match: (p: string) => p.startsWith("/videos"), badge: "HOT" },
  { href: "/community", label: "Cộng Đồng Collector", icon: MessageSquare, match: (p: string) => p.startsWith("/community") },
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

  // Lock body scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

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
    toast.success("Đã đăng xuất tài khoản");
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
              {/* Video Review Link */}
              <Link
                href="/videos"
                className="hidden sm:flex flex-col items-center gap-0.5 text-gray-300 hover:text-red-500 transition-colors group"
                title="Kênh Video Youtube Review"
              >
                <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-red-400">Video Review</span>
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/products"
                className="hidden sm:flex flex-col items-center gap-0.5 text-gray-300 hover:text-[#E05638] transition-colors group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-[#E05638]">Yêu thích</span>
              </Link>

              {/* Cart Link */}
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

              {/* User Account Link */}
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
                onClick={() => setMobileOpen(true)}
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FREUD / MODERN FLOATING CARD MOBILE DRAWER WITH BODY SCROLL LOCK */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-hidden">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

          {/* Floating Card Container */}
          <div className="relative w-full max-w-sm bg-[#141824] border border-white/15 rounded-[32px] overflow-hidden shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[85vh] sm:max-h-[88vh]">
            {/* Top Banner Header Card with Rounded Bottom */}
            <div className="bg-gradient-to-br from-[#661508] via-[#992211] to-[#E05638] p-5 text-center text-white relative rounded-b-[28px] shadow-lg flex-shrink-0">
              {/* Brand Logo Top Left */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span className="text-xs font-extrabold font-heading tracking-tight text-white">thientam</span>
              </div>

              {/* Close Button Top Right */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 transition-all"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>

              {/* User Avatar Circle */}
              <div className="mt-4 mb-2 flex justify-center">
                <img
                  src={
                    user
                      ? user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"
                      : "https://api.dicebear.com/7.x/avataaars/svg?seed=Shinomiya"
                  }
                  alt={user ? user.displayName : "Shinomiya Kaguya"}
                  className="w-14 h-14 rounded-full border-4 border-white/30 object-cover shadow-2xl bg-[#0B0E17]"
                />
              </div>

              {/* User Name & Mindful Subtitle */}
              <h3 className="text-base font-extrabold text-white tracking-tight leading-tight">
                {user ? user.displayName : "Shinomiya Kaguya"}
              </h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">
                {user ? "Authentic Collector Member" : "You are being mindful."}
              </p>
            </div>

            {/* Menu Links & Content Body (Inner Scrollable) */}
            <div className="px-5 py-4 space-y-4 overflow-y-auto text-xs font-semibold flex-1">
              {/* Mobile Search Input */}
              <form onSubmit={(e) => handleSearch(e, true)} className="relative mb-2">
                <input
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="Tìm mô hình, Gundam, One Piece..."
                  className="w-full bg-[#0B0E17] border border-white/15 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Section 1: General (Tùy chọn chung) */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                  General
                </p>
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const active = link.match(pathname);
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all font-bold text-xs border",
                          active
                            ? "bg-white/10 text-white border-white/20 shadow-md backdrop-blur-md"
                            : "text-gray-300 hover:text-white border-transparent hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-4 h-4", active ? "text-[#E05638]" : "text-gray-400")} />
                          <span>{link.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {link.badge && (
                            <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                              {link.badge}
                            </span>
                          )}
                          {active && (
                            <span className="text-xs" title="Selected">
                              👆
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 my-2" />

              {/* Section 2: Profile & Management */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                  Profile
                </p>
                <div className="space-y-1">
                  <Link
                    href="/community"
                    onClick={() => setMobileOpen(false)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Hội Viên Collector</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    <span>Admin Operations Studio</span>
                  </Link>
                </div>
              </div>

              {/* Sign Out Button */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left text-red-400 hover:text-red-300 font-bold px-3.5 py-2.5 flex items-center gap-3 rounded-xl hover:bg-red-600/10 transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-left text-[#E05638] hover:text-[#E05638]/90 font-bold px-3.5 py-2.5 flex items-center gap-3 rounded-xl hover:bg-[#E05638]/10 transition-colors mt-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Đăng nhập / Đăng ký Account</span>
                </Link>
              )}
            </div>

            {/* Bottom Floating Action Pills (Fixed Bottom) */}
            <div className="p-3.5 bg-[#0B0E17]/90 border-t border-white/10 flex items-center justify-between gap-2.5 flex-shrink-0">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center bg-[#8EA85B] hover:bg-[#7e974e] text-white font-extrabold py-2.5 px-4 rounded-full text-xs shadow-lg flex items-center justify-center gap-1 transition-all"
              >
                <span>Go Pro</span>
                <Sparkles className="w-3 h-3 text-white" />
              </Link>
              <Link
                href="/videos"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2.5 px-3 rounded-full text-xs transition-colors truncate"
              >
                Rate Our App
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}