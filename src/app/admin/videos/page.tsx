import Link from "next/link";
import { Plus, Video } from "lucide-react";
import { AdminVideoTable } from "@/components/admin/VideoTable";
import { findVideos } from "@/lib/repositories/video.repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý Video YouTube 4K | ThienTam Admin" };

export default async function AdminVideosPage() {
  const { videos, total } = await findVideos({ activeOnly: false, limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-red-500 text-xs font-extrabold uppercase tracking-wider">
            <Video className="w-4 h-4" /> YOUTUBE REVIEW STUDIO 4K
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">Danh Sách Video Review</h1>
          <p className="text-gray-400 text-xs">Tổng cộng {total} video unbox & review xuất bản</p>
        </div>
        <Link
          href="/admin/videos/create"
          className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Thêm Video Review
        </Link>
      </div>

      <AdminVideoTable videos={videos} />
    </div>
  );
}
