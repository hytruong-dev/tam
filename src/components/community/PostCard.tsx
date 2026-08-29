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
    <div className="bg-white rounded border border-border p-5 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full border border-border object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink text-sm">{post.author.displayName}</span>
              {post.author.role === "ADMIN" && (
                <Badge className="bg-copper text-white text-[9px] px-1.5 py-0">ADMIN</Badge>
              )}
              {post.author.role === "MODERATOR" && (
                <Badge className="bg-gold text-charcoal text-[9px] px-1.5 py-0">MOD</Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{formattedDate}</span>
          </div>
        </div>

        {post.topic && (
          <Badge variant="outline" className="text-gold border-gold/40 text-xs">
            #{post.topic}
          </Badge>
        )}
      </div>

      {/* Content */}
      <p className="text-ink text-sm leading-relaxed mb-3 whitespace-pre-line">{post.content}</p>

      {/* Media images */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded overflow-hidden">
          {post.media.map((item) => (
            <img
              key={item.id}
              src={item.url}
              alt="Post image"
              className="w-full h-48 object-cover rounded border border-border"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              liked ? "text-red-500 font-bold" : "hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likeCount} Thích</span>
          </button>

          <Link
            href={`/community/posts/${post.id}`}
            className="flex items-center gap-1.5 hover:text-copper transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post._count.comments} Bình luận</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {currentUserId === post.author.id && (
            <button onClick={handleDelete} className="hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleReport} className="hover:text-gold transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
