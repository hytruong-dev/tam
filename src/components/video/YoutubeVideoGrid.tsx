"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Video, X, ExternalLink, Sparkles, Clock, Eye, Flame } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  description?: string | null;
  duration?: string | null;
}

interface YoutubeVideoGridProps {
  videos: VideoItem[];
}

export function YoutubeVideoGrid({ videos }: YoutubeVideoGridProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(videos[0] || null);

  const handlePlayVideo = (video: VideoItem) => {
    setActiveVideo(video);
    const playerEl = document.getElementById("featured-theater-player");
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-10">
      {/* Cinematic Theater Player Section */}
      {activeVideo && (
        <div id="featured-theater-player" className="bg-[#121622] rounded-3xl overflow-hidden border-2 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
          <div className="p-6 text-white bg-[#141824] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full text-[10px] font-extrabold mb-2 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <Video className="w-3.5 h-3.5 text-red-500" /> ĐANG PHÁT TRÊN THIENTAM YOUTUBE STUDIO 4K
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white">{activeVideo.title}</h2>
              {activeVideo.description && (
                <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 max-w-3xl leading-relaxed">
                  {activeVideo.description}
                </p>
              )}
            </div>
            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs whitespace-nowrap transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Mở trên YouTube <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Video Grid List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            Danh Sách Video Review Mô Hình ({videos.length})
          </h3>
          <span className="text-xs text-gray-400 font-semibold">Bấm chọn video để phát trực tiếp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const isPlaying = activeVideo?.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => handlePlayVideo(video)}
                className={`group cursor-pointer bg-[#141824] rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                  isPlaying
                    ? "border-red-500 ring-2 ring-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                    : "border-white/10 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                }`}
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
                        isPlaying ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]" : "bg-red-600/90 text-white"
                      }`}
                    >
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded shadow uppercase tracking-wider">
                      Đang phát
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>Review 4K</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-extrabold text-white text-sm line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{video.description}</p>
                  )}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <Video className="w-3 h-3" /> ThienTam Studio
                    </span>
                    <span className="font-bold text-gray-300 group-hover:text-white">Phát ngay →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}