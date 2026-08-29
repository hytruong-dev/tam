"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, Search, X, Box, User as UserIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Trang chủ", match: (p: string) => p === "/" },
  { href: "/products", label: "Mô hình", match: (p: string) => p.startsWith("/products") },
  { href: "/videos", label: "Video", match: (p: string) => p.startsWith("/videos") },
  { href: "/community", label: "Cộng đồng", match: (p: string) => p.startsWith("/community") },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/customer-auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setUser(json.data);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    }
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/customer-auth/logout", { method: "POST" });
    setUser(null);
    toast.success("Đã đăng xuất");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-heading text-xl font-bold tracking-wide hover:text-gold transition-colors"
          >
            <Box className="w-6 h-6 text-gold" />
            <span>ThienTam</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-gold",
                  link.match(pathname) ? "text-gold border-b border-gold pb-0.5" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  ref={searchRef}
                  autoFocus
                  placeholder="Tìm mô hình, anime..."
                  className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-gold w-48"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Auth / Profile */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 border-l border-white/20 pl-4">
                <img
                  src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full border border-gold object-cover"
                />
                <span className="text-xs font-semibold text-white/90">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="text-white/50 hover:text-white text-xs ml-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-4">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-white/80 hover:text-gold transition-colors"
                >
                  Đăng nhập
                </Link>
                <span className="text-white/30 text-xs">/</span>
                <Link
                  href="/auth/register"
                  className="text-xs font-semibold text-copper hover:text-white transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white/70 hover:text-gold"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "block text-sm py-2.5 px-2 rounded transition-colors",
                  link.match(pathname)
                    ? "text-gold bg-white/5"
                    : "text-white/80 hover:text-gold hover:bg-white/5"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-gold">{user.displayName}</span>
                  <button onClick={handleLogout} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 text-xs font-semibold">
                  <Link href="/auth/login" className="text-white hover:text-gold">
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" className="text-copper hover:text-white">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
