"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@prisma/client";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const navigate = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  return (
    <div className="bg-[#141824] p-4 rounded-2xl border border-white/10 shadow-xl mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              navigate({ q: q || null });
            }}
          >
            <input
              name="q"
              defaultValue={searchParams.get("q") ?? ""}
              placeholder="Tìm kiếm tên mô hình, anime, nhân vật, series..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-white/15 rounded-xl bg-[#0B0E17] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E05638] focus:ring-1 focus:ring-[#E05638] transition-all"
            />
          </form>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[170px]">
            <Select
              defaultValue={searchParams.get("category") ?? "all"}
              onValueChange={(v) => navigate({ category: v === "all" ? null : v })}
            >
              <SelectTrigger className="w-full text-xs h-10 bg-[#0B0E17] border-white/15 text-white rounded-xl">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-[#141824] border-white/15 text-white">
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px]">
            <Select
              defaultValue={searchParams.get("sort") ?? "newest"}
              onValueChange={(v) => navigate({ sort: v === "newest" ? null : v })}
            >
              <SelectTrigger className="w-full text-xs h-10 bg-[#0B0E17] border-white/15 text-white rounded-xl">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="bg-[#141824] border-white/15 text-white">
                <SelectItem value="newest">Mới cập nhật</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Pill Bar for Mobile & iPad */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar border-t border-white/5">
        <button
          onClick={() => navigate({ category: null })}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
            !searchParams.get("category")
              ? "bg-[#E05638] text-white border-[#E05638] shadow-[0_0_10px_rgba(224,86,56,0.3)]"
              : "bg-[#0B0E17] text-gray-400 border-white/10 hover:text-white"
          }`}
        >
          Tất cả mô hình
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate({ category: cat.slug })}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
              searchParams.get("category") === cat.slug
                ? "bg-[#E05638] text-white border-[#E05638] shadow-[0_0_10px_rgba(224,86,56,0.3)]"
                : "bg-[#0B0E17] text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}