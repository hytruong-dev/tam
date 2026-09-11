"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/common/Pagination";
import { formatPrice, formatDate } from "@/lib/utils";
import type { ProductWithCategory } from "@/lib/repositories/product.repository";
import { Pencil, Trash2, Search } from "lucide-react";

interface AdminProductTableProps {
  products: ProductWithCategory[];
  page: number;
  totalPages: number;
  query: string;
}

export function AdminProductTable({
  products,
  page,
  totalPages,
  query,
}: AdminProductTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Xóa sản phẩm thất bại");
        return;
      }
      toast.success(`Đã xóa "${name}"`);
      router.refresh();
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-[#141824] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Search bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0B0E17]/60">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Tìm kiếm sản phẩm, series, thương hiệu..."
            className="pl-10 bg-[#0B0E17] border-white/15 text-white placeholder:text-gray-500 rounded-xl focus:border-[#E05638] focus:ring-[#E05638]"
          />
        </form>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 bg-[#0B0E17]/80 hover:bg-[#0B0E17]/80">
              <TableHead className="w-16 pl-4 text-gray-400 font-extrabold uppercase text-[10px]">Ảnh</TableHead>
              <TableHead className="text-gray-400 font-extrabold uppercase text-[10px]">Tên sản phẩm mô hình</TableHead>
              <TableHead className="hidden sm:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Danh mục</TableHead>
              <TableHead className="text-right text-gray-400 font-extrabold uppercase text-[10px]">Giá bán</TableHead>
              <TableHead className="text-center hidden md:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Kho</TableHead>
              <TableHead className="hidden lg:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Trạng thái</TableHead>
              <TableHead className="hidden xl:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Ngày tạo</TableHead>
              <TableHead className="text-right pr-4 text-gray-400 font-extrabold uppercase text-[10px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  Chưa có sản phẩm mô hình nào.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-white/5 border-b border-white/5 transition-colors group">
                  <TableCell className="pl-4">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#0B0E17] border border-white/10 flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-sm text-white group-hover:text-[#E05638] transition-colors line-clamp-1">
                        {product.name}
                      </p>
                      {product.brand && (
                        <p className="text-[11px] text-gray-400">{product.brand}</p>
                      )}
                      <div className="flex gap-1.5 mt-1">
                        {product.isFeatured && (
                          <span className="text-[9px] font-extrabold bg-[#E05638]/20 border border-[#E05638]/40 text-[#E05638] px-1.5 py-0.5 rounded">
                            HOT
                          </span>
                        )}
                        {product.isNew && (
                          <span className="text-[9px] font-extrabold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-1.5 py-0.5 rounded">
                            MỚI
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs font-semibold text-gray-300">
                      {product.category?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-extrabold text-[#E05638] whitespace-nowrap">
                      {formatPrice(Number(product.price))}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <span className={`text-xs font-bold ${product.stock === 0 ? "text-red-400" : "text-emerald-400"}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        product.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      }`}
                    >
                      {product.isActive ? "Hiển thị" : "Ẩn"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs text-gray-400">{formatDate(product.createdAt)}</span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
                          disabled={deletingId === product.id}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#141824] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Xác nhận xóa sản phẩm mô hình</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Bạn có chắc chắn muốn xóa <strong>"{product.name}"</strong>? Thao tác này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/10 text-white hover:bg-white/20">
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              Xóa sản phẩm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 bg-[#0B0E17]/60">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
