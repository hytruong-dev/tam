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
import { Badge } from "@/components/ui/badge";
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
    <div className="bg-white rounded shadow-sm">
      {/* Search bar */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-9"
          />
        </form>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-ivory/50">
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead className="hidden sm:table-cell">Danh mục</TableHead>
              <TableHead className="text-right">Giá</TableHead>
              <TableHead className="text-center hidden md:table-cell">SL</TableHead>
              <TableHead className="hidden lg:table-cell">Trạng thái</TableHead>
              <TableHead className="hidden xl:table-cell">Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Không có sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-ivory/30">
                  <TableCell>
                    <div className="relative w-10 h-14 overflow-hidden bg-gray-100 flex-shrink-0">
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
                      <p className="font-medium text-sm text-ink line-clamp-1">{product.name}</p>
                      {product.author && (
                        <p className="text-xs text-muted-foreground">{product.author}</p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {product.isFeatured && (
                          <Badge variant="outline" className="text-[9px] border-gold/40 text-gold px-1 py-0">BÁN CHẠY</Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="outline" className="text-[9px] border-green-400 text-green-700 px-1 py-0">MỚI</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">{product.category.name}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-burgundy whitespace-nowrap">
                      {formatPrice(Number(product.price))}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <span className={`text-sm ${product.stock === 0 ? "text-destructive" : "text-ink"}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={product.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500"}
                    >
                      {product.isActive ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">{formatDate(product.createdAt)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger
                          className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-red-50 text-destructive transition-colors disabled:opacity-50"
                          disabled={deletingId === product.id}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa <strong>"{product.name}"</strong>? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90 text-white"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              Xóa
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
        <div className="p-4 border-t border-border">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
