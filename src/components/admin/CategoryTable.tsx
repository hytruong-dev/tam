"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatDate } from "@/lib/utils";
import type { Category } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";

interface AdminCategoryTableProps {
  categories: Category[];
}

export function AdminCategoryTable({ categories }: AdminCategoryTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Xóa danh mục thất bại");
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 bg-[#0B0E17]/80 hover:bg-[#0B0E17]/80">
              <TableHead className="pl-4 text-gray-400 font-extrabold uppercase text-[10px]">Tên danh mục mô hình</TableHead>
              <TableHead className="text-gray-400 font-extrabold uppercase text-[10px]">Slug định danh</TableHead>
              <TableHead className="hidden md:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Ngày khởi tạo</TableHead>
              <TableHead className="text-right pr-4 text-gray-400 font-extrabold uppercase text-[10px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                  Chưa có danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-white/5 border-b border-white/5 transition-colors group">
                  <TableCell className="pl-4">
                    <p className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{cat.name}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-[#0B0E17] px-2.5 py-1 rounded-md text-amber-300 font-mono border border-white/10">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-gray-400">
                      {formatDate(cat.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
                          disabled={deletingId === cat.id}
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#141824] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Xác nhận xóa danh mục</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Bạn có chắc muốn xóa danh mục <strong>"{cat.name}"</strong>? Thao tác này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/10 text-white hover:bg-white/20">Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(cat.id, cat.name)}
                            >
                              Xóa danh mục
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
    </div>
  );
}
