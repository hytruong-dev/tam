import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminVideoTable } from "@/components/admin/VideoTable";
import { findVideos } from "@/lib/repositories/video.repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý video | Admin" };

export default async function AdminVideosPage() {
  const { videos, total } = await findVideos({ activeOnly: false, limit: 50 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Video YouTube</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} video</p>
        </div>
        <Link
          href="/admin/videos/create"
          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-charcoal font-semibold text-sm px-3 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm video
        </Link>
      </div>

      <AdminVideoTable videos={videos} />
    </div>
  );
}
