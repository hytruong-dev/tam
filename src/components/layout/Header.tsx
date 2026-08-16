"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, Search, X, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Trang chủ", match: (p: string) => p === "/" },
  { href: "/products", label: "Mô hình", match: (p: string) => p === "/products" },
  { href: "/videos", label: "Video", match: (p: string) => p === "/videos" },
  { href: "/products?sort=newest", label: "Bộ sưu tập", match: (_p: string) => false },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    }
    setSearchOpen(false);
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
            <Tv className="w-6 h-6 text-gold" />
            <span>KAKU</span>
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
          </div>
        )}
      </div>
    </header>
  );
}
