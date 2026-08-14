"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
            placeholder="Tìm kiếm tên sách, tác giả..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </form>
      </div>

      {/* Category filter */}
      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(v) => navigate({ category: v === "all" ? null : v })}
      >
        <SelectTrigger className="w-full sm:w-48 bg-white">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onValueChange={(v) => navigate({ sort: v === "newest" ? null : v })}
      >
        <SelectTrigger className="w-full sm:w-44 bg-white">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="price-asc">Giá tăng dần</SelectItem>
          <SelectItem value="price-desc">Giá giảm dần</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
