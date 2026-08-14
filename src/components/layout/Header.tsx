"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/products?category=truyen-tranh", label: "Truyện tranh" },
  { href: "/products?category=tieu-thuyet", label: "Tiểu thuyết" },
  { href: "/products", label: "Bộ sưu tập" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-heading text-xl font-bold tracking-wide hover:text-gold transition-colors"
          >
            <BookOpen className="w-6 h-6 text-gold" />
            <span>KAKU BOOKS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-gold",
                  pathname === link.href ? "text-gold border-b border-gold pb-0.5" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <form action="/products" method="get" className="flex items-center">
                  <input
                    autoFocus
                    name="q"
                    placeholder="Tìm truyện, tác giả..."
                    className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-gold w-48"
                  />
                </form>
                <button onClick={() => setSearchOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
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
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-white/80 hover:text-gold py-2 transition-colors"
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
