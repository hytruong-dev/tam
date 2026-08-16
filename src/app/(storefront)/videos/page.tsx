"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export const dynamic = "force-dynamic";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  description: string | null;
  createdAt: string;
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded"
        />
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }: { video: Video; onPlay: (id: string) => void }) {
  return (
    <div className="group cursor-pointer" onClick={() => onPlay(video.youtubeId)}>
      <div className="relative aspect-video overflow-hidden rounded bg-black">
        <Image
          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-ink text-sm line-clamp-2 group-hover:text-gold transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos?active=true&limit=50")
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.videos) setVideos(json.data.videos);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {activeVideoId && (
        <VideoModal videoId={activeVideoId} onClose={() => setActiveVideoId(null)} />
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-gold text-xs tracking-widest uppercase mb-1">Kênh YouTube</p>
          <h1 className="font-heading text-3xl font-bold text-ink">Video Review</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Xem review chi tiết các mô hình figure, Nendoroid và Gundam
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Chưa có video nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setActiveVideoId} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
