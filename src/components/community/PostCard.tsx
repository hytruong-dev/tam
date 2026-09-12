"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, MessageSquare, Flag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PostWithAuthorAndMedia } from "@/lib/repositories/community.repository";

interface PostCardProps {
  post: PostWithAuthorAndMedia;
  currentUserId?: string;
  onDeleted?: (id: string) => void;
}

export function PostCard({ post, currentUserId, onDeleted }: PostCardProps) {
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập để thả tim");
      return;
    }
    if (isLiking) return;

    try {
      setIsLiking(true);
      const res = await fetch("/api/community/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "POST", targetId: post.id }),
      });
      const json = await res.json();
      if (res.ok) {
        setLiked(json.data.reacted);
        setLikeCount(json.data.count);
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReport = async () => {
    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập để báo cáo");
      return;
    }
    const reason = prompt("Nhập lý do báo cáo bài viết này (Spam, nội dung xấu, vi phạm...):");
    if (!reason?.trim()) return;

    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "POST", targetId: post.id, reason }),
      });
      if (res.ok) {
        toast.success("Cảm ơn bạn đã gửi báo cáo. Ban quản trị sẽ xem xét sớm.");
      } else {
        toast.error("Gửi báo cáo thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa bài viết");
        if (onDeleted) onDeleted(post.id);
      } else {
        toast.error("Không thể xóa bài viết");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-[#141824] rounded-3xl border border-white/10 p-5 sm:p-6 mb-5 shadow-xl text-white hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full border-2 border-[#E05638] object-cover shadow-[0_0_8px_rgba(224,86,56,0.4)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm">{post.author.displayName}</span>
              {post.author.role === "ADMIN" && (
                <Badge className="bg-[#E05638] text-white text-[9px] px-1.5 py-0 font-extrabold">ADMIN</Badge>
              )}
              {post.author.role === "MODERATOR" && (
                <Badge className="bg-amber-500 text-black text-[9px] px-1.5 py-0 font-extrabold">MOD</Badge>
              )}
            </div>
            <span className="text-[10px] text-gray-400">{formattedDate}</span>
          </div>
        </div>

        {post.topic && (
          <Badge variant="outline" className="text-[#E05638] border-[#E05638]/40 text-xs bg-[#E05638]/10 font-bold">
            #{post.topic}
          </Badge>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

      {/* Media images */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl overflow-hidden">
          {post.media.map((item) => (
            <img
              key={item.id}
              src={item.url}
              alt="Post image"
              className="w-full h-52 object-cover rounded-xl border border-white/10"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors font-semibold ${
              liked ? "text-red-500 font-extrabold" : "hover:text-red-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likeCount} Thích</span>
          </button>

          <Link
            href={`/community/posts/${post.id}`}
            className="flex items-center gap-1.5 hover:text-[#E05638] transition-colors font-semibold"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post._count.comments} Bình luận</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {currentUserId === post.author.id && (
            <button onClick={handleDelete} className="hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleReport} className="hover:text-amber-400 transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
