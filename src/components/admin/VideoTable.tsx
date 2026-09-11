"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import type { Video } from "@prisma/client";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface AdminVideoTableProps {
  videos: Video[];
}

export function AdminVideoTable({ videos }: AdminVideoTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Xóa video thất bại");
        return;
      }
      toast.success(`Đã xóa "${title}"`);
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
              <TableHead className="w-28 pl-4 text-gray-400 font-extrabold uppercase text-[10px]">Thumbnail</TableHead>
              <TableHead className="text-gray-400 font-extrabold uppercase text-[10px]">Tiêu đề Video YouTube Review</TableHead>
              <TableHead className="hidden md:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Trạng thái</TableHead>
              <TableHead className="hidden lg:table-cell text-gray-400 font-extrabold uppercase text-[10px]">Ngày tạo</TableHead>
              <TableHead className="text-right pr-4 text-gray-400 font-extrabold uppercase text-[10px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                  Chưa có video review nào.
                </TableCell>
              </TableRow>
            ) : (
              videos.map((vid) => (
                <TableRow key={vid.id} className="hover:bg-white/5 border-b border-white/5 transition-colors group">
                  <TableCell className="pl-4">
                    <div className="relative w-20 h-12 overflow-hidden bg-[#0B0E17] rounded-xl border border-white/10 flex-shrink-0">
                      <Image
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                        alt={vid.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {vid.title}
                      </p>
                      {vid.description && (
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                          {vid.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        vid.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      }`}
                    >
                      {vid.isActive ? "Hiển thị" : "Ẩn"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-gray-400">
                      {formatDate(vid.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                        title="Xem trên YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/admin/videos/${vid.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
                          disabled={deletingId === vid.id}
                          title="Xóa video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#141824] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Xác nhận xóa video review</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Bạn có chắc muốn xóa video <strong>"{vid.title}"</strong>? Thao tác này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/10 text-white hover:bg-white/20">Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(vid.id, vid.title)}
                            >
                              Xóa video
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
