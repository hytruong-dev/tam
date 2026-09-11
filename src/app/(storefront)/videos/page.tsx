import { YoutubeVideoGrid } from "@/components/video/YoutubeVideoGrid";
import { findVideos } from "@/lib/repositories/video.repository";
import { Video, Play, Sparkles, Tv, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kênh Video YouTube Review Mô Hình 4K | ThienTam Studio",
  description: "Tổng hợp video unboxing & đánh giá chi tiết Figure Anime, Gundam, Nendoroid, Statue cao cấp độc quyền từ ThienTam Studio.",
};

export default async function VideosPage() {
  const { videos } = await findVideos({ activeOnly: true, limit: 50 });

  return (
    <div className="bg-[#0B0E17] min-h-screen py-8 text-gray-100">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-[#0F131F] via-[#161B29] to-[#2B0F14] p-6 sm:p-8 rounded-3xl border border-red-500/30 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3.5 py-1 rounded-full text-red-400 text-xs font-extrabold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <Video className="w-4 h-4 text-red-500" /> KÊNH YOUTUBE OFFICIAL THIENTAM STUDIO
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Video Review & Unbox Mô Hình Chi Tiết 4K
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Trải nghiệm thực tế góc quay 4K cận cảnh đường nét sơn, khớp nối và biên độ cử động của các siêu phẩm Figure Anime, Gundam & Statue trước khi quyết định sưu tầm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-[#141824] border border-white/10 px-4 py-3 rounded-2xl text-center w-full sm:w-auto shadow-md">
              <p className="text-red-500 font-extrabold text-lg leading-none drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">100%</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">Hình ảnh thực tế</p>
            </div>
            <div className="bg-[#141824] border border-white/10 px-4 py-3 rounded-2xl text-center w-full sm:w-auto shadow-md">
              <p className="text-amber-400 font-extrabold text-lg leading-none drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">4K Ultra HD</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">Chất lượng sắc nét</p>
            </div>
          </div>
        </div>

        {/* Video List Section */}
        {videos.length === 0 ? (
          <div className="text-center py-20 bg-[#141824] rounded-3xl border border-white/10 shadow-xl">
            <Tv className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-semibold">Chưa có video review nào được tải lên.</p>
          </div>
        ) : (
          <YoutubeVideoGrid videos={videos} />
        )}
      </div>
    </div>
  );
}